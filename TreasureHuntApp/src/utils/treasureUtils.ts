import AsyncStorage from '@react-native-async-storage/async-storage';
import { Treasure, TreasureRarity, Coordinates, InventoryItem, TREASURE_PROBABILITIES, TREASURE_COUNT } from '../types';

/**
 * Genera un ID único para cada tesoro
 */
const generateTreasureId = (): string => {
  return `treasure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Selecciona una rareza aleatoria basada en las probabilidades definidas
 */
const getRandomRarity = (): TreasureRarity => {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const [rarity, probability] of Object.entries(TREASURE_PROBABILITIES)) {
    cumulativeProbability += probability;
    if (random <= cumulativeProbability) {
      return rarity as TreasureRarity;
    }
  }
  
  // Fallback a común si algo sale mal
  return TreasureRarity.COMMON;
};

/**
 * Genera coordenadas aleatorias alrededor de una ubicación central
 * @param centerLat Latitud central
 * @param centerLng Longitud central
 * @param radiusKm Radio en kilómetros para generar tesoros
 */
const generateRandomCoordinates = (centerLat: number, centerLng: number, radiusKm: number = 1): Coordinates => {
  // Convertir radio de km a grados (aproximación)
  const radiusInDegrees = radiusKm / 111; // 1 grado ≈ 111 km
  
  // Generar ángulo aleatorio
  const angle = Math.random() * 2 * Math.PI;
  
  // Generar distancia aleatoria dentro del radio
  const distance = Math.random() * radiusInDegrees;
  
  // Calcular nuevas coordenadas
  const deltaLat = distance * Math.cos(angle);
  const deltaLng = distance * Math.sin(angle);
  
  return {
    latitude: centerLat + deltaLat,
    longitude: centerLng + deltaLng
  };
};

/**
 * Genera una lista de tesoros aleatorios alrededor de la ubicación del usuario
 * @param userLocation Ubicación actual del usuario
 */
export const generateTreasures = (userLocation: Coordinates): Treasure[] => {
  const treasures: Treasure[] = [];
  
  for (let i = 0; i < TREASURE_COUNT; i++) {
    const treasure: Treasure = {
      id: generateTreasureId(),
      coordinates: generateRandomCoordinates(userLocation.latitude, userLocation.longitude),
      rarity: getRandomRarity(),
      isCollected: false
    };
    
    treasures.push(treasure);
  }
  
  return treasures;
};

/**
 * Calcula la distancia entre dos puntos geográficos usando una fórmula simplificada
 * @param coord1 Primera coordenada
 * @param coord2 Segunda coordenada
 * @returns Distancia en metros
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLng = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  
  // Fórmula simplificada para distancias cortas
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
};

/**
 * Convierte la lista de tesoros recolectados en un inventario agrupado por rareza
 * @param treasures Lista de todos los tesoros
 */
export const generateInventory = (treasures: Treasure[]): InventoryItem[] => {
  const collectedTreasures = treasures.filter(treasure => treasure.isCollected);
  const inventory: { [key: string]: number } = {};
  
  // Contar tesoros por rareza
  collectedTreasures.forEach(treasure => {
    inventory[treasure.rarity] = (inventory[treasure.rarity] || 0) + 1;
  });
  
  // Convertir a array de InventoryItem
  return Object.entries(inventory).map(([rarity, count]) => ({
    rarity: rarity as TreasureRarity,
    count
  }));
};

// Claves para AsyncStorage
const STORAGE_KEYS = {
  TREASURES: 'treasures',
  INVENTORY: 'inventory'
};

/**
 * Guarda la lista de tesoros en AsyncStorage
 * @param treasures Lista de tesoros a guardar
 */
export const saveTreasures = async (treasures: Treasure[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TREASURES, JSON.stringify(treasures));
  } catch (error) {
    console.error('Error guardando tesoros:', error);
    throw error;
  }
};

/**
 * Carga la lista de tesoros desde AsyncStorage
 * @returns Lista de tesoros guardados o array vacío si no hay datos
 */
export const loadTreasures = async (): Promise<Treasure[]> => {
  try {
    const treasuresJson = await AsyncStorage.getItem(STORAGE_KEYS.TREASURES);
    if (treasuresJson) {
      return JSON.parse(treasuresJson);
    }
    return [];
  } catch (error) {
    console.error('Error cargando tesoros:', error);
    return [];
  }
};

/**
 * Limpia todos los datos guardados (útil para reiniciar el juego)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TREASURES, STORAGE_KEYS.INVENTORY]);
  } catch (error) {
    console.error('Error limpiando datos:', error);
    throw error;
  }
};