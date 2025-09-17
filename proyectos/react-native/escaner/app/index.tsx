
import React, { useState } from 'react';
import LabyrinthGame from './LabyrinthGame';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

export default function HomeScreen() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Bienvenido/a al Laberintoo🎀</Text>
        <Text style={styles.welcomeDesc}>
          Mueve la pelota inclinando tu celular y supera los niveles.
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={() => setStarted(true)}>
          <Text style={styles.startButtonText}>Comenzar Juego</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LabyrinthGame />
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffe4f1',
    padding: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d81b60',
    marginBottom: 18,
    textAlign: 'center',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  welcomeDesc: {
    fontSize: 18,
    color: '#ad1457',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  startButton: {
    backgroundColor: '#f06292',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#d81b60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
