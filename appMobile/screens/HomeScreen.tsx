import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CamaraButton from '../components/CamaraButton';

export default function HomeScreen() {
  const abrirCamara = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Necesitas dar permiso para usar la cámara');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!resultado.canceled) {
      Alert.alert('Foto tomada', '¡La foto se tomó correctamente!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Abrir cámara</Text>
      <CamaraButton onPress={abrirCamara} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196F3', // azul
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    color: 'white',
    marginBottom: 32,
    fontWeight: 'bold',
  },
});