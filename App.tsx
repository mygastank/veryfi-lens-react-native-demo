/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import VeryfiLens from '@veryfi/react-native-veryfi-lens';
import {
  VERYFI_CLIENT_ID,
  VERYFI_USERNAME,
  VERYFI_API_KEY,
  VERYFI_URL,
} from '@env';
import * as Sentry from '@sentry/react-native';

import {
  Image,
  NativeEventEmitter,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const veryfiLensCredentials = {
  url: VERYFI_URL,
  clientId: VERYFI_CLIENT_ID,
  userName: VERYFI_USERNAME,
  apiKey: VERYFI_API_KEY,
};

const veryfiLensSettings = {
  blurDetectionIsOn: true,
  autoLightDetectionIsOn: false,
  documentTypes: ['receipt'],
  showDocumentTypes: true,
  dataExtractionEngine: 'api',
};

const VeryfiLensEmitter = new NativeEventEmitter(VeryfiLens.NativeModule);
let hasListeners = false;

Sentry.init({
  dsn: 'https://b8c1ee2bead34aa5b99f4901112e67d5@o333450.ingest.sentry.io/1860308',
});

const App = () => {
  const [log, setLog] = useState(
    "   Here you will see JSON results from a scan's data extraction performed by the Veryfi API.\n\n   Look carefully, there are 30+ fields (inc. line items) extracted and understood by Veryfi's AI.\n\n   Before you begin, please find a receipt, bill or invoice. Then when ready, press the green COLLECT button below. This will start the Veryfi Lens camera used to capture, preprocess and prepared the document for real-time data extraction.\n\n If you need help, please contact support@veryfi.com\n\n",
  );
  const [thumbnail, setThumbnail] = useState(
    'https://cdn.veryfi.com/wp-content/uploads/Screen-Shot-2017-11-20-at-12.02.57-PM.png',
  );
  const updateLog = (event: any) => {
    setLog(_log => _log + '\n\n' + JSON.stringify(event, null, ' '));
    if ('msg' in event && event.msg === 'img_original_path') {
      setThumbnail(
        _thumbnail => 'file://' + event.data + '?d=' + event.package_id,
      );
      VeryfiLens.getFileBase64(
        event.data,
        (error: any) => {
          console.error(`Error found! ${error}`);
        },
        (dataBase64: any) => {
          console.log(`dataBase64 ${dataBase64} returned`);
        },
      );
    }
  };
  const setupListeners = () => {
    if (!hasListeners) {
      VeryfiLensEmitter.addListener(
        VeryfiLens.Events.onVeryfiLensClose,
        updateLog,
      );
      VeryfiLensEmitter.addListener(
        VeryfiLens.Events.onVeryfiLensUpdate,
        updateLog,
      );
      VeryfiLensEmitter.addListener(
        VeryfiLens.Events.onVeryfiLensError,
        updateLog,
      );
      VeryfiLensEmitter.addListener(
        VeryfiLens.Events.onVeryfiLensSuccess,
        updateLog,
      );
      hasListeners = true;
    }
  };

  const showCamera = () => {
    setupListeners();
    VeryfiLens.configureWithCredentials(
      veryfiLensCredentials,
      veryfiLensSettings,
      () => {
        VeryfiLens.showCamera();
      },
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.background}>
        <Text style={styles.title}> {'Welcome to Veryfi Lens Demo'} </Text>
        <Image style={styles.thumbnail} source={{ uri: thumbnail }} />
        <View style={styles.logBox}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Text style={styles.logText}>{log}</Text>
          </ScrollView>
        </View>
        <View style={styles.veryfiButton}>
          <TouchableOpacity onPress={showCamera}>
            <Text style={styles.textBoldCenter}>COLLECT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.veryfiButton}>
          <TouchableOpacity onPress={() => Sentry.close()}>
            <Text style={styles.textBoldCenter}>crash the app</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  logBox: {
    margin: 16,
    backgroundColor: '#ADD8E6',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
  },
  logText: {
    margin: 16,
    textAlign: 'left',
    fontSize: 17,
    fontWeight: '300',
  },
  veryfiButton: {
    borderColor: '#3FCD8D',
    borderWidth: 2,
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 32,
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: '500',
  },
  container: {
    paddingTop: 50,
  },
  thumbnail: {
    alignSelf: 'center',
    width: 200,
    height: 200,
  },
  textBoldCenter: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 2,
  },
});

export default App;
