import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const ADMIN_URL = 'http://192.168.1.100:8000/admin.html';

export default function App() {
  const webRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ipModal, setIpModal] = useState(!__DEV__);
  const [serverIp, setServerIp] = useState('192.168.1.100');
  const [port, setPort] = useState('8000');

  const getUrl = () => `http://${serverIp}:${port}/admin.html`;

  const reload = () => {
    setLoading(true);
    setProgress(0);
    webRef.current?.reload();
  };

  if (ipModal) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F2E9" />
        <View style={styles.ipModal}>
          <Text style={styles.ipTitle}>gul-o-rang Admin</Text>
          <Text style={styles.ipSub}>Enter your server address</Text>
          <TextInput style={styles.ipInput} value={serverIp} onChangeText={setServerIp} placeholder="192.168.1.100" keyboardType="decimal-pad" />
          <TextInput style={styles.ipInput} value={port} onChangeText={setPort} placeholder="8000" keyboardType="number-pad" />
          <TouchableOpacity style={styles.ipButton} onPress={() => setIpModal(false)}>
            <Text style={styles.ipButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F2E9" />
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.progressBg}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
          <ActivityIndicator size="small" color="#D4897A" />
        </View>
      )}
      <WebView
        ref={webRef}
        source={{ uri: getUrl() }}
        style={styles.webview}
        onLoadProgress={({ nativeEvent }) => {
          setProgress(nativeEvent.progress);
          if (nativeEvent.progress >= 0.9) setLoading(false);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => Alert.alert('Connection Error', `Could not reach ${getUrl()}\nCheck the server IP and port.`)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsBackForwardNavigationGestures={true}
        allowsInlineMediaPlayback={true}
        sharedCookiesEnabled={true}
      />
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={reload}>
          <Text style={styles.toolBtnText}>↻</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => webRef.current?.goBack()}>
          <Text style={styles.toolBtnText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => webRef.current?.goForward()}>
          <Text style={styles.toolBtnText}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => setIpModal(true)}>
          <Text style={styles.toolBtnText}>⚙</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F2E9' },
  webview: { flex: 1, backgroundColor: '#F8F2E9' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    paddingTop: 8, paddingHorizontal: 16, paddingBottom: 4,
    backgroundColor: '#F8F2E9',
  },
  progressBg: { height: 3, backgroundColor: '#EED0C8', borderRadius: 2, marginBottom: 8 },
  progressBar: { height: 3, backgroundColor: '#D4897A', borderRadius: 2 },
  toolbar: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E8DDD2',
    paddingVertical: 6, paddingBottom: 20,
  },
  toolBtn: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  toolBtnText: { fontSize: 22, color: '#2C2420' },
  ipModal: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  ipTitle: { fontSize: 24, fontWeight: '700', fontFamily: 'System', color: '#2C2420', marginBottom: 4 },
  ipSub: { fontSize: 14, color: '#8B7D6B', marginBottom: 24 },
  ipInput: {
    width: '100%', maxWidth: 300, borderWidth: 1, borderColor: '#E8DDD2',
    borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 12,
    backgroundColor: '#FFFFFF', textAlign: 'center',
  },
  ipButton: {
    backgroundColor: '#D4897A', paddingVertical: 14, paddingHorizontal: 48,
    borderRadius: 100, marginTop: 8,
  },
  ipButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
