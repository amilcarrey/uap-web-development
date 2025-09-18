import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PhotoData {
  uri: string;
  location: Location.LocationObject | null;
  timestamp: number;
}

interface CameraComponentProps {
  onPhotoTaken: (photo: PhotoData) => void;
}

export default function CameraComponent({ onPhotoTaken }: CameraComponentProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      // Solicitar permisos de ubicación y medios
      const [locationStatus, mediaLibraryStatus] = await Promise.all([
        Location.requestForegroundPermissionsAsync(),
        MediaLibrary.requestPermissionsAsync()
      ]);

      setHasLocationPermission(locationStatus.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasLocationPermission(status === 'granted');
    return status === 'granted';
  };

  const takePicture = async () => {
    if (isTakingPhoto || !permission?.granted) return;
    
    setIsTakingPhoto(true);
    
    try {
      // Verificar y solicitar permisos de ubicación si es necesario
      let locationPermissionGranted = hasLocationPermission;
      if (!locationPermissionGranted) {
        locationPermissionGranted = await requestLocationPermission();
      }

      if (!locationPermissionGranted) {
        Alert.alert(
          'Permiso de ubicación requerido',
          'Necesitamos acceso a tu ubicación para guardar la localización de las fotos. Por favor, concede el permiso en la configuración de tu dispositivo.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        const location = await Location.getCurrentPositionAsync({});
        
        if (hasMediaLibraryPermission) {
          try {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
          } catch (mediaError) {
            console.warn('No se pudo guardar en la galería:', mediaError);
          }
        }

        onPhotoTaken({
          uri: photo.uri,
          location,
          timestamp: Date.now()
        });
        
  // Alert de éxito eliminado para evitar doble mensaje
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      Alert.alert('❌ Error', 'No se pudo tomar la foto. Verifica que todos los permisos estén concedidos.');
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.message}>Necesitamos tu permiso para usar la cámara</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Conceder permiso de cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      />
      {/* Botones superpuestos sobre la cámara */}
      <View style={styles.buttonContainerAbsolute} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.button}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.text}>🔄 Voltear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.captureButton, isTakingPhoto && styles.disabledButton]}
          onPress={takePicture}
          disabled={isTakingPhoto}
        >
          {isTakingPhoto ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={[styles.text, styles.captureText]}>📸 Capturar</Text>
          )}
        </TouchableOpacity>
      </View>
      {hasLocationPermission === false && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            ⚠️ La aplicación no tiene permisos de ubicación. Las fotos no guardarán tu localización.
          </Text>
          <TouchableOpacity
            style={styles.warningButton}
            onPress={requestLocationPermission}
          >
            <Text style={styles.warningButtonText}>Conceder permiso de ubicación</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ...existing code...
  buttonContainerAbsolute: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  button: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureText: {
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  warningBanner: {
    backgroundColor: '#FFCC00',
    padding: 15,
    alignItems: 'center',
  },
  warningText: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  warningButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  warningButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});