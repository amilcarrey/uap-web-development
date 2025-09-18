'use client';
import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);

  const cameraRef = useRef<CameraView | null>(null);
  
  // Hook de permisos de cámara
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      // Solicitar permiso de cámara
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }

      // Solicitar permiso de ubicación
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');
    })();
  }, []);


  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      await savePhoto(photo.uri, loc.coords);
    }
  };

  if (!cameraPermission?.granted || hasLocationPermission === null) {
    return <Text>Solicitando permisos...</Text>;
  }

  if (!cameraPermission?.granted) return <Text>No se permitió acceso a la cámara</Text>;
  if (!hasLocationPermission) return <Text>No se permitió acceso a la ubicación</Text>;

  const savePhoto = async (photoUri: string, coords: { latitude: number; longitude: number }) => {
  try {
    const existing = await AsyncStorage.getItem('photos');
    const photos = existing ? JSON.parse(existing) : [];
    photos.push({ photoUri, coords });
    await AsyncStorage.setItem('photos', JSON.stringify(photos));
  } catch (error) {
    console.log('Error guardando foto:', error);
  }
};


  return (
    <View style={{ flex: 1 }}>
      {!photoUri ? (
        <CameraView ref={cameraRef} style={{ flex: 1 }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={takePhoto} style={styles.button}>
              <Text style={styles.text}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: photoUri }} style={{ width: 300, height: 400 }} />
          {location && (
            <Text>
              Ubicación: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          )}
          <TouchableOpacity onPress={() => setPhotoUri(null)} style={styles.button}>
            <Text style={styles.text}>Tomar otra foto</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#00000080',
    padding: 15,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
