// app/(tabs)/motion.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Gyroscope } from "expo-sensors";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");
const BALL_SIZE = 50;
const GAME_SIZE = Math.min(width, height) - 40;

const TOLERANCE = 15;            // +- px para considerar "centrado"
const SPEED = 9;                 // factor de movimiento
const INTERVAL_MS = 50;          // 20Hz
const LP_ALPHA = 0.15;           // low-pass filter

type Vec3 = { x: number; y: number; z: number };

export default function MotionScreen() {
  const [gyro, setGyro] = useState<Vec3>({ x: 0, y: 0, z: 0 });
  const [pos, setPos] = useState({ x: GAME_SIZE / 2 - BALL_SIZE / 2, y: GAME_SIZE / 2 - BALL_SIZE / 2 });
  const [won, setWon] = useState(false);
  const startRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState(true);

  // Calibración: offset que se resta a la lectura del giroscopio
  const [offset, setOffset] = useState<Vec3>({ x: 0, y: 0, z: 0 });
  const filteredRef = useRef<Vec3>({ x: 0, y: 0, z: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const subRef = useRef<ReturnType<typeof Gyroscope.addListener> | null>(null);

  // Cargar mejor tiempo
  useEffect(() => {
    (async () => {
      setLoading(true);
      setStorageError(null);
      try {
        const raw = await AsyncStorage.getItem("@best_time_ms");
        if (raw) setBest(Number(raw));
      } catch (e) {
        setStorageError("Error al cargar el récord");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Suscribirse al giroscopio y verificar disponibilidad
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const isAvailable = await Gyroscope.isAvailableAsync();
        if (!isAvailable && mounted) {
          setSensorAvailable(false);
          return;
        }
        setSensorAvailable(true);
        Gyroscope.setUpdateInterval(INTERVAL_MS);
        subRef.current = Gyroscope.addListener((data) => {
          // low-pass simple
          const prev = filteredRef.current;
          const nx = prev.x + LP_ALPHA * (data.x - prev.x);
          const ny = prev.y + LP_ALPHA * (data.y - prev.y);
          const nz = prev.z + LP_ALPHA * (data.z - prev.z);
          filteredRef.current = { x: nx, y: ny, z: nz };
          setGyro({ x: nx - offset.x, y: ny - offset.y, z: nz - offset.z });
        });
      } catch (e) {
        setSensorAvailable(false);
      }
    })();
    return () => {
      mounted = false;
      subRef.current?.remove();
      subRef.current = null;
    };
  }, [offset]);

  // Timer de juego (usando startRef para evitar bug)
  useEffect(() => {
    if (won) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    startRef.current = Date.now();
    setElapsed(0);
    timerRef.current = setInterval(() => {
      if (startRef.current) setElapsed(Date.now() - startRef.current);
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [won]);

  // Movimiento por giroscopio (x ↔ y cruzado para sensación natural)
  useEffect(() => {
    if (won) return;
    setPos((prev) => {
      let newX = prev.x + gyro.y * SPEED;
      let newY = prev.y + gyro.x * SPEED;
      newX = Math.max(0, Math.min(GAME_SIZE - BALL_SIZE, newX));
      newY = Math.max(0, Math.min(GAME_SIZE - BALL_SIZE, newY));
      return { x: newX, y: newY };
    });
  }, [gyro, won]);

  const centerX = GAME_SIZE / 2 - BALL_SIZE / 2;
  const centerY = GAME_SIZE / 2 - BALL_SIZE / 2;
  const isCentered = Math.abs(pos.x - centerX) < TOLERANCE && Math.abs(pos.y - centerY) < TOLERANCE;

  // Win logic (usando startRef)
  useEffect(() => {
    if (isCentered && !won) {
      setWon(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const final = Date.now() - (startRef.current ?? Date.now());
      setElapsed(final);
      (async () => {
        if (best === null || final < best) {
          setBest(final);
          await AsyncStorage.setItem("@best_time_ms", String(final));
        }
      })();
    }
  }, [isCentered, won, best]);

  const handleRestart = () => {
    setPos({ x: 10, y: 10 });
    setWon(false);
  };

  const handleCalibrate = () => {
    // Tomar el valor filtrado actual como cero
    setOffset(filteredRef.current);
  };

  const msToS = (ms: number) => (ms / 1000).toFixed(2) + "s";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detector de Movimiento</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2196f3" accessibilityLabel="Cargando récord" />
      ) : storageError ? (
        <Text style={{ color: 'red', marginBottom: 8 }}>{storageError}</Text>
      ) : null}

      {!sensorAvailable ? (
        <Text style={{ color: 'red', marginBottom: 8 }}>Sensor de giroscopio no disponible en este dispositivo.</Text>
      ) : (
        <>
          <View style={styles.row}>
            <Text style={styles.badge}>Tiempo: {msToS(elapsed)}</Text>
            <Text style={styles.badge}>Récord: {best ? msToS(best) : "—"}</Text>
          </View>

          <Text style={styles.subtitle}>Giroscopio (filtrado):</Text>
          <Text style={styles.data}>
            x: {gyro.x.toFixed(2)} | y: {gyro.y.toFixed(2)} | z: {gyro.z.toFixed(2)}
          </Text>

          <View style={styles.gameArea}>
            <View
              style={[
                styles.centerTarget,
                { left: centerX, top: centerY, borderColor: isCentered ? "#4caf50" : "#ff9800" },
              ]}
              accessibilityLabel="Zona objetivo central"
              accessible
            />
            <View
              style={[
                styles.ball,
                { left: pos.x, top: pos.y, backgroundColor: isCentered ? "#4caf50" : "#2196f3" },
              ]}
              accessibilityLabel="Pelota controlada por giroscopio"
              accessible
            />
          </View>

          <Text style={styles.instructions}>¡Inclina el teléfono para llevar la pelota al centro!</Text>

          <View style={styles.buttons}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Button
                title={won ? "Volver a jugar" : "Reiniciar"}
                onPress={handleRestart}
                accessibilityLabel={won ? "Volver a jugar" : "Reiniciar el juego"}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Button
                title="Calibrar"
                onPress={handleCalibrate}
                accessibilityLabel="Calibrar giroscopio"
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 40, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 16, marginTop: 10 },
  data: { fontSize: 14, marginBottom: 10 },
  gameArea: {
    width: GAME_SIZE,
    height: GAME_SIZE,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    marginVertical: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#d0d0d0",
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
    borderWidth: 3,
    backgroundColor: "transparent",
  },
  instructions: { fontSize: 14, textAlign: "center", marginTop: 4, marginBottom: 8 },
  row: { flexDirection: "row", gap: 12 },
  badge: {
    backgroundColor: "#efefef",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: "600",
  },
  buttons: { flexDirection: "row", width: "100%", maxWidth: 480, marginTop: 8 },
});
