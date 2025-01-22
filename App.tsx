import React, { useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarcodeScanner } from './components/BarcodeScanner';
import { CameraEnhancer, DecodedBarcodesResult, LicenseManager } from 'dynamsoft-capture-vision-react-native';

function App(): React.JSX.Element {
  const [isScanning, setIsScanning] = React.useState(false);
  const [barcodeText, setBarcodeText] = React.useState('');
  useEffect(()=>{
    LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9')
    .then(()=>{/*Init license successfully.*/})
    .catch(error => console.error('Init License failed.', error));
    CameraEnhancer.requestCameraPermission();
  },[]);

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  const onScanned = (result:DecodedBarcodesResult) => {
    if (result.items && result.items.length > 0) {
      console.log(result.items[0].text);
      toggleScanning();
      setBarcodeText(result.items[0].text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isScanning &&
      <>
        <BarcodeScanner
          onScanned={onScanned}
        />
        <View style={styles.controls}>
          <Button title="Stop Scanning" onPress={toggleScanning}/>
        </View>
      </>}
      {!isScanning &&
        <View style={styles.home}>
          <Text>DotCode Scanner</Text>
          <Button title="Start Scanning" onPress={toggleScanning}/>
          {barcodeText &&
            <Text>{'Result: ' + barcodeText}</Text>
          }
        </View>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  home:{
    alignItems:'center',
  },
  controls:{
    position:'absolute',
    width:'100%',
    alignItems:'center',
    bottom:10,
  },
  button:{
    width: '50%',
  },
});

export default App;
