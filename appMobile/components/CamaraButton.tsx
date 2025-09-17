import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function CamaraButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.boton} onPress={onPress}>
      <Text style={styles.textoBoton}>Cámara</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: '#FFD600', // amarillo
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
});