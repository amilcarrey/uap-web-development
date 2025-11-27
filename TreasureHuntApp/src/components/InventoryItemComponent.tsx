import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InventoryItem, TreasureRarity } from '../types';

interface InventoryItemComponentProps {
  item: InventoryItem;
  color: string;
  emoji: string;
  onPress?: () => void;
}

/**
 * Componente que renderiza un item individual del inventario
 * Muestra la rareza, cantidad y información visual del tesoro
 */
const InventoryItemComponent: React.FC<InventoryItemComponentProps> = ({
  item,
  color,
  emoji,
  onPress,
}) => {
  /**
   * Obtiene el texto descriptivo de la rareza
   */
  const getRarityDisplayName = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return 'Común';
      case TreasureRarity.RARE:
        return 'Raro';
      case TreasureRarity.EPIC:
        return 'Épico';
      case TreasureRarity.SECRET:
        return 'Secreto';
      default:
        return 'Desconocido';
    }
  };

  /**
   * Obtiene la descripción adicional según la rareza
   */
  const getRarityDescription = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return 'Tesoros básicos encontrados frecuentemente';
      case TreasureRarity.RARE:
        return 'Tesoros especiales con valor aumentado';
      case TreasureRarity.EPIC:
        return 'Tesoros extraordinarios muy codiciados';
      case TreasureRarity.SECRET:
        return 'Los tesoros más legendarios y únicos';
      default:
        return 'Tesoro de origen desconocido';
    }
  };

  /**
   * Obtiene el color de fondo según la rareza
   */
  const getBackgroundColor = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return '#F5F5DC'; // Beige claro
      case TreasureRarity.RARE:
        return '#E6F3FF'; // Azul muy claro
      case TreasureRarity.EPIC:
        return '#F0E6FF'; // Púrpura muy claro
      case TreasureRarity.SECRET:
        return '#FFFACD'; // Amarillo muy claro
      default:
        return '#F8F8F8';
    }
  };

  /**
   * Obtiene el texto del contador con formato apropiado
   */
  const getCountText = (count: number): string => {
    if (count === 1) {
      return '1 tesoro';
    }
    return `${count} tesoros`;
  };

  /**
   * Obtiene las estrellas de rareza para mostrar visualmente la importancia
   */
  const getRarityStars = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return '⭐';
      case TreasureRarity.RARE:
        return '⭐⭐';
      case TreasureRarity.EPIC:
        return '⭐⭐⭐';
      case TreasureRarity.SECRET:
        return '⭐⭐⭐⭐';
      default:
        return '';
    }
  };

  const displayName = getRarityDisplayName(item.rarity);
  const description = getRarityDescription(item.rarity);
  const backgroundColor = getBackgroundColor(item.rarity);
  const countText = getCountText(item.count);
  const stars = getRarityStars(item.rarity);

  const ItemContent = (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Icono y información principal */}
      <View style={styles.mainContent}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.rarityName, { color }]}>
              {displayName}
            </Text>
            <Text style={styles.stars}>{stars}</Text>
          </View>
          
          <Text style={styles.description}>
            {description}
          </Text>
          
          <Text style={[styles.count, { color }]}>
            {countText}
          </Text>
        </View>
      </View>

      {/* Barra de progreso visual (decorativa) */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressBar,
              { 
                backgroundColor: color,
                width: `${Math.min((item.count / 10) * 100, 100)}%`
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {item.count > 10 ? 'Maestro Coleccionista' : `${item.count}/10`}
        </Text>
      </View>

      {/* Indicador especial para tesoros secretos */}
      {item.rarity === TreasureRarity.SECRET && (
        <View style={styles.specialBadge}>
          <Text style={styles.specialBadgeText}>LEGENDARIO</Text>
        </View>
      )}
    </View>
  );

  // Si hay un onPress, envolver en TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {ItemContent}
      </TouchableOpacity>
    );
  }

  return ItemContent;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rarityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stars: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    lineHeight: 18,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    minWidth: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  specialBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  specialBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default InventoryItemComponent;