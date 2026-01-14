// src/app/features/recordings/hooks/useRecorder.ts
import * as React from "react";
import { Platform } from "react-native";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import {
  bestBaseDir,
  ensureDir,
  joinUri,
  dirname,
  ensureTrailingSlash,
} from "@/shared/lib/file-system";
import { ensureMicrophonePermission } from "@/config/permissions";

export type RecordStatus = "idle" | "recording" | "saving" | "blocked";

export type RecordingMeta = {
  id: string;
  fileUri: string;
  name: string;
  createdAt: string;
  durationMs: number;
  sizeBytes?: number;
};

type UseRecorder = {
  status: RecordStatus;
  elapsedMs: number;
  lastError?: string;
  start: () => Promise<boolean>;
  stop: () => Promise<RecordingMeta | null>;
  pause?: () => Promise<void>;
  resume?: () => Promise<void>;
};

export default function useRecorder(): UseRecorder {
  const recordingRef = React.useRef<Audio.Recording | null>(null);
  const [status, setStatus] = React.useState<RecordStatus>("idle");
  const [elapsedMs, setElapsedMs] = React.useState(0);
  const [lastError, setLastError] = React.useState<string | undefined>(undefined);

  const recordingOptions = React.useMemo((): Audio.RecordingOptions => {
    if (Platform.OS === "ios") return Audio.RecordingOptionsPresets.HIGH_QUALITY;
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
  }, []);

  const ensureRecordingMode = React.useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const onRecordingStatusUpdate = React.useCallback((s: Audio.RecordingStatus) => {
    if (!s || !s.canRecord) return;
    setElapsedMs(s.durationMillis ?? 0);
  }, []);

  const start = React.useCallback(async (): Promise<boolean> => {
    setLastError(undefined);
    try {
      const granted = await ensureMicrophonePermission();
      if (!granted) {
        setStatus("blocked");
        return false;
      }
      await ensureRecordingMode();

      if (recordingRef.current) {
        try { await recordingRef.current.stopAndUnloadAsync(); } catch {}
        recordingRef.current = null;
      }

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(recordingOptions);
      rec.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
      await rec.startAsync();

      recordingRef.current = rec;
      setElapsedMs(0);
      setStatus("recording");
      return true;
    } catch (e: any) {
      setLastError(String(e?.message || e));
      setStatus("idle");
      return false;
    }
  }, [ensureRecordingMode, onRecordingStatusUpdate, recordingOptions]);

  const stop = React.useCallback(async (): Promise<RecordingMeta | null> => {
    setLastError(undefined);
    const rec = recordingRef.current;
    if (!rec) return null;

    setStatus("saving");
    try {
      await rec.stopAndUnloadAsync();

      const tempUri = rec.getURI();
      if (!tempUri) throw new Error("No se obtuvo URI de la grabación.");
      const st = (await rec.getStatusAsync()) as Audio.RecordingStatus;
      const durationMs = st.durationMillis ?? elapsedMs ?? 0;

      // Base preferida (document/cache) o, si no hay, el mismo parent del temp
      const base = bestBaseDir();
      const parent = ensureTrailingSlash(dirname(tempUri));
      const targetDir = await ensureDir(joinUri(base ?? parent, "recordings"));

      const now = new Date();
      const fileName = `Grabación ${isoForName(now)}.m4a`;
      let targetUri = joinUri(targetDir, fileName);

      // Mover; si falla (cross-volume), intentar copy+delete; si todo falla, conservar temp
      try {
        await FileSystem.moveAsync({ from: tempUri, to: targetUri });
      } catch {
        try {
          await FileSystem.copyAsync({ from: tempUri, to: targetUri });
          await FileSystem.deleteAsync(tempUri, { idempotent: true });
        } catch {
          targetUri = tempUri; // último recurso: devolvemos el temp
        }
      }

      let sizeBytes: number | undefined;
      try {
        const info = await FileSystem.getInfoAsync(targetUri);
        sizeBytes = (info as any)?.size ?? undefined;
      } catch {}

      const meta: RecordingMeta = {
        id: genId(),
        fileUri: targetUri,
        name: fileName.replace(".m4a", ""),
        createdAt: now.toISOString(),
        durationMs,
        sizeBytes,
      };

      recordingRef.current = null;
      setStatus("idle");
      setElapsedMs(0);
      return meta;
    } catch (e: any) {
      setLastError(String(e?.message || e));
      setStatus("idle");
      return null;
    }
  }, [elapsedMs]);

  const pause = React.useCallback(async () => {
    const rec = recordingRef.current;
    if (!rec) return;
    try { await rec.pauseAsync(); } catch {}
  }, []);

  const resume = React.useCallback(async () => {
    const rec = recordingRef.current;
    if (!rec) return;
    try { await rec.startAsync(); } catch {}
  }, []);

  React.useEffect(() => {
    return () => {
      const rec = recordingRef.current;
      if (rec) rec.stopAndUnloadAsync().catch(() => {});
    };
  }, []);

  return { status, elapsedMs, lastError, start, stop, pause, resume };
}

/* ---------------- Helpers ---------------- */

function genId() {
  return `rec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isoForName(d: Date) {
  const yyyy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  const hh = d.getHours().toString().padStart(2, "0");
  const mi = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}-${mi}-${ss}`;
}
