// src/app/features/recordings/services/audio.service.ts
// Utilidades centralizadas para trabajar con expo-av (Audio).
// Reproduce y graba (configura modos), crea Recording/Sound y helpers.

import { Platform } from "react-native";
import {
  Audio,
  AVPlaybackStatusSuccess,
  AVPlaybackStatus,
  InterruptionModeIOS,
  InterruptionModeAndroid,
} from "expo-av";

/* -------------------- Configuración de modos -------------------- */

let playbackModeSet = false;
let recordingModeSet = false;

/** Modo para REPRODUCIR audio (no graba). */
export async function setPlaybackMode() {
  if (playbackModeSet) return;
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    shouldDuckAndroid: true,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    staysActiveInBackground: false,
    playThroughEarpieceAndroid: false,
  });
  playbackModeSet = true;
  recordingModeSet = false;
}

/** Modo para GRABAR audio (permite capturar micrófono). */
export async function setRecordingMode() {
  if (recordingModeSet) return;
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    shouldDuckAndroid: true,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    staysActiveInBackground: false,
    playThroughEarpieceAndroid: false,
  });
  recordingModeSet = true;
  playbackModeSet = false;
}

/* -------------------- Opciones por defecto -------------------- */

export const DEFAULT_PROGRESS_UPDATE_MS = 250;

/** Opciones de grabación “alta calidad” por defecto. */
export function getDefaultRecordingOptions(): Audio.RecordingOptions {
  if (Platform.OS === "ios") {
    return Audio.RecordingOptionsPresets.HIGH_QUALITY;
  }
  return {
    isMeteringEnabled: false,
    android: {
      extension: ".m4a",
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".m4a",
      outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {} as any,
  };
}

/* -------------------- Recording helpers -------------------- */

/**
 * Crea una instancia Recording, la prepara y comienza a grabar.
 * Debe llamarse tras setRecordingMode() y tener permisos concedidos.
 */
export async function createAndStartRecording(
  onStatusUpdate?: (status: Audio.RecordingStatus) => void,
  options: Audio.RecordingOptions = getDefaultRecordingOptions()
): Promise<Audio.Recording> {
  const rec = new Audio.Recording();
  await rec.prepareToRecordAsync(options);
  if (onStatusUpdate) rec.setOnRecordingStatusUpdate(onStatusUpdate);
  await rec.startAsync();
  return rec;
}

/**
 * Detiene y descarga la Recording, devolviendo URI final (temporal) y duración.
 * NOTA: mover/renombrar el archivo debe hacerse en capa de FS (servicio aparte).
 */
export async function stopAndFinalizeRecording(rec: Audio.Recording): Promise<{
  uri: string;
  durationMs: number;
}> {
  await rec.stopAndUnloadAsync();
  const uri = rec.getURI();
  if (!uri) throw new Error("No se obtuvo URI de la grabación.");
  const st = (await rec.getStatusAsync()) as Audio.RecordingStatus;
  const durationMs = st.durationMillis ?? 0;
  return { uri, durationMs };
}

/* -------------------- Sound helpers -------------------- */

/**
 * Crea y carga un Sound desde una URI. No reproduce a menos que autoPlay=true.
 */
export async function createSound(
  uri: string,
  onStatusUpdate?: (status: AVPlaybackStatus) => void,
  {
    autoPlay = false,
    initialPositionMs = 0,
    progressUpdateIntervalMillis = DEFAULT_PROGRESS_UPDATE_MS,
  }: {
    autoPlay?: boolean;
    initialPositionMs?: number;
    progressUpdateIntervalMillis?: number;
  } = {}
) {
  const { sound, status } = await Audio.Sound.createAsync(
    { uri },
    {
      positionMillis: initialPositionMs,
      shouldPlay: !!autoPlay,
      progressUpdateIntervalMillis,
    },
    onStatusUpdate
  );
  return { sound, status: status as AVPlaybackStatusSuccess };
}

/** Descarga y limpia un Sound, ignorando errores. */
export async function unloadSound(sound?: Audio.Sound | null) {
  if (!sound) return;
  try {
    sound.setOnPlaybackStatusUpdate(null as any);
  } catch {}
  try {
    await sound.unloadAsync();
  } catch {}
}

/**
 * Devuelve la duración (ms) de un archivo de audio sin reproducirlo.
 * Carga el Sound temporalmente, lee la duración y lo libera.
 */
export async function getDurationFromFile(uri: string): Promise<number | undefined> {
  const { sound } = await createSound(uri, undefined, { autoPlay: false });
  try {
    const st = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
    return st.isLoaded ? st.durationMillis ?? undefined : undefined;
  } finally {
    await unloadSound(sound);
  }
}

/** Ajusta la posición actual (ms) con guardas. */
export async function safeSeek(sound: Audio.Sound, ms: number) {
  const st = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
  if (!st.isLoaded) return;
  const dur = st.durationMillis ?? 0;
  const clamped = Math.max(0, Math.min(ms, dur));
  await sound.setPositionAsync(clamped);
}

/** Play con guardas (si ya está reproduciendo no hace nada). */
export async function safePlay(sound: Audio.Sound) {
  const st = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
  if (!st.isLoaded) return;
  if (!st.isPlaying) await sound.playAsync();
}

/** Pause con guardas. */
export async function safePause(sound: Audio.Sound) {
  const st = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
  if (!st.isLoaded) return;
  if (st.isPlaying) await sound.pauseAsync();
}

/** Stop y vuelve a 0. */
export async function safeStop(sound: Audio.Sound) {
  const st = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
  if (!st.isLoaded) return;
  await sound.stopAsync();
  await sound.setPositionAsync(0);
}
