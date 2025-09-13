// src/config/permissions.ts
// Centraliza textos y utilidades para permisos de la app (Expo).
// En este proyecto usamos principalmente el micrófono (expo-av).

import { Platform, Linking } from "react-native";
import { Audio } from "expo-av";

/**
 * Estados simplificados para permisos.
 */
export type PermissionSimpleStatus = "granted" | "denied" | "undetermined";

/**
 * Textos mostrables en UI cuando el permiso es requerido/denegado.
 * Útiles si querés renderizar un diálogo propio antes de solicitar permisos.
 */
export const MICROPHONE_PERMISSION_TEXTS = {
  title: "Permiso de micrófono",
  rationaleIOS:
    "Necesitamos acceso al micrófono para poder grabar audio con la aplicación.",
  rationaleAndroid:
    "Esta app requiere acceso al micrófono para grabar tus notas de voz.",
  denied:
    "No se pudo obtener el permiso de micrófono. Podés habilitarlo desde Configuración.",
  blocked:
    "El permiso de micrófono está bloqueado. Abrí Configuración para otorgarlo manualmente.",
} as const;

/**
 * Verifica el estado actual del permiso de micrófono.
 */
export async function checkMicrophonePermission(): Promise<PermissionSimpleStatus> {
  const { status } = await Audio.getPermissionsAsync();
  return status as PermissionSimpleStatus;
}

/**
 * Solicita el permiso de micrófono al usuario.
 */
export async function requestMicrophonePermission(): Promise<PermissionSimpleStatus> {
  const { status } = await Audio.requestPermissionsAsync();
  return status as PermissionSimpleStatus;
}

/**
 * Garantiza que el permiso de micrófono esté otorgado.
 * Devuelve true si quedó en "granted", false en caso contrario.
 *
 * Patrón recomendado:
 * - Primero check
 * - Luego request si no está concedido
 * - Si sigue denegado, ofrecer ir a Configuración
 */
export async function ensureMicrophonePermission(): Promise<boolean> {
  let status = await checkMicrophonePermission();

  if (status !== "granted") {
    status = await requestMicrophonePermission();
  }

  return status === "granted";
}

/**
 * Abre la pantalla de ajustes del sistema para que el usuario
 * habilite manualmente los permisos bloqueados/denegados permanentemente.
 */
export async function openAppSettings(): Promise<void> {
  // Expo/React Native
  await Linking.openSettings();
}

/**
 * Helper para obtener el texto de “rationale” según plataforma.
 */
export function getMicrophoneRationale(): string {
  return Platform.OS === "ios"
    ? MICROPHONE_PERMISSION_TEXTS.rationaleIOS
    : MICROPHONE_PERMISSION_TEXTS.rationaleAndroid;
}

/*
  Recordatorio de configuración (no es código ejecutable):

  - En app.json (Expo), agregá los mensajes nativos:
    {
      "expo": {
        "ios": {
          "infoPlist": {
            "NSMicrophoneUsageDescription": "Necesitamos el micrófono para grabar audio."
          }
        },
        "android": {
          "permissions": ["RECORD_AUDIO"]
        }
      }
    }

  - Pedí permisos “on demand” (al tocar Grabar), no al abrir la app.
  - Si el usuario deniega permanentemente, ofrecé openAppSettings().
*/
