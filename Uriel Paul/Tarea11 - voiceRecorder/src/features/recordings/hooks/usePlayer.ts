// src/app/features/recordings/hooks/usePlayer.ts
// Hook de reproducción basado en expo-av (Audio.Sound).
// Controla un ÚNICO “sound” activo a la vez (un archivo por vez).

import * as React from "react";
import {
  Audio,
  AVPlaybackStatusSuccess,
  AVPlaybackStatusError,
  InterruptionModeIOS,
  InterruptionModeAndroid,
} from "expo-av";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused";

type LoadParams = {
  id: string;
  uri: string;
  initialPositionMs?: number;
  autoPlay?: boolean;
};

type UsePlayer = {
  status: PlayerStatus;
  activeId: string | null;
  currentMs: number;
  durationMs?: number;
  lastError?: string;

  load: (p: LoadParams) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (ms: number) => Promise<void>;
  unload: () => Promise<void>;

  isActive: (id: string) => boolean;
};

export default function usePlayer(): UsePlayer {
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const audioModeSetRef = React.useRef(false);
  const activeIdRef = React.useRef<string | null>(null);

  const [status, setStatus] = React.useState<PlayerStatus>("idle");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [currentMs, setCurrentMs] = React.useState(0);
  const [durationMs, setDurationMs] = React.useState<number | undefined>(undefined);
  const [lastError, setLastError] = React.useState<string | undefined>(undefined);

  // Evita condiciones de carrera cuando se cambian pistas rápidamente.
  const opTokenRef = React.useRef(0);

  const ensureAudioMode = React.useCallback(async () => {
    if (audioModeSetRef.current) return;
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
    });
    audioModeSetRef.current = true;
  }, []);

  const detachStatusUpdate = React.useCallback(() => {
    soundRef.current?.setOnPlaybackStatusUpdate(null as any);
  }, []);

  const unload = React.useCallback(async () => {
    detachStatusUpdate();
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // ignore
      }
    }
    soundRef.current = null;
    activeIdRef.current = null;
    setActiveId(null);
    setCurrentMs(0);
    setDurationMs(undefined);
    setStatus("idle");
  }, [detachStatusUpdate]);

  const onPlaybackStatusUpdate = React.useCallback(
    (s: AVPlaybackStatusSuccess | AVPlaybackStatusError) => {
      if (!s) return;

      if ("error" in s) {
        setLastError(s.error || "Playback error");
        setStatus("idle");
        return;
      }

      if (s.isLoaded) {
        const pos = s.positionMillis ?? 0;
        const dur = s.durationMillis ?? durationMs;

        setCurrentMs(pos);
        if (dur != null) setDurationMs(dur);

        if (s.isPlaying) setStatus("playing");
        else if (s.isBuffering) setStatus("loading");
        else {
          if (s.didJustFinish) {
            setStatus("idle");
            if (dur != null) setCurrentMs(dur);
          } else {
            setStatus("paused");
          }
        }
      }
    },
    [durationMs]
  );

  const load = React.useCallback(
    async ({ id, uri, initialPositionMs = 0, autoPlay = false }: LoadParams) => {
      const myToken = ++opTokenRef.current;
      setLastError(undefined);
      setStatus("loading");

      try {
        await ensureAudioMode();

        // Si hay algo cargado, descargar primero
        if (soundRef.current) {
          try {
            detachStatusUpdate();
            await soundRef.current.unloadAsync();
          } catch {
            // ignore
          }
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          {
            positionMillis: initialPositionMs,
            shouldPlay: !!autoPlay,
            progressUpdateIntervalMillis: 250,
          },
          onPlaybackStatusUpdate
        );

        // Si otra operación tomó el control mientras cargábamos, abortar.
        if (myToken !== opTokenRef.current) {
          try {
            sound.setOnPlaybackStatusUpdate(null as any);
            await sound.unloadAsync();
          } catch {
            // ignore
          }
          return;
        }

        soundRef.current = sound;
        activeIdRef.current = id;
        setActiveId(id);

        const init = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
        if (init.isLoaded) {
          setCurrentMs(init.positionMillis ?? 0);
          if (init.durationMillis != null) setDurationMs(init.durationMillis);
          setStatus(init.isPlaying ? "playing" : autoPlay ? "playing" : "paused");
        } else {
          setStatus("paused");
        }
      } catch (e: any) {
        setLastError(String(e?.message || e));
        setStatus("idle");
      }
    },
    [detachStatusUpdate, ensureAudioMode, onPlaybackStatusUpdate]
  );

  const play = React.useCallback(async () => {
    setLastError(undefined);
    if (!soundRef.current) return;
    try {
      await soundRef.current.playAsync();
    } catch (e: any) {
      setLastError(String(e?.message || e));
    }
  }, []);

  const pause = React.useCallback(async () => {
    setLastError(undefined);
    if (!soundRef.current) return;
    try {
      await soundRef.current.pauseAsync();
    } catch (e: any) {
      setLastError(String(e?.message || e));
    }
  }, []);

  const stop = React.useCallback(async () => {
    setLastError(undefined);
    if (!soundRef.current) return;
    try {
      await soundRef.current.stopAsync();
      setCurrentMs(0);
      setStatus("paused");
    } catch (e: any) {
      setLastError(String(e?.message || e));
    }
  }, []);

  const seek = React.useCallback(async (ms: number) => {
    setLastError(undefined);
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(Math.max(0, Math.floor(ms)));
    } catch (e: any) {
      setLastError(String(e?.message || e));
    }
  }, []);

  const isActive = React.useCallback((id: string) => {
    return activeIdRef.current === id;
  }, []);

  React.useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  return {
    status,
    activeId,
    currentMs,
    durationMs,
    lastError,
    load,
    play,
    pause,
    stop,
    seek,
    unload,
    isActive,
  };
}
