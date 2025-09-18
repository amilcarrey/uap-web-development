import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(true);
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos acceso a tu cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir acceso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });
        
        setPhotos(prev => [photo, ...prev]);
        Alert.alert('Foto tomada', 'La foto ha sido guardada');
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const renderCamera = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Text style={styles.flipText}>Cambiar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.galleryButton} 
            onPress={() => setShowCamera(false)}
          >
            <Text style={styles.galleryText}>Galería ({photos.length})</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );

  const renderGallery = () => (
    <View style={styles.galleryContainer}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setShowCamera(true)}
        >
          <Text style={styles.backText}>← Cámara</Text>
        </TouchableOpacity>
        <Text style={styles.galleryTitle}>Fotos ({photos.length})</Text>
        <View style={styles.spacer} />
      </View>
      
      <ScrollView contentContainerStyle={styles.photosGrid}>
        {photos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.noPhotosText}>No hay fotos aún</Text>
            <Text style={styles.noPhotosSubtext}>Toma tu primera foto con la cámara</Text>
          </View>
        ) : (
          photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <Text style={styles.photoIndex}>Foto {photos.length - index}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {showCamera ? renderCamera() : renderGallery()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    color: '#fff',
    fontSize: 18,
    marginTop: 100,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  flipText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  galleryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  galleryTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  spacer: {
    width: 50,
  },
  photosGrid: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  photoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  thumbnail: {
    width: width - 40,
    height: width - 40,
    borderRadius: 10,
  },
  photoIndex: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  noPhotosText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noPhotosSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});