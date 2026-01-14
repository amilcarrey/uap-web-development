import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export interface PhotoData {
  uri: string;
  location: Location.LocationObject | null;
  timestamp: number;
}

// Clave para AsyncStorage
const PHOTOS_STORAGE_KEY = '@appnativa_t11_photos';

export default function usePhotoStorage() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar fotos al iniciar
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const storedPhotos = await AsyncStorage.getItem(PHOTOS_STORAGE_KEY);
      if (storedPhotos !== null) {
        setPhotos(JSON.parse(storedPhotos));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('Error', 'No se pudieron cargar las fotos');
    } finally {
      setIsLoading(false);
    }
  };

  const savePhoto = async (photo: PhotoData) => {
    try {
      const newPhotos = [...photos, photo];
      setPhotos(newPhotos);
      await AsyncStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(newPhotos));
      return true;
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'No se pudo guardar la foto');
      return false;
    }
  };

  const clearPhotos = async () => {
    try {
      setPhotos([]);
      await AsyncStorage.removeItem(PHOTOS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing photos:', error);
      Alert.alert('Error', 'No se pudieron eliminar las fotos');
      return false;
    }
  };

  return { photos, isLoading, savePhoto, clearPhotos };
}