// src/app/shared/hooks/useAppState.ts
// Hook utilitario para observar el estado de la app (foreground/background)
// y reaccionar a transiciones. Útil para pausar/reanudar audio, liberar
// recursos, refrescar listas, etc.
//
// API:
//   const {
//     appState,            // "active" | "background" | "inactive" | ...
//     isActive,            // true si appState === "active"
//     isBackground,        // !isActive
//     addOnNextForeground, // (cb) -> registra un callback para la PRÓXIMA vez que volvamos a foreground
//     removeOnNextForeground,
//   } = useAppState({ onChange, onForeground, onBackground })
//
// Notas:
// - Usa AppState de React Native con cleanup correcto.
// - Soporta RN modernos (valores: "active" | "background" | "inactive" | "unknown" | "extension").
// - No depende de Expo.

import * as React from "react";
import { AppState, AppStateStatus } from "react-native";

type UseAppStateOpts = {
  /** Se invoca en cada cambio de estado con (next, prev). */
  onChange?: (next: AppStateStatus, prev: AppStateStatus) => void;
  /** Se invoca cuando pasamos a "active" desde cualquier otro estado. */
  onForeground?: () => void;
  /** Se invoca cuando salimos de "active" (hacia background/inactive). */
  onBackground?: () => void;
};

export function useAppState(opts: UseAppStateOpts = {}) {
  const { onChange, onForeground, onBackground } = opts;

  // RN expone AppState.currentState (sincrónico). Puede ser null en plataformas raras.
  const initial = (AppState.currentState || "unknown") as AppStateStatus;

  const [appState, setAppState] = React.useState<AppStateStatus>(initial);
  const prevRef = React.useRef<AppStateStatus>(initial);

  // Cola de callbacks "cuando volvamos a foreground una vez".
  const fgOnceSetRef = React.useRef<Set<() => void>>(new Set());

  const addOnNextForeground = React.useCallback((fn: () => void) => {
    fgOnceSetRef.current.add(fn);
  }, []);

  const removeOnNextForeground = React.useCallback((fn: () => void) => {
    fgOnceSetRef.current.delete(fn);
  }, []);

  React.useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      const prev = prevRef.current;
      prevRef.current = next;
      setAppState(next);

      // Callbacks externos
      try {
        onChange?.(next, prev);
      } catch {}

      // Transiciones interesantes
      const prevWasActive = prev === "active";
      const nowIsActive = next === "active";

      if (!prevWasActive && nowIsActive) {
        // Entramos a foreground
        try {
          onForeground?.();
        } catch {}
        // Ejecutar y limpiar callbacks one-shot
        if (fgOnceSetRef.current.size > 0) {
          const fns = Array.from(fgOnceSetRef.current);
          fgOnceSetRef.current.clear();
          for (const fn of fns) {
            try {
              fn();
            } catch {}
          }
        }
      } else if (prevWasActive && !nowIsActive) {
        // Salimos de foreground
        try {
          onBackground?.();
        } catch {}
      }
    });

    return () => {
      sub.remove();
      fgOnceSetRef.current.clear();
    };
  }, [onChange, onForeground, onBackground]);

  const isActive = appState === "active";
  const isBackground = !isActive;

  return {
    appState,
    isActive,
    isBackground,
    addOnNextForeground,
    removeOnNextForeground,
  };
}

/** Conveniencia: solo booleano de foreground. */
export function useIsForeground() {
  const { isActive } = useAppState();
  return isActive;
}
