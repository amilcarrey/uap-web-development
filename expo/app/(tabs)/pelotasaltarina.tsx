import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, LayoutChangeEvent, StyleSheet, View } from 'react-native';


import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Accel = { x: number; y: number; z: number };

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

export default function LevelScreen() {
  const [smoothed, setSmoothed] = useState<Accel>({ x: 0, y: 0, z: -1 });
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  // Dimensiones del área de juego y estado físico
  const [arena, setArena] = useState({ width: 0, height: 0 });
  const ballRadius = 20;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const lastTsRef = useRef<number | null>(null);

  // Parámetros de física -> se pueden ajustar
  const gravityPxPerSec2 = 900; // intensidad de la "gravedad" por inclinación
  const airDamping = 0.992; // amortiguación por frame (0..1)
  const wallRestitution = 0.8; // rebote contra paredes (0..1)
  const maxSpeed = 1500; // seguridad para evitar explosiones numéricas
  const shakeImpulse = 700; // impulso por sacudida (px/s)

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    (async () => {
      const available = await Accelerometer.isAvailableAsync();
      setIsAvailable(available);
      if (!available) return;

      // Intentar ~60 Hz para animación más suave
      Accelerometer.setUpdateInterval(16);
      subscription = Accelerometer.addListener((data) => {
        // Suavizado simple (EMA) para reducir jitter
        const alpha = 0.2; // 0..1 (menor = más suave)
        setSmoothed((prev) => ({
          x: prev.x * (1 - alpha) + data.x * alpha,
          y: prev.y * (1 - alpha) + data.y * alpha,
          z: prev.z * (1 - alpha) + data.z * alpha,
        }));
      });
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  // Detección de sacudida: magnitud del cambio del acelerómetro suavizado
  const shakeMagnitudeRef = useRef(0);
  const lastSmoothRef = useRef<Accel | null>(null);
  useEffect(() => {
    const prev = lastSmoothRef.current;
    if (prev) {
      const dx = smoothed.x - prev.x;
      const dy = smoothed.y - prev.y;
      const dz = smoothed.z - prev.z;
      const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
      shakeMagnitudeRef.current = mag;
    }
    lastSmoothRef.current = smoothed;
  }, [smoothed]);

  // Loop de animación con requestAnimationFrame
  useEffect(() => {
    let rafId: number;
    const frame = (ts: number) => {
      const last = lastTsRef.current;
      lastTsRef.current = ts;
      const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0; // limitar dt

      // Gravedad constante hacia abajo (eje Y positivo)
      const ax = 0;
      const ay = gravityPxPerSec2;

      // Impulso por sacudida si supera umbral
      if (shakeMagnitudeRef.current > 0.25) {
        // Impulso hacia arriba y un componente lateral aleatorio
        const dirX = Math.random() < 0.5 ? -1 : 1;
        velocityRef.current.vx += dirX * (shakeImpulse * 0.6);
        velocityRef.current.vy -= shakeImpulse;
        shakeMagnitudeRef.current = 0; // evitar acumulación continua
      }

      if (dt > 0) {
        velocityRef.current.vx = clamp(
          (velocityRef.current.vx + ax * dt) * airDamping,
          -maxSpeed,
          maxSpeed
        );
        velocityRef.current.vy = clamp(
          (velocityRef.current.vy + ay * dt) * airDamping,
          -maxSpeed,
          maxSpeed
        );

        setPosition((prev) => {
          let nextX = prev.x + velocityRef.current.vx * dt;
          let nextY = prev.y + velocityRef.current.vy * dt;

          const minX = ballRadius;
          const minY = ballRadius;
          const maxX = Math.max(ballRadius, arena.width - ballRadius);
          const maxY = Math.max(ballRadius, arena.height - ballRadius);

          // Colisiones con paredes
          if (nextX < minX) {
            nextX = minX;
            velocityRef.current.vx = -velocityRef.current.vx * wallRestitution;
          } else if (nextX > maxX) {
            nextX = maxX;
            velocityRef.current.vx = -velocityRef.current.vx * wallRestitution;
          }
          if (nextY < minY) {
            nextY = minY;
            velocityRef.current.vy = -velocityRef.current.vy * wallRestitution;
          } else if (nextY > maxY) {
            nextY = maxY;
            velocityRef.current.vy = -velocityRef.current.vy * wallRestitution;
          }

          return { x: nextX, y: nextY };
        });
      }

      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [arena.width, arena.height]);

  const onArenaLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setArena({ width, height });
    setPosition({ x: width / 2, y: height / 2 });
    velocityRef.current = { vx: 0, vy: 0 };
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Loca Pelota</ThemedText>

      {isAvailable === false ? (
        <ThemedText type="default">El acelerómetro no está disponible en este dispositivo.</ThemedText>
      ) : (
        <ImageBackground
          source={require('@/assets/images/Fondo.png')} // imagen de fondo
          resizeMode="cover"
          style={styles.arena}
          imageStyle={styles.arenaImage} // estilos solo para la imagen
          onLayout={onArenaLayout}
        >
          <View
            style={[
              styles.ball,
              {
                transform: [
                  { translateX: position.x - ballRadius },
                  { translateY: position.y - ballRadius },
                ],
              },
            ]}
          />
        </ImageBackground>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 16,
  },
  title: {
    textAlign: 'center',
  },
  arena: {
    width: '100%',
    maxWidth: 360,
    height: 460,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#888',
    backgroundColor: 'rgba(89, 102, 112, 0.13)',
    overflow: 'hidden',
  },
  arenaImage: {
    opacity: 0.8,
  },
  ball: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});