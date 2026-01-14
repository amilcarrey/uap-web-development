import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';

import { RootStackParamList } from '../navigation/AppNavigator';
import {
  Treasure,
  UserLocation,
  TreasureRarity,
  COLLECTION_DISTANCE,
} from '../types';
import {
  generateTreasures,
  calculateDistance,
  saveTreasures,
  loadTreasures,
} from '../utils/treasureUtils';
import {
  requestLocationPermissions,
  getCurrentLocation,
  startLocationTracking,
  stopLocationTracking,
  getMapRegion,
} from '../utils/locationUtils';
import TreasureMarker from '../components/TreasureMarker';
import TreasureModal from '../components/TreasureModal';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

/**
 * Pantalla principal del mapa donde se muestran los tesoros y la ubicación del usuario
 */
const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const mapRef = useRef<any>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Estados del componente
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const [showTreasureModal, setShowTreasureModal] = useState(false);

  /**
   * Inicializa la aplicación solicitando permisos y cargando datos
   */
  useEffect(() => {
    initializeApp();
    
    // Cleanup al desmontar el componente
    return () => {
      if (locationSubscription.current) {
        stopLocationTracking(locationSubscription.current);
      }
    };
  }, []);

  /**
   * Verifica proximidad a tesoros cuando cambia la ubicación del usuario
   */
  useEffect(() => {
    if (userLocation) {
      checkTreasureProximity();
    }
  }, [userLocation, treasures]);

  /**
   * Función principal de inicialización
   */
  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Solicitar permisos de ubicación
      const hasPermissions = await requestLocationPermissions();
      if (!hasPermissions) {
        Alert.alert(
          'Permisos requeridos',
          'Esta aplicación necesita acceso a tu ubicación para funcionar correctamente.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      // Obtener ubicación actual
      const currentLocation = await getCurrentLocation();
      if (!currentLocation) {
        Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
        setIsLoading(false);
        return;
      }

      setUserLocation(currentLocation);
      setMapRegion(getMapRegion(currentLocation.coordinates));

      // Cargar tesoros existentes o generar nuevos
      await loadOrGenerateTreasures(currentLocation.coordinates);

      // Iniciar seguimiento de ubicación
      startLocationWatching();
      
    } catch (error) {
      console.error('Error inicializando aplicación:', error);
      Alert.alert('Error', 'Hubo un problema inicializando la aplicación.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carga tesoros existentes o genera nuevos si no existen
   */
  const loadOrGenerateTreasures = async (userCoords: any) => {
    try {
      const savedTreasures = await loadTreasures();
      
      if (savedTreasures.length > 0) {
        setTreasures(savedTreasures);
      } else {
        // Generar nuevos tesoros
        const newTreasures = generateTreasures(userCoords);
        setTreasures(newTreasures);
        await saveTreasures(newTreasures);
      }
    } catch (error) {
      console.error('Error cargando/generando tesoros:', error);
    }
  };

  /**
   * Inicia el seguimiento de la ubicación del usuario
   */
  const startLocationWatching = async () => {
    try {
      locationSubscription.current = await startLocationTracking((location) => {
        setUserLocation(location);
        
        // Actualizar región del mapa si es necesario
        if (mapRef.current) {
          const newRegion = getMapRegion(location.coordinates);
          setMapRegion(newRegion);
        }
      });
    } catch (error) {
      console.error('Error iniciando seguimiento de ubicación:', error);
    }
  };

  /**
   * Verifica si el usuario está cerca de algún tesoro no recolectado
   */
  const checkTreasureProximity = () => {
    if (!userLocation) return;

    treasures.forEach((treasure) => {
      if (!treasure.isCollected) {
        const distance = calculateDistance(
          userLocation.coordinates,
          treasure.coordinates
        );

        if (distance <= COLLECTION_DISTANCE) {
          collectTreasure(treasure);
        }
      }
    });
  };

  /**
   * Recolecta un tesoro cuando el usuario está cerca
   */
  const collectTreasure = async (treasure: Treasure) => {
    try {
      // Marcar tesoro como recolectado
      const updatedTreasures = treasures.map((t) =>
        t.id === treasure.id
          ? { ...t, isCollected: true, collectedAt: new Date() }
          : t
      );

      setTreasures(updatedTreasures);
      await saveTreasures(updatedTreasures);

      // Mostrar modal de recolección
      setSelectedTreasure({ ...treasure, isCollected: true, collectedAt: new Date() });
      setShowTreasureModal(true);
    } catch (error) {
      console.error('Error recolectando tesoro:', error);
      Alert.alert('Error', 'No se pudo recolectar el tesoro.');
    }
  };

  /**
   * Centra el mapa en la ubicación del usuario
   */
  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      const region = getMapRegion(userLocation.coordinates);
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  /**
   * Navega a la pantalla de inventario
   */
  const goToInventory = () => {
    navigation.navigate('Inventory');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  if (!userLocation || !mapRegion) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo obtener tu ubicación</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeApp}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mapa principal */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Marcadores de tesoros */}
        {treasures.map((treasure) => (
          <TreasureMarker
            key={treasure.id}
            treasure={treasure}
            onPress={() => {
              // Opcional: mostrar información del tesoro al tocarlo
            }}
          />
        ))}
      </MapView>

      {/* Botón para centrar en usuario */}
      <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
        <Text style={styles.centerButtonText}>📍</Text>
      </TouchableOpacity>

      {/* Botón flotante para inventario */}
      <TouchableOpacity style={styles.inventoryButton} onPress={goToInventory}>
        <Text style={styles.inventoryButtonText}>🎒</Text>
      </TouchableOpacity>

      {/* Modal de tesoro recolectado */}
      <TreasureModal
        visible={showTreasureModal}
        treasure={selectedTreasure}
        onClose={() => {
          setShowTreasureModal(false);
          setSelectedTreasure(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2E8B57',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerButtonText: {
    fontSize: 20,
  },
  inventoryButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FFD700',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inventoryButtonText: {
    fontSize: 24,
  },
});

export default MapScreen;