import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import CameraComponent from '../components/CameraComponent';
import PhotoGallery from '../components/PhotoGallery';
import usePhotoStorage, { PhotoData } from '../hooks/usePhotoStorage';

export default function App() {
  const [currentView, setCurrentView] = useState<'camera' | 'gallery'>('camera');
  const { photos, isLoading, savePhoto, clearPhotos } = usePhotoStorage();

  const handlePhotoTaken = async (photo: PhotoData) => {
    const success = await savePhoto(photo);
    if (success) {
      Alert.alert('✅ Foto guardada', 'La foto se ha capturado con éxito junto con tu ubicación.');
    }
  };

  const handleClearPhotos = async () => {
    Alert.alert(
      "Eliminar todas las fotos",
      "¿Estás seguro de que quieres eliminar todas las fotos? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          onPress: async () => {
            const success = await clearPhotos();
            if (success) {
              Alert.alert('Éxito', 'Todas las fotos han sido eliminadas.');
            }
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  if (isLoading && currentView === 'gallery') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando fotos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, currentView === 'camera' && styles.activeTab]}
          onPress={() => setCurrentView('camera')}
        >
          <Text style={styles.tabText}>Cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentView === 'gallery' && styles.activeTab]}
          onPress={() => setCurrentView('gallery')}
        >
          <Text style={styles.tabText}>Galería ({photos.length})</Text>
        </TouchableOpacity>
      </View>

      {currentView === 'camera' ? (
        <CameraComponent onPhotoTaken={handlePhotoTaken} />
      ) : (
        <View style={styles.galleryContainer}>
          <PhotoGallery photos={photos} />
          {photos.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearPhotos}>
              <Text style={styles.clearButtonText}>Eliminar Todas las Fotos</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  galleryContainer: {
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});