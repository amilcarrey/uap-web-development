// Tipos de datos para la aplicación de búsqueda de tesoros

/**
 * Enum para definir los diferentes tipos de rareza de tesoros
 */
export enum TreasureRarity {
  COMMON = 'común',
  RARE = 'raro',
  EPIC = 'épico',
  SECRET = 'secreto'
}

/**
 * Interface para definir las coordenadas geográficas
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Interface para definir un tesoro en el mapa
 */
export interface Treasure {
  id: string;
  coordinates: Coordinates;
  rarity: TreasureRarity;
  isCollected: boolean;
  collectedAt?: Date;
}

/**
 * Interface para el inventario del usuario
 */
export interface InventoryItem {
  rarity: TreasureRarity;
  count: number;
}

/**
 * Interface para la ubicación del usuario
 */
export interface UserLocation {
  coordinates: Coordinates;
  accuracy?: number;
  timestamp: number;
}

/**
 * Probabilidades para generar tesoros por rareza
 */
export const TREASURE_PROBABILITIES = {
  [TreasureRarity.COMMON]: 0.7,   // 70%
  [TreasureRarity.RARE]: 0.2,     // 20%
  [TreasureRarity.EPIC]: 0.09,    // 9%
  [TreasureRarity.SECRET]: 0.01   // 1%
};

/**
 * Distancia mínima para recolectar un tesoro (en metros)
 */
export const COLLECTION_DISTANCE = 50;

/**
 * Número de tesoros a generar alrededor del usuario
 */
export const TREASURE_COUNT = 8;