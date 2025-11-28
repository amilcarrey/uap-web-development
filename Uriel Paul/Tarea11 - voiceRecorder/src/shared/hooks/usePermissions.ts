// src/app/shared/hooks/usePermissions.ts
// Hooks simples para gestionar permisos (micrófono, etc.) con estado de React.
// En este proyecto usamos principalmente MICRÓFONO (expo-av).
//
// Depende de: src/config/permissions.ts
//   - checkMicrophonePermission()
//   - requestMicrophonePermission()
//   - ensureMicrophonePermission()
//   - openAppSettings()
//   - PermissionSimpleStatus
//
// Uso:
//   const mic = useMicrophonePermission({ autoCheck: true });
//   if (mic.isUndetermined) await mic.request();
//   if (!mic.isGranted) await mic.openSettings();

import * as React from "react";
import {
  checkMicrophonePermission,
  requestMicrophonePermission,
  ensureMicrophonePermission,
  openAppSettings,
} from "@/config/permissions";
import type { PermissionSimpleStatus } from "@/config/permissions";

export type UsePermissionOpts = {
  /** Verifica el permiso al montar el hook. */
  autoCheck?: boolean;
  /** Pide el permiso automáticamente si está "undetermined". */
  autoRequestIfUndetermined?: boolean;
};

export type PermissionState = {
  status: PermissionSimpleStatus; // "granted" | "denied" | "undetermined"
  isGranted: boolean;
  isDenied: boolean;
  isUndetermined: boolean;
  checking: boolean;

  /** Vuelve a consultar el estado actual. */
  check: () => Promise<PermissionSimpleStatus>;
  /** Solicita permiso al usuario. */
  request: () => Promise<PermissionSimpleStatus>;
  /** Garantiza el permiso (equivale a check + request). Devuelve true si queda otorgado. */
  ensure: () => Promise<boolean>;
  /** Abre configuración del sistema para habilitar manualmente. */
  openSettings: () => Promise<void>;
};

/* ===================== MICRÓFONO ===================== */

export function useMicrophonePermission(opts: UsePermissionOpts = {}): PermissionState {
  const {
    autoCheck = true,
    autoRequestIfUndetermined = false,
  } = opts;

  const [status, setStatus] = React.useState<PermissionSimpleStatus>("undetermined");
  const [checking, setChecking] = React.useState<boolean>(false);

  const derive = React.useCallback(
    (s: PermissionSimpleStatus): PermissionState => ({
      status: s,
      isGranted: s === "granted",
      isDenied: s === "denied",
      isUndetermined: s === "undetermined",
      checking,
      check: async () => {
        setChecking(true);
        try {
          const next = await checkMicrophonePermission();
          setStatus(next);
          return next;
        } finally {
          setChecking(false);
        }
      },
      request: async () => {
        setChecking(true);
        try {
          const next = await requestMicrophonePermission();
          setStatus(next);
          return next;
        } finally {
          setChecking(false);
        }
      },
      ensure: async () => {
        setChecking(true);
        try {
          const ok = await ensureMicrophonePermission();
          setStatus(ok ? "granted" : "denied");
          return ok;
        } finally {
          setChecking(false);
        }
      },
      openSettings: async () => {
        await openAppSettings();
      },
    }),
    [checking]
  );

  // Efecto de auto-check / auto-request
  React.useEffect(() => {
    let mounted = true;
    async function run() {
      if (!autoCheck) return;
      setChecking(true);
      try {
        const s = await checkMicrophonePermission();
        if (!mounted) return;
        setStatus(s);
        if (autoRequestIfUndetermined && s === "undetermined") {
          const r = await requestMicrophonePermission();
          if (!mounted) return;
          setStatus(r);
        }
      } finally {
        if (mounted) setChecking(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [autoCheck, autoRequestIfUndetermined]);

  return derive(status);
}

/* ===================== Alias legible ===================== */
// Por si preferís un nombre más corto en import:
//   import { useMicPermission } from ".../usePermissions";
export const useMicPermission = useMicrophonePermission;
