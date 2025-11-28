// src/app/features/recordings/screens/HomeScreen.tsx
// Pantalla principal: botón de grabar + lista de grabaciones con reproducción.
// Integra hooks (useRecorder/usePlayer) y el store global (zustand).

import * as React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";

import RecordButton from "../components/RecordButton";
import RecordingItem from "../components/RecordingItem";
import useRecorder from "../hooks/useRecorder";
import usePlayer from "../hooks/usePlayer";

import { useRecordingsStore, useRecordings, useActiveId } from "../model/state";
import type { RecordingMeta } from "../model/types";

export default function HomeScreen() {
  // --- Estado global (lista + selección) ---
  const recordings = useRecordings();
  const activeId = useActiveId();
  const setActive = useRecordingsStore((s) => s.setActive);
  const addRecording = useRecordingsStore((s) => s.add);
  const removeRecording = useRecordingsStore((s) => s.remove);

  // --- Hooks de audio ---
  const rec = useRecorder();
  const player = usePlayer();

  // --- Grabación: iniciar/detener ---
  const onStartRecord = React.useCallback(async () => {
    await rec.start();
  }, [rec]);

  const onStopRecord = React.useCallback(async () => {
    const meta = await rec.stop();
    if (meta) {
      addRecording(meta);
      // feedback simple opcional
      // Toast/Snackbar si agregás una lib de UI
    }
  }, [rec, addRecording]);

  // --- Reproducción: play/pause/seek por ítem ---
  const handlePlay = React.useCallback(
    async (item: RecordingMeta) => {
      // Si otra pista está cargada o no hay nada, cargamos ésta y autoPlay
      if (!player.activeId || player.activeId !== item.id) {
        await player.load({ id: item.id, uri: item.fileUri, autoPlay: true });
        setActive(item.id);
        return;
      }
      // Si ya es la activa, según estado…
      if (player.status === "paused" || player.status === "idle") {
        await player.play();
      } else if (player.status === "playing") {
        await player.pause();
      }
    },
    [player, setActive]
  );

  const handlePause = React.useCallback(
    async (_item: RecordingMeta) => {
      await player.pause();
    },
    [player]
  );

  const handleSeek = React.useCallback(
    async (ms: number, item: RecordingMeta) => {
      if (player.activeId !== item.id) return;
      await player.seek(ms);
    },
    [player]
  );

  // --- Selección visual (expandir controles del ítem) ---
  const handlePressRow = React.useCallback(
    (item: RecordingMeta) => {
      setActive(activeId === item.id ? null : item.id);
    },
    [activeId, setActive]
  );

  // --- Eliminar grabación (archivo + store) ---
  const handleDelete = React.useCallback(
    async (item: RecordingMeta) => {
      try {
        // Si es la que está sonando, descargar y limpiar selección
        if (player.activeId === item.id) {
          await player.unload();
          if (activeId === item.id) setActive(null);
        }
        // Borrar archivo físico
        await FileSystem.deleteAsync(item.fileUri, { idempotent: true });
      } catch (e) {
        Alert.alert("Error", "No se pudo eliminar el archivo de audio.");
      } finally {
        removeRecording(item.id);
      }
    },
    [player, activeId, setActive, removeRecording]
  );

  // --- Render de cada fila ---
  const renderItem = React.useCallback(
    ({ item }: { item: RecordingMeta }) => {
      const isActiveRow = activeId === item.id;
      const isPlayersItem = player.activeId === item.id;
      const status = isPlayersItem ? player.status : "idle";
      const currentMs = isPlayersItem ? player.currentMs : 0;

      return (
        <RecordingItem
          item={item}
          active={isActiveRow}
          status={status}
          currentMs={currentMs}
          onPlay={handlePlay}
          onPause={handlePause}
          onDelete={handleDelete}
          onSeek={handleSeek}
          onPressRow={(_, e) => handlePressRow(item)}
        />
      );
    },
    [activeId, player.activeId, player.status, player.currentMs, handlePlay, handlePause, handleDelete, handleSeek, handlePressRow]
  );

  const keyExtractor = React.useCallback((it: RecordingMeta) => it.id, []);

  return (
    <View style={styles.container}>
      {/* Header muy simple */}
      <View style={styles.header}>
        <Text style={styles.title}>Grabadora</Text>
        <Pressable
          onPress={() =>
            Alert.alert(
              "Acerca de",
              "App de ejemplo con Expo (micrófono, archivos y reproducción)."
            )
          }
          style={({ pressed }) => [styles.aboutBtn, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.aboutText}>i</Text>
        </Pressable>
      </View>

      {/* Botón de grabación */}
      <View style={styles.recordArea}>
        <RecordButton
          status={rec.status}
          elapsedMs={rec.elapsedMs}
          onStart={onStartRecord}
          onStop={onStopRecord}
        />
        {rec.lastError ? (
          <Text style={styles.errorText}>⚠︎ {rec.lastError}</Text>
        ) : null}
      </View>

      {/* Lista de grabaciones */}
      <FlatList
        data={recordings}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Sin grabaciones aún</Text>
            <Text style={styles.emptySubtitle}>
              Tocá “Grabar” para crear tu primera nota de voz.
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          recordings.length === 0 && { flex: 1 },
        ]}
      />

      {/* Errores del reproductor (si los hubiera) */}
      {player.lastError ? (
        <View style={styles.playerError}>
          <Text style={styles.errorText}>⚠︎ {player.lastError}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* ---------------- estilos ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C",
    paddingTop: 10,
  },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#17171A",
    marginBottom: 6,
  },
  title: {
    color: "#E6E6E9",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  aboutBtn: {
    position: "absolute",
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2C2C30",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#141416",
  },
  aboutText: {
    color: "#C9CAD1",
    fontWeight: "700",
  },
  recordArea: {
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#17171A",
    marginBottom: 4,
  },
  listContent: {
    paddingVertical: 6,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: "#C6F6C8",
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtitle: {
    color: "#A8A8B3",
    fontSize: 13,
    textAlign: "center",
  },
  playerError: {
    padding: 8,
    alignItems: "center",
  },
  errorText: {
    color: "#FFAE42",
    fontSize: 12,
  },
});
