import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { Treasure, InventoryItem, TreasureRarity } from '../types';
import { loadTreasures, generateInventory, clearAllData } from '../utils/treasureUtils';
import InventoryItemComponent from '../components/InventoryItemComponent';

type InventoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Inventory'>;

/**
 * Pantalla del inventario donde se muestran todos los tesoros recolectados
 * agrupados por rareza con sus respectivas cantidades
 */
const InventoryScreen: React.FC = () => {
  const navigation = useNavigation<InventoryScreenNavigationProp>();

  // Estados del componente
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalTreasures, setTotalTreasures] = useState(0);

  /**
   * Carga el inventario cuando la pantalla obtiene el foco
   */
  useFocusEffect(
    React.useCallback(() => {
      loadInventoryData();
    }, [])
  );

  /**
   * Carga los datos del inventario desde AsyncStorage
   */
  const loadInventoryData = async () => {
    try {
      const savedTreasures = await loadTreasures();
      setTreasures(savedTreasures);
      
      const inventoryData = generateInventory(savedTreasures);
      setInventory(inventoryData);
      
      // Calcular estadísticas
      const collected = savedTreasures.filter(t => t.isCollected).length;
      setTotalCollected(collected);
      setTotalTreasures(savedTreasures.length);
    } catch (error) {
      console.error('Error cargando inventario:', error);
      Alert.alert('Error', 'No se pudo cargar el inventario.');
    }
  };

  /**
   * Maneja el refresh del inventario
   */
  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadInventoryData();
    setIsRefreshing(false);
  };

  /**
   * Reinicia el juego eliminando todos los datos guardados
   */
  const resetGame = () => {
    Alert.alert(
      'Reiniciar Juego',
      '¿Estás seguro de que quieres reiniciar el juego? Se perderán todos los tesoros recolectados y se generarán nuevos tesoros.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              setInventory([]);
              setTreasures([]);
              setTotalCollected(0);
              setTotalTreasures(0);
              
              Alert.alert(
                'Juego Reiniciado',
                'El juego se ha reiniciado correctamente. Regresa al mapa para generar nuevos tesoros.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Resetear completamente el stack de navegación para evitar el botón back
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Map' }],
                      });
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Error reiniciando juego:', error);
              Alert.alert('Error', 'No se pudo reiniciar el juego.');
            }
          },
        },
      ]
    );
  };

  /**
   * Obtiene el color asociado a cada rareza de tesoro
   */
  const getRarityColor = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return '#8B4513'; // Marrón
      case TreasureRarity.RARE:
        return '#4169E1'; // Azul
      case TreasureRarity.EPIC:
        return '#9932CC'; // Púrpura
      case TreasureRarity.SECRET:
        return '#FFD700'; // Dorado
      default:
        return '#666666';
    }
  };

  /**
   * Obtiene el emoji asociado a cada rareza
   */
  const getRarityEmoji = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return '📦';
      case TreasureRarity.RARE:
        return '💎';
      case TreasureRarity.EPIC:
        return '👑';
      case TreasureRarity.SECRET:
        return '🏆';
      default:
        return '❓';
    }
  };

  /**
   * Renderiza cada item del inventario
   */
  const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
    <InventoryItemComponent
      item={item}
      color={getRarityColor(item.rarity)}
      emoji={getRarityEmoji(item.rarity)}
    />
  );

  /**
   * Componente para mostrar cuando el inventario está vacío
   */
  const EmptyInventory = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🗺️</Text>
      <Text style={styles.emptyTitle}>¡Tu inventario está vacío!</Text>
      <Text style={styles.emptySubtitle}>
        Explora el mapa y acércate a los tesoros para recolectarlos.
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Map')}
      >
        <Text style={styles.exploreButtonText}>Explorar Mapa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalCollected}</Text>
          <Text style={styles.statLabel}>Recolectados</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalTreasures}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {totalTreasures > 0 ? Math.round((totalCollected / totalTreasures) * 100) : 0}%
          </Text>
          <Text style={styles.statLabel}>Completado</Text>
        </View>
      </View>

      {/* Lista del inventario */}
      <FlatList
        data={inventory}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.rarity}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={EmptyInventory}
        showsVerticalScrollIndicator={false}
      />

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={styles.mapButtonText}>🗺️ Volver al Mapa</Text>
        </TouchableOpacity>
        
        {totalTreasures > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>🔄 Reiniciar Juego</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  mapButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InventoryScreen;