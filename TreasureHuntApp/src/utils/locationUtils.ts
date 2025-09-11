import * as Location from 'expo-location';
import { UserLocation, Coordinates } from '../types';

/**
 * Solicita permisos de ubicación al usuario
 * @returns Promise que resuelve true si se otorgaron los permisos, false en caso contrario
 */
export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    // Solicitar permisos de ubicación en primer plano
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.warn('Permisos de ubicación denegados');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error solicitando permisos de ubicación:', error);
    return false;
  }
};

/**
 * Obtiene la ubicación actual del usuario
 * @returns Promise con la ubicación actual o null si hay error
 */
export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 1
    });
    
    return {
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      accuracy: location.coords.accuracy || undefined,
      timestamp: location.timestamp
    };
  } catch (error) {
    console.error('Error obteniendo ubicación actual:', error);
    return null;
  }
};

/**
 * Inicia el seguimiento de la ubicación del usuario en tiempo real
 * @param onLocationUpdate Callback que se ejecuta cuando cambia la ubicación
 * @returns Promise con el objeto de suscripción para poder detener el seguimiento
 */
export const startLocationTracking = async (
  onLocationUpdate: (location: UserLocation) => void
): Promise<Location.LocationSubscription | null> => {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000, // Actualizar cada 2 segundos
        distanceInterval: 5  // O cuando se mueva 5 metros
      },
      (location) => {
        const userLocation: UserLocation = {
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          },
          accuracy: location.coords.accuracy || undefined,
          timestamp: location.timestamp
        };
        
        onLocationUpdate(userLocation);
      }
    );
    
    return subscription;
  } catch (error) {
    console.error('Error iniciando seguimiento de ubicación:', error);
    return null;
  }
};

/**
 * Detiene el seguimiento de ubicación
 * @param subscription Suscripción obtenida de startLocationTracking
 */
export const stopLocationTracking = (subscription: Location.LocationSubscription | null): void => {
  if (subscription) {
    subscription.remove();
  }
};

/**
 * Verifica si los servicios de ubicación están habilitados en el dispositivo
 * @returns Promise que resuelve true si están habilitados, false en caso contrario
 */
export const checkLocationServicesEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await Location.hasServicesEnabledAsync();
    return enabled;
  } catch (error) {
    console.error('Error verificando servicios de ubicación:', error);
    return false;
  }
};

/**
 * Obtiene la región del mapa centrada en las coordenadas dadas
 * @param coordinates Coordenadas centrales
 * @param latitudeDelta Delta de latitud para el zoom
 * @param longitudeDelta Delta de longitud para el zoom
 */
export const getMapRegion = (
  coordinates: Coordinates,
  latitudeDelta: number = 0.01,
  longitudeDelta: number = 0.01
) => {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta,
    longitudeDelta
  };
};