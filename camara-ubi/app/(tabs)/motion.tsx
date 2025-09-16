import { Gyroscope } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");
const BALL_SIZE = 50;
const GAME_SIZE = Math.min(width, height) - 40;

export default function MotionScreen() {
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const [pos, setPos] = useState({ x: GAME_SIZE / 2 - BALL_SIZE / 2, y: GAME_SIZE / 2 - BALL_SIZE / 2 });
  const [won, setWon] = useState(false);

  useEffect(() => {
    const subscription = Gyroscope.addListener(setGyro);
    Gyroscope.setUpdateInterval(50);
    return () => subscription.remove();
  }, []);

  // Actualiza la posición de la pelota según el giroscopio
  useEffect(() => {
    if (won) return; // No mover si ya ganó
    setPos((prev) => {
      let newX = prev.x + gyro.y * 10;
      let newY = prev.y + gyro.x * 10;
      // Limita la pelota dentro del área de juego
      newX = Math.max(0, Math.min(GAME_SIZE - BALL_SIZE, newX));
      newY = Math.max(0, Math.min(GAME_SIZE - BALL_SIZE, newY));
      return { x: newX, y: newY };
    });
  }, [gyro, won]);

  // ¿La pelota está cerca del centro?
  const centerX = GAME_SIZE / 2 - BALL_SIZE / 2;
  const centerY = GAME_SIZE / 2 - BALL_SIZE / 2;
  const isCentered =
    Math.abs(pos.x - centerX) < 15 && Math.abs(pos.y - centerY) < 15;

  useEffect(() => {
    if (isCentered && !won) setWon(true);
  }, [isCentered, won]);

  const handleRestart = () => {
    // Posición inicial fuera del círculo central (esquina superior izquierda)
    setPos({ x: 10, y: 10 });
    setWon(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detector de Movimiento</Text>
      <Text style={styles.subtitle}>Giroscopio en vivo:</Text>
      <Text style={styles.data}>x: {gyro.x.toFixed(2)} | y: {gyro.y.toFixed(2)} | z: {gyro.z.toFixed(2)}</Text>
      <View style={styles.gameArea}>
        <View
          style={[
            styles.ball,
            { left: pos.x, top: pos.y, backgroundColor: isCentered ? "#4caf50" : "#2196f3" },
          ]}
        />
        <View
          style={[
            styles.centerTarget,
            { left: centerX, top: centerY },
          ]}
        />
      </View>
      <Text style={styles.instructions}>
        ¡Inclina el teléfono para mover la pelota al centro!
      </Text>
      {won && (
        <>
          <Text style={styles.winText}>¡Bien hecho! 🎉</Text>
          <Button title="Volver a jugar" onPress={handleRestart} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  subtitle: { fontSize: 18, marginTop: 10 },
  data: { fontSize: 16, marginBottom: 10 },
  gameArea: {
    width: GAME_SIZE,
    height: GAME_SIZE,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginVertical: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#bbb",
  },
  ball: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  centerTarget: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    borderWidth: 2,
    borderColor: "#ff9800",
    backgroundColor: "transparent",
  },
  instructions: { fontSize: 16, textAlign: "center", marginTop: 10 },
  winText: { fontSize: 20, color: "#4caf50", fontWeight: "bold", marginTop: 10 },
});
