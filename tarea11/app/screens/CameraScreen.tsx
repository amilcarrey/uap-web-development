import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { colors } from '../theme';
import { usePhotos } from '../context/PhotosContext';

export default function CameraScreen() {
  const [camPerm, requestCamPerm] = useCameraPermissions();
  const [locStatus, setLocStatus] = useState<Location.PermissionStatus | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { addPhoto } = usePhotos();
  const [isTaking, setIsTaking] = useState(false);

  useEffect(() => {
    (async () => {
      if (!camPerm?.granted) {
        await requestCamPerm();
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocStatus(status);
    })();
  }, []);

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;
      setIsTaking(true);
      const photo = await cameraRef.current.takePictureAsync({});
      let coords: { latitude: number | null, longitude: number | null } = { latitude: null, longitude: null };
      try {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {
        // location optional
      }
      addPhoto({
        uri: photo.uri,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: Date.now(),
      });
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo tomar la foto');
    } finally {
      setIsTaking(false);
    }
  };

  if (!camPerm) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (!camPerm.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Se necesita permiso de cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestCamPerm}>
          <Text style={styles.buttonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.capture} onPress={takePhoto} disabled={isTaking}>
          {isTaking ? <ActivityIndicator /> : <Text style={styles.captureText}>●</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { color: colors.text, marginBottom: 12 },
  button: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  buttonText: { color: colors.text, fontWeight: '700' },
  bottomBar: {
    position: 'absolute',
    bottom: 36,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    height: 72,
    width: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  captureText: { color: colors.primary, fontSize: 28, fontWeight: '900' },
});
