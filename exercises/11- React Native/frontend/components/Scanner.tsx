import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Modal, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { parseCourseIdFromQRCode } from '@/services/qr';

export default function Scanner({
  visible,
  onScanned,
  onCancel,
}: {
  visible: boolean;
  onScanned: (courseId: string) => void;
  onCancel: () => void;
}) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Web fallback: prompt
  useEffect(() => {
    if (Platform.OS === 'web' && visible) {
      const id = window.prompt('Introduce el id del curso (p. ej. curso-1) o pega el contenido del QR:');
      onCancel();
      if (id) onScanned(id.trim());
    }
  }, [visible, onCancel, onScanned]);

  if (!visible) return null;

  if (Platform.OS === 'web') return null;

  if (hasPermission === false) {
    return (
      <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text>Permiso de cámara denegado</Text>
            <Pressable onPress={onCancel} style={styles.button}><Text>Cerrar</Text></Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={({ data }) => {
            if (scanned) return;
            setScanned(true);
            const courseId = parseCourseIdFromQRCode(data);
            if (courseId) onScanned(courseId);
            else Alert.alert('QR inválido', 'No se reconoció el formato del QR.');
            setTimeout(() => setScanned(false), 800);
            onCancel();
          }}
          ratio="16:9"
        />
        <View style={styles.overlay}>
          <Text style={styles.text}>Apunta al QR del curso</Text>
          <Pressable onPress={onCancel} style={styles.cancel}><Text style={{ color: '#fff' }}>Cancelar</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scannerContainer: { flex: 1, backgroundColor: '#000' },
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' },
  text: { color: '#fff', marginBottom: 12, fontWeight: '700' },
  cancel: { padding: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: '#fff', borderRadius: 8, padding: 16, alignItems: 'center' },
  button: { marginTop: 12, padding: 8, backgroundColor: '#eee', borderRadius: 6 },
});