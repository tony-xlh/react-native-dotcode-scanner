import React, {useEffect, useRef} from 'react';
import {CameraEnhancer, CameraView, CaptureVisionRouter, DecodedBarcodesResult} from 'dynamsoft-capture-vision-react-native';
import { StyleSheet } from 'react-native';

const dotcodeTemplate = `{
  "CaptureVisionTemplates": [
    {
      "Name": "Dotcode",
      "ImageROIProcessingNameArray": [
        "roi_read_dotcode"
      ],
      "Timeout": 700,
      "MaxParallelTasks":0
    }
  ],
  "TargetROIDefOptions": [
    {
      "Name": "roi_read_dotcode",
      "TaskSettingNameArray": [
        "task_read_dotcode"
      ]
    }
  ],
  "BarcodeFormatSpecificationOptions": [
    {
      "Name": "format_specification_read_dotcode",
      "BarcodeFormatIds": [
        "BF_DOTCODE"
      ],
      "MirrorMode": "MM_BOTH"
    }
  ],
  "BarcodeReaderTaskSettingOptions": [
    {
      "Name": "task_read_dotcode",
      "ExpectedBarcodesCount" : 1,
      "BarcodeFormatIds" : [ "BF_DOTCODE" ],
      "LocalizationModes": [
        {
          "Mode" : "LM_STATISTICS_MARKS"
        }
      ],
      "DeblurModes":
      [
        {
          "Mode": "DM_BASED_ON_LOC_BIN"
        },
        {
          "Mode": "DM_THRESHOLD_BINARIZATION"
        },
        {
          "Mode": "DM_DEEP_ANALYSIS"
        }
      ],
      "BarcodeFormatSpecificationNameArray": [
        "format_specification_read_dotcode"
      ],
      "SectionImageParameterArray": [
        {
          "Section": "ST_REGION_PREDETECTION",
          "ImageParameterName": "ip_read_dotcode"
        },
        {
          "Section": "ST_BARCODE_LOCALIZATION",
          "ImageParameterName": "ip_read_dotcode"
        },
        {
          "Section": "ST_BARCODE_DECODING",
          "ImageParameterName": "ip_read_dotcode"
        }
      ]
    }
  ],
  "ImageParameterOptions": [
    {
      "Name": "ip_read_dotcode",
      "BinarizationModes": [
        {
          "Mode": "BM_LOCAL_BLOCK",
          "BlockSizeX": 15,
          "BlockSizeY": 15,
          "EnableFillBinaryVacancy": 0,
          "ThresholdCompensation": 10
        },
        {
          "Mode": "BM_LOCAL_BLOCK",
          "BlockSizeX": 21,
          "BlockSizeY": 21,
          "EnableFillBinaryVacancy": 0,
          "ThresholdCompensation": 10,
          "MorphOperation":"Erode",
          "MorphOperationKernelSizeX":3,
          "MorphOperationKernelSizeY":3,
          "MorphShape":"Ellipse"
        },
        {
          "Mode": "BM_LOCAL_BLOCK",
          "BlockSizeX": 35,
          "BlockSizeY": 35,
          "EnableFillBinaryVacancy": 0,
          "ThresholdCompensation": 10,
          "MorphOperation":"Erode",
          "MorphOperationKernelSizeX":3,
          "MorphOperationKernelSizeY":3,
          "MorphShape":"Ellipse"
        },
        {
          "Mode": "BM_LOCAL_BLOCK",
          "BlockSizeX": 45,
          "BlockSizeY": 45,
          "EnableFillBinaryVacancy": 0,
          "ThresholdCompensation": 25,
          "MorphOperation":"Erode",
          "MorphOperationKernelSizeX":3,
          "MorphOperationKernelSizeY":3,
          "MorphShape":"Ellipse"
        }
      ],
      "GrayscaleEnhancementModes": [
        {
          "Mode": "GEM_GENERAL"
        }
      ],
      "GrayscaleTransformationModes": [
        {
          "Mode": "GTM_INVERTED"
        },
        {
          "Mode": "GTM_ORIGINAL"
        }
      ]
    }
  ]
}`;

export interface ScannerProps{
  onScanned?: (result:DecodedBarcodesResult) => void;
}

export function BarcodeScanner(props:ScannerProps) {
  const cameraView = useRef<CameraView>(null);
  const camera = CameraEnhancer.getInstance();
  const router = CaptureVisionRouter.getInstance();
  useEffect(() => {
    router.initSettings(dotcodeTemplate);
    router.setInput(camera);
    camera.setCameraView(cameraView.current!!);
    let resultReceiver = router.addResultReceiver({
      onDecodedBarcodesReceived: (result: DecodedBarcodesResult) =>  {
        console.log('scanned');
        if (props.onScanned) {
          props.onScanned(result);
        }
      },
    });
    camera.setScanRegion({
      left: 0,
      top: 0.4,
      right: 1,
      bottom: 0.6,
      measuredInPercentage: true,
    });
    camera.open();
    router.startCapturing('Dotcode');

    return () => {
      router.removeResultReceiver(resultReceiver!);
      camera.close();
      router.stopCapturing();
    };
  }, [camera, router, cameraView, props]);

  return (
    <CameraView style={styles.container} ref={cameraView} />
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
  },
});
