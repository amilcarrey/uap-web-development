# README – Proyecto **Grabadora de Voz en React Native**

## 🎯 Descripción del Proyecto

Aplicación móvil de **grabadora de voz** que permite al usuario:

* Grabar audio desde el micrófono del dispositivo.
* Guardar las grabaciones en almacenamiento local.
* Listar todas las grabaciones realizadas.
* Reproducir, pausar y borrar grabaciones.

La app estará desarrollada en **React Native con Expo**, aprovechando la API nativa de audio de Expo.

---

## 🏗️ Arquitectura del Sistema

La aplicación se divide en **4 capas principales**:

1. **Input Layer (Entrada de Audio)**

   * Acceso al **micrófono** usando [`expo-av`](https://docs.expo.dev/versions/latest/sdk/av/).
   * Control de permisos (`Audio.requestPermissionsAsync()`).
   * Captura y almacenamiento de las grabaciones en formato `.m4a` o `.wav`.

2. **Storage Layer (Persistencia de Datos)**

   * Almacenamiento de archivos de audio en el sistema de archivos (`expo-file-system`).
   * Registro de metadatos (nombre, fecha, duración) en `AsyncStorage` o en un archivo JSON local.

3. **Logic Layer (Gestión de Grabaciones)**

   * Control de grabación (iniciar, pausar, detener).
   * Control de reproducción (play, pause, stop, seek).
   * Eliminación de grabaciones.
   * Manejo de estado global con Context API o Zustand (opcional).

4. **UI Layer (Interfaz de Usuario)**

   * Pantalla principal con:

     * Botón de grabar/detener.
     * Lista de grabaciones con nombre, fecha y duración.
     * Botones de reproducir/pausar/eliminar para cada grabación.
   * Estilo minimalista y responsivo.

---

## 📦 Tecnologías y Librerías

* **Framework principal**: [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/)
* **Audio**: [`expo-av`](https://docs.expo.dev/versions/latest/sdk/av/)
* **Sistema de archivos**: [`expo-file-system`](https://docs.expo.dev/versions/latest/sdk/filesystem/)
* **Almacenamiento local**: [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/)
* **UI Components**:

  * `react-native-paper` o `react-native-elements` para botones y listas.
  * `react-native-vector-icons` para íconos (play, pause, delete).

---

## 🔄 Flujo de Datos

1. **Grabación**

   * Usuario presiona “Grabar”.
   * Se solicita permiso de micrófono.
   * `expo-av` crea un objeto `Audio.Recording`.
   * Al detener, el archivo se guarda en `expo-file-system`.

2. **Almacenamiento**

   * Se guarda metadato en AsyncStorage:

     ```json
     {
       "id": "rec_001",
       "fileUri": "file:///data/user/0/app/audio/rec_001.m4a",
       "date": "2025-09-13T10:15:00",
       "duration": "00:35"
     }
     ```

3. **Listado**

   * Se obtiene la lista de grabaciones desde AsyncStorage.
   * Se muestran en una FlatList con opciones.

4. **Reproducción**

   * Usuario selecciona una grabación.
   * `expo-av` carga el archivo y lo reproduce.
   * Controles de pausa, continuar, detener.

5. **Eliminación**

   * Se borra el archivo físico (`expo-file-system.deleteAsync()`).
   * Se actualiza AsyncStorage removiendo el registro.

---

## 📱 Pantallas

### 1. Pantalla Principal

* Botón circular grande (⏺️ Grabar / ⏹️ Detener).
* Lista de grabaciones:

  * Nombre (ej. “Grabación 1”).
  * Fecha y duración.
  * Botones de reproducir/pausar (▶️ / ⏸️) y eliminar (🗑️).

### 2. (Opcional) Pantalla de Detalle

* Onda de audio visualizada (con librería externa).
* Controles más avanzados: deslizar para avanzar/retroceder.

---

## ⚙️ Roadmap de Implementación

1. **Setup inicial**

   * Crear proyecto con `expo init`.
   * Instalar `expo-av`, `expo-file-system`, `@react-native-async-storage/async-storage`.

2. **Grabación de audio**

   * Implementar hook `useRecorder` para manejar permisos + grabación.

3. **Almacenamiento**

   * Guardar archivos y metadatos.
   * Persistir con AsyncStorage.

4. **UI – Lista de grabaciones**

   * FlatList con metadatos.
   * Botones para reproducir y eliminar.

5. **Reproducción de audio**

   * Implementar hook `usePlayer` con `Audio.Sound`.

6. **Eliminar grabaciones**

   * Función para borrar archivo + actualizar estado.

7. **Estilos y UX**

   * Mejorar interfaz con íconos y feedback visual (ej: grabando en rojo).

8. **Testing en dispositivo físico**

   * Probar grabación y reproducción en Android/iOS reales.

---

## 🎯 Ejemplo de Escenario de Uso

1. Usuario abre la app y presiona **Grabar**.
2. Habla durante unos segundos.
3. Presiona **Detener** → la app guarda el archivo `rec_001.m4a`.
4. En la lista aparece:

   * “Grabación 1 – 35s – 13/09/2025”.
5. El usuario presiona ▶️ → escucha la grabación.
6. Si ya no la quiere, presiona 🗑️ → se elimina.





voice-recorder-app/
├── app.json
├── App.tsx
├── package.json
├── tsconfig.json
├── babel.config.js
│
├── assets/
│   ├── icons/
│   └── splash.png
│
├── src/
│   ├── app/                    # (opcional) navegación o expo-router
│   │   └── navigation.tsx
│   │
│   ├── features/
│   │   └── recordings/         # TODO de la feature “grabaciones”
│   │       ├── screens/
│   │       │   └── HomeScreen.tsx
│   │       ├── components/
│   │       │   ├── RecordButton.tsx
│   │       │   ├── RecordingItem.tsx
│   │       │   └── PlayerControls.tsx
│   │       ├── hooks/
│   │       │   ├── useRecorder.ts
│   │       │   └── usePlayer.ts
│   │       ├── services/
│   │       │   ├── audio.service.ts        # setAudioMode, creación de Recording/Sound
│   │       │   ├── file-system.service.ts  # expo-file-system
│   │       │   └── storage.service.ts      # AsyncStorage (repo de metadatos)
│   │       ├── model/
│   │       │   ├── types.ts                # RecordingMeta, estados, etc.
│   │       │   └── state.ts                # Zustand/Context (opcional)
│   │       └── utils/
│   │           ├── formatDate.ts
│   │           └── formatDuration.ts
│   │
│   ├── shared/                 # cross-cutting reutilizable
│   │   ├── ui/                 # botones, tipografías, etc.
│   │   ├── hooks/              # usePermissions(), useAppState()
│   │   ├── lib/                # wrappers genéricos (AsyncStorage, FS)
│   │   └── styles/
│   │       └── theme.ts
│   │
│   └── config/
│       └── permissions.ts      # textos y claves de permisos
│
└── README.md

---