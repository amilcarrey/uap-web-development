// src/app/features/recordings/RecordButton.tsx
// Botón grande para iniciar/detener grabación.
// - Visual claro (rojo al grabar) + animación de “pulso”.
// - Sin dependencias externas.
//
// Props:
//   status: "idle" | "recording" | "saving" | "blocked"
//   onStart(): void
//   onStop(): void
//   disabled?: boolean
//   elapsedMs?: number           // opcional: tiempo transcurrido para mostrar mm:ss
//   size?: number                // diámetro del botón (px), default 88

import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";

type RecordStatus = "idle" | "recording" | "saving" | "blocked";

export type RecordButtonProps = {
  status: RecordStatus;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  elapsedMs?: number;
  size?: number;
};

export default function RecordButton({
  status,
  onStart,
  onStop,
  disabled,
  elapsedMs,
  size = 88,
}: RecordButtonProps) {
  const isRecording = status === "recording";
  const isSaving = status === "saving";
  const isBlocked = status === "blocked";
  const isIdle = status === "idle";

  const pulse = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 900,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulse.stopAnimation();
      pulse.setValue(0);
    }
  }, [isRecording, pulse]);

  const outerSize = size;
  const innerSize = Math.max(52, size * 0.6);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });
  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  const canPressStart = isIdle && !isSaving && !isBlocked && !disabled;
  const canPressStop = isRecording && !isSaving && !disabled;

  const handlePress = () => {
    if (canPressStart) onStart();
    else if (canPressStop) onStop();
  };

  const label =
    isSaving
      ? "Guardando…"
      : isBlocked
      ? "Permiso requerido"
      : isRecording
      ? "Detener"
      : "Grabar";

  return (
    <View style={styles.wrapper}>
      <View style={styles.timerWrapper}>
        <Text style={[styles.timer, isRecording && styles.timerActive]}>
          {fmt(elapsedMs)}
        </Text>
      </View>

      <View style={{ width: outerSize, height: outerSize }}>
        {/* Halo animado cuando está grabando */}
        {isRecording && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.halo,
              {
                width: outerSize,
                height: outerSize,
                borderRadius: outerSize / 2,
                transform: [{ scale }],
                opacity,
              },
            ]}
          />
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={handlePress}
          disabled={isSaving || disabled || isBlocked}
          style={({ pressed }) => [
            styles.button,
            {
              width: outerSize,
              height: outerSize,
              borderRadius: outerSize / 2,
              opacity: pressed ? 0.9 : 1,
              borderColor: isRecording ? "#FF5C5C" : "#2C2C30",
              backgroundColor: isRecording ? "#1A0D0D" : "#1F1F22",
            },
            (isSaving || disabled || isBlocked) && styles.buttonDisabled,
          ]}
        >
          {isSaving ? (
            <ActivityIndicator />
          ) : isRecording ? (
            <View
              style={[
                styles.stopSquare,
                { width: innerSize * 0.46, height: innerSize * 0.46 },
              ]}
            />
          ) : (
            <View
              style={[
                styles.recordDot,
                { width: innerSize * 0.45, height: innerSize * 0.45, borderRadius: innerSize },
              ]}
            />
          )}
        </Pressable>
      </View>

      <Text
        style={[
          styles.caption,
          isBlocked && { color: "#FFAE42" },
          isSaving && { color: "#C9CAD1" },
        ]}
      >
        {label}
      </Text>
      {isBlocked && (
        <Text style={styles.helperText}>
          Habilitá el micrófono en Configuración para grabar.
        </Text>
      )}
    </View>
  );
}

function fmt(ms?: number) {
  if (ms == null || ms < 0 || Number.isNaN(ms)) return "00:00";
  const total = Math.floor(ms / 1000);
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 10,
  },
  timerWrapper: {
    minHeight: 22,
  },
  timer: {
    color: "#C9CAD1",
    fontVariant: ["tabular-nums"],
  },
  timerActive: {
    color: "#FF6B6B",
  },
  halo: {
    position: "absolute",
    backgroundColor: "#E02424",
    alignSelf: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  recordDot: {
    backgroundColor: "#FF3B30",
  },
  stopSquare: {
    backgroundColor: "#FF3B30",
    borderRadius: 6,
  },
  caption: {
    marginTop: 6,
    color: "#E6E6E9",
    fontSize: 13,
  },
  helperText: {
    color: "#C9CAD1",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
