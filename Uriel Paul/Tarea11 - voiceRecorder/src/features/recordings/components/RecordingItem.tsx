// src/app/features/recordings/RecordingItem.tsx
// Ítem de lista para una grabación.
// - Muestra nombre, fecha y duración.
// - Botones de Play/Pause y Eliminar.
// - Si está "activa", renderiza PlayerControls con barra de progreso y seek.
//
// Nota: Para simplificar, definimos un tipo local RecordingMeta.
//       Cuando tengas src/app/features/recordings/model/types.ts,
//       podés reemplazar este tipo por el import centralizado.

import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";
import PlayerControls from "./PlayerControls";

type PlayerStatus = "idle" | "loading" | "playing" | "paused";

export type RecordingMeta = {
  id: string;
  fileUri: string;
  name: string;
  createdAt: string; // ISO string
  durationMs: number;
  sizeBytes?: number;
};

export type RecordingItemProps = {
  item: RecordingMeta;

  // Estado de reproducción del ítem (si es el activo)
  active?: boolean;
  status?: PlayerStatus; // idle | loading | playing | paused
  currentMs?: number; // progreso actual en ms (si se está reproduciendo)

  // Callbacks
  onPlay: (item: RecordingMeta) => void;
  onPause: (item: RecordingMeta) => void;
  onDelete: (item: RecordingMeta) => void;

  // Opcional: seek y onPress del row
  onSeek?: (ms: number, item: RecordingMeta) => void;
  onPressRow?: (item: RecordingMeta, e: GestureResponderEvent) => void;

  // Estilo opcional
  style?: ViewStyle;
};

export default function RecordingItem({
  item,
  active = false,
  status = "idle",
  currentMs = 0,
  onPlay,
  onPause,
  onDelete,
  onSeek,
  onPressRow,
  style,
}: RecordingItemProps) {
  const playing = status === "playing";
  const loading = status === "loading";

  const handleTogglePlay = React.useCallback(() => {
    if (playing) onPause(item);
    else onPlay(item);
  }, [playing, onPause, onPlay, item]);

  const handleDelete = React.useCallback(() => {
    Alert.alert(
      "Eliminar grabación",
      `¿Seguro que querés borrar “${item.name}”?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => onDelete(item) },
      ]
    );
  }, [item, onDelete]);

  const handleSeek = React.useCallback(
    (ms: number) => {
      onSeek?.(ms, item);
    },
    [onSeek, item]
  );

  const duration = item.durationMs ?? 0;

  return (
    <View style={[styles.container, active && styles.containerActive, style]}>
      {/* Row principal */}
      <Pressable
        style={({ pressed }) => [
          styles.row,
          pressed && { backgroundColor: "#17171A" },
        ]}
        onPress={(e) => onPressRow?.(item, e)}
      >
        {/* Botón Play/Pause */}
        <Pressable
          onPress={handleTogglePlay}
          style={({ pressed }) => [
            styles.playBtn,
            pressed && styles.playBtnPressed,
            loading && styles.playBtnDisabled,
          ]}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={playing ? "Pausar" : "Reproducir"}
        >
          <Text style={styles.playIcon}>{loading ? "…" : playing ? "⏸" : "▶︎"}</Text>
        </Pressable>

        {/* Título y subtítulo */}
        <View style={styles.texts}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.title, active && styles.titleActive]}
          >
            {item.name || "Grabación"}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {fmtDate(item.createdAt)} • {fmtDuration(duration)}
            {item.sizeBytes ? ` • ${fmtSize(item.sizeBytes)}` : ""}
          </Text>
        </View>

        {/* Eliminar */}
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [styles.delBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="Eliminar grabación"
        >
          <Text style={styles.delIcon}>🗑️</Text>
        </Pressable>
      </Pressable>

      {/* Controles expansión (sólo si está activa) */}
      {active && (
        <View style={styles.controls}>
          <PlayerControls
            status={status}
            currentMs={currentMs}
            durationMs={duration}
            onPlay={() => onPlay(item)}
            onPause={() => onPause(item)}
            onStop={() => onSeek?.(0, item)}
            onSeek={handleSeek}
          />
        </View>
      )}
    </View>
  );
}

/* Helpers de formato */

function fmtDuration(ms?: number) {
  if (!ms || ms < 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  // dd/mm/yyyy hh:mm
  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function fmtSize(bytes?: number) {
  if (bytes == null) return "";
  const KB = 1024;
  const MB = KB * 1024;
  if (bytes < MB) return `${(bytes / KB).toFixed(1)} KB`;
  return `${(bytes / MB).toFixed(2)} MB`;
}

/* Estilos */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F0F12",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1C1C22",
    marginHorizontal: 12,
    marginVertical: 6,
    overflow: "hidden",
  },
  containerActive: {
    borderColor: "#2F3A2F",
    backgroundColor: "#101313",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F1F22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2C2C30",
  },
  playBtnPressed: {
    transform: [{ scale: 0.98 }],
  },
  playBtnDisabled: {
    opacity: 0.6,
  },
  playIcon: {
    fontSize: 18,
    color: "#F2F2F2",
  },
  texts: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: "#E6E6E9",
    fontSize: 15,
    fontWeight: "600",
  },
  titleActive: {
    color: "#C6F6C8",
  },
  subtitle: {
    marginTop: 2,
    color: "#A8A8B3",
    fontSize: 12,
  },
  delBtn: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  delIcon: {
    fontSize: 16,
    color: "#FF6B6B",
  },
  controls: {
    paddingBottom: 10,
  },
});
