'use client'; // necesario en App Router
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

export default function Index() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return <Text>Solicitando permisos...</Text>;
  }

  if (!hasCameraPermission) return <Text>No se permitió acceso a la cámara</Text>;
  if (!hasLocationPermission) return <Text>No se permitió acceso a la ubicación</Text>;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>¡Permisos concedidos! Puedes continuar con la app.</Text>
    </View>
  );
}
