// src/app/features/recordings/PlayerControls.tsx
// Controles de reproducción reutilizables (play/pause/stop + barra de progreso).
// No requiere librerías externas; usa componentes nativos.
//
// Props esperadas:
// - status: "idle" | "loading" | "playing" | "paused"
// - currentMs: posición actual en milisegundos
// - durationMs?: duración total en milisegundos (si no hay, se muestra "--:--")
// - onPlay(): iniciar reproducción
// - onPause(): pausar reproducción
// - onStop(): detener y volver a 0
// - onSeek?(ms): seek opcional (si se provee, la barra de progreso es interactiva)

import * as React from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, GestureResponderEvent } from "react-native";

type PlayerStatus = "idle" | "loading" | "playing" | "paused";

export type PlayerControlsProps = {
  status: PlayerStatus;
  currentMs: number;
  durationMs?: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek?: (ms: number) => void;
};

export default function PlayerControls({
  status,
  currentMs,
  durationMs,
  onPlay,
  onPause,
  onStop,
  onSeek,
}: PlayerControlsProps) {
  const playing = status === "playing";
  const loading = status === "loading";

  const progress = React.useMemo(() => {
    if (!durationMs || durationMs <= 0) return 0;
    return Math.min(1, Math.max(0, currentMs / durationMs));
  }, [currentMs, durationMs]);

  const handleSeekPress = React.useCallback(
    (e: GestureResponderEvent) => {
      if (!onSeek || !durationMs || durationMs <= 0) return;
      const { locationX } = e.nativeEvent;
      // Medimos el ancho real del track usando onLayout; si no, tomamos width del estilo.
      // Para mantenerlo simple, usamos el ancho en pantalla calculado por layout.
      // El handler ajustará el estado externo.
      // Nota: abajo guardamos el ancho en un ref cuando onLayout dispare.
    },
    [onSeek, durationMs]
  );

  // Implementación real de seek interactivo (sin libs externas)
  const trackWidthRef = React.useRef<number>(0);
  const onTrackLayout = React.useCallback((e: any) => {
    trackWidthRef.current = e.nativeEvent.layout.width;
  }, []);
  const onTrackPress = React.useCallback(
    (e: GestureResponderEvent) => {
      if (!onSeek || !durationMs || durationMs <= 0) return;
      const x = e.nativeEvent.locationX;
      const w = trackWidthRef.current || 1;
      const ratio = Math.min(1, Math.max(0, x / w));
      onSeek(Math.floor(durationMs * ratio));
    },
    [onSeek, durationMs]
  );

  return (
    <View style={styles.container}>

      {/* Controles principales */}
      <View style={styles.controlsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={playing ? "Pausar" : loading ? "Cargando" : "Reproducir"}
          disabled={loading}
          onPress={playing ? onPause : onPlay}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.controlButtonPressed,
            loading && styles.controlButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.controlIcon}>{playing ? "⏸" : "▶︎"}</Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Detener"
          onPress={onStop}
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}
        >
          <Text style={styles.controlIcon}>■</Text>
        </Pressable>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressRow}>
        <Text style={styles.timeText}>{fmt(currentMs)}</Text>

        <Pressable style={styles.track} onLayout={onTrackLayout} onPress={onTrackPress}>
          <View style={styles.trackBg} />
          <View style={[styles.trackFg, { flex: progress, minWidth: 4 }]} />
          <View style={{ flex: 1 - progress }} />
        </Pressable>

        <Text style={styles.timeText}>{fmt(durationMs)}</Text>
      </View>
    </View>
  );
}

/** mm:ss a partir de milisegundos */
function fmt(ms?: number) {
  if (ms == null || ms < 0 || Number.isNaN(ms)) return "--:--";
  const total = Math.floor(ms / 1000);
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${mm}:${ss.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1F1F22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2C2C30",
  },
  controlButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  controlButtonDisabled: {
    opacity: 0.6,
  },
  controlIcon: {
    fontSize: 22,
    color: "#F2F2F2",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timeText: {
    width: 50,
    textAlign: "center",
    color: "#C9CAD1",
    fontVariant: ["tabular-nums"],
  },
  track: {
    flex: 1,
    height: 16,
    justifyContent: "center",
  },
  trackBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#2E2F36",
    borderRadius: 2,
  },
  trackFg: {
    height: 4,
    backgroundColor: "#6BC46D",
    borderRadius: 2,
  },
});
