import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Treasure, TreasureRarity } from '../types';

interface TreasureMarkerProps {
  treasure: Treasure;
  onPress?: () => void;
}

/**
 * Componente que renderiza un marcador de tesoro en el mapa
 * con diferentes estilos según la rareza y estado de recolección
 */
const TreasureMarker: React.FC<TreasureMarkerProps> = ({ treasure, onPress }) => {
  /**
   * Obtiene el color del marcador según la rareza del tesoro
   */
  const getMarkerColor = (): string => {
    if (treasure.isCollected) {
      return '#CCCCCC'; // Gris para tesoros recolectados
    }

    switch (treasure.rarity) {
      case TreasureRarity.COMMON:
        return '#8B4513'; // Marrón
      case TreasureRarity.RARE:
        return '#4169E1'; // Azul
      case TreasureRarity.EPIC:
        return '#9932CC'; // Púrpura
      case TreasureRarity.SECRET:
        return '#FFD700'; // Dorado
      default:
        return '#FF0000'; // Rojo por defecto
    }
  };

  /**
   * Obtiene el emoji del tesoro según su rareza
   */
  const getTreasureEmoji = (): string => {
    if (treasure.isCollected) {
      return '✅'; // Check mark para tesoros recolectados
    }

    switch (treasure.rarity) {
      case TreasureRarity.COMMON:
        return '📦'; // Caja
      case TreasureRarity.RARE:
        return '💎'; // Diamante
      case TreasureRarity.EPIC:
        return '👑'; // Corona
      case TreasureRarity.SECRET:
        return '🏆'; // Trofeo
      default:
        return '❓'; // Interrogación
    }
  };

  /**
   * Obtiene el tamaño del marcador según la rareza
   */
  const getMarkerSize = (): number => {
    if (treasure.isCollected) {
      return 30; // Más pequeño para tesoros recolectados
    }

    switch (treasure.rarity) {
      case TreasureRarity.COMMON:
        return 35;
      case TreasureRarity.RARE:
        return 40;
      case TreasureRarity.EPIC:
        return 45;
      case TreasureRarity.SECRET:
        return 50; // Más grande para tesoros secretos
      default:
        return 35;
    }
  };

  /**
   * Obtiene el título del marcador para mostrar información adicional
   */
  const getMarkerTitle = (): string => {
    const rarityText = treasure.rarity.charAt(0).toUpperCase() + treasure.rarity.slice(1);
    return treasure.isCollected 
      ? `${rarityText} (Recolectado)` 
      : `Tesoro ${rarityText}`;
  };

  /**
   * Obtiene la descripción del marcador
   */
  const getMarkerDescription = (): string => {
    if (treasure.isCollected && treasure.collectedAt) {
      const date = new Date(treasure.collectedAt);
      return `Recolectado el ${date.toLocaleDateString()} a las ${date.toLocaleTimeString()}`;
    }
    return 'Acércate para recolectar este tesoro';
  };

  const markerSize = getMarkerSize();
  const markerColor = getMarkerColor();
  const emoji = getTreasureEmoji();

  return (
    <Marker
      coordinate={treasure.coordinates}
      title={getMarkerTitle()}
      description={getMarkerDescription()}
      onPress={onPress}
    >
      <View style={[
        styles.markerContainer,
        {
          width: markerSize,
          height: markerSize,
          backgroundColor: markerColor,
        },
        treasure.isCollected && styles.collectedMarker
      ]}>
        <Text style={[
          styles.markerEmoji,
          { fontSize: markerSize * 0.6 }
        ]}>
          {emoji}
        </Text>
        
        {/* Efecto de brillo para tesoros no recolectados */}
        {!treasure.isCollected && (
          <View style={[
            styles.glowEffect,
            {
              width: markerSize + 10,
              height: markerSize + 10,
              borderColor: markerColor,
            }
          ]} />
        )}
        
        {/* Indicador especial para tesoros secretos */}
        {treasure.rarity === TreasureRarity.SECRET && !treasure.isCollected && (
          <View style={styles.secretIndicator}>
            <Text style={styles.secretText}>!</Text>
          </View>
        )}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  collectedMarker: {
    opacity: 0.7,
    borderColor: '#999999',
  },
  markerEmoji: {
    textAlign: 'center',
  },
  glowEffect: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
    opacity: 0.3,
    top: -5,
    left: -5,
  },
  secretIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4500',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  secretText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TreasureMarker;