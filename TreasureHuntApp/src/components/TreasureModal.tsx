import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Treasure, TreasureRarity } from '../types';

interface TreasureModalProps {
  visible: boolean;
  treasure: Treasure | null;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

/**
 * Modal que se muestra cuando el usuario recolecta un tesoro
 * Incluye animaciones y información detallada del tesoro
 */
const TreasureModal: React.FC<TreasureModalProps> = ({
  visible,
  treasure,
  onClose,
}) => {
  // Referencias para animaciones
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  /**
   * Inicia las animaciones cuando el modal se hace visible
   */
  useEffect(() => {
    if (visible) {
      // Resetear animaciones
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      opacityAnim.setValue(0.3);

      // Secuencia de animaciones
      Animated.sequence([
        // Animación de entrada con escala
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        // Animación de rotación
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Animación de brillo continua para opacidad
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  /**
   * Obtiene el color asociado a la rareza del tesoro
   */
  const getRarityColor = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return '#8B4513';
      case TreasureRarity.RARE:
        return '#4169E1';
      case TreasureRarity.EPIC:
        return '#9932CC';
      case TreasureRarity.SECRET:
        return '#FFD700';
      default:
        return '#666666';
    }
  };

  /**
   * Obtiene el emoji del tesoro según su rareza
   */
  const getTreasureEmoji = (rarity: TreasureRarity): string => {
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
   * Obtiene el mensaje de felicitación según la rareza
   */
  const getCongratulationMessage = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return '¡Buen trabajo!';
      case TreasureRarity.RARE:
        return '¡Excelente hallazgo!';
      case TreasureRarity.EPIC:
        return '¡Increíble descubrimiento!';
      case TreasureRarity.SECRET:
        return '¡TESORO LEGENDARIO ENCONTRADO!';
      default:
        return '¡Tesoro encontrado!';
    }
  };

  /**
   * Obtiene la descripción del tesoro según su rareza
   */
  const getTreasureDescription = (rarity: TreasureRarity): string => {
    switch (rarity) {
      case TreasureRarity.COMMON:
        return 'Has encontrado un tesoro común. ¡Sigue explorando para encontrar tesoros más raros!';
      case TreasureRarity.RARE:
        return 'Un tesoro raro ha sido añadido a tu colección. ¡Estos son más difíciles de encontrar!';
      case TreasureRarity.EPIC:
        return 'Has descubierto un tesoro épico. ¡Solo los exploradores más dedicados encuentran estos!';
      case TreasureRarity.SECRET:
        return '¡Has encontrado el tesoro más raro de todos! Solo el 1% de los exploradores logra esto.';
      default:
        return 'Has encontrado un tesoro misterioso.';
    }
  };

  if (!treasure) return null;

  const rarityColor = getRarityColor(treasure.rarity);
  const emoji = getTreasureEmoji(treasure.rarity);
  const congratsMessage = getCongratulationMessage(treasure.rarity);
  const description = getTreasureDescription(treasure.rarity);

  // Interpolaciones para animaciones
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              borderColor: rarityColor,
            },
          ]}
        >
          {/* Header con emoji animado */}
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.emojiContainer,
                {
                  backgroundColor: rarityColor,
                  transform: [{ rotate: rotateInterpolate }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </Animated.View>
          </View>

          {/* Contenido principal */}
          <View style={styles.content}>
            <Text style={[styles.congratsText, { color: rarityColor }]}>
              {congratsMessage}
            </Text>
            
            <Text style={styles.rarityText}>
              Tesoro {treasure.rarity.charAt(0).toUpperCase() + treasure.rarity.slice(1)}
            </Text>
            
            <Text style={styles.description}>
              {description}
            </Text>

            {/* Información adicional para tesoros secretos */}
            {treasure.rarity === TreasureRarity.SECRET && (
              <View style={styles.specialInfo}>
                <Text style={styles.specialText}>✨ ¡LOGRO DESBLOQUEADO! ✨</Text>
                <Text style={styles.achievementText}>Maestro Explorador</Text>
              </View>
            )}
          </View>

          {/* Botón de cerrar */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: rarityColor }]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>¡Genial!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    maxWidth: screenWidth * 0.9,
    minWidth: screenWidth * 0.8,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  rarityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  specialInfo: {
    backgroundColor: '#FFF8DC',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  specialText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 5,
  },
  achievementText: {
    fontSize: 14,
    color: '#B8860B',
    fontStyle: 'italic',
  },
  closeButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TreasureModal;