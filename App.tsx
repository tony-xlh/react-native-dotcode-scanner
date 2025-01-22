import React, { useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarcodeScanner } from './components/BarcodeScanner';
import { CameraEnhancer, LicenseManager } from 'dynamsoft-capture-vision-react-native';

function App(): React.JSX.Element {
  const [isScanning, setIsScanning] = React.useState(false);
  useEffect(()=>{
    LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9')
    .then(()=>{/*Init license successfully.*/})
    .catch(error => console.error('Init License failed.', error));
    CameraEnhancer.requestCameraPermission();
  },[]);
  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };
  return (
    <SafeAreaView style={styles.container}>
      {isScanning &&
      <>
        <BarcodeScanner />
        <View style={styles.controls}>
          <Button title="Stop Scanning" onPress={toggleScanning}/>
        </View>
      </>}
      {!isScanning &&
        <>
          <Text>DotCode Scanner</Text>
          <Button title="Start Scanning" onPress={toggleScanning}/>
        </>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
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
