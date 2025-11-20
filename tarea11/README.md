# tarea11 — Cámara Lepra (Expo + TypeScript)

App minimalista (roja y negra) para **sacar fotos** y **etiquetarlas con la ubicación actual** (si está disponible), con **galería** en memoria y **mapa** con los puntos de cada foto.
> No guarda nada en almacenamiento persistente: si cerrás la app, se pierde la galería.

## Requisitos
- Node.js 18+ y npm
- Android Studio (si vas a usar emulador) ó un teléfono Android con **Expo Go** instalado
- (Opcional) **API Key de Google Maps** para ver el mapa en Android

## Instalación
```bash
# 1) Instalar dependencias
npm install

# 2) (Opcional pero recomendado) Configurar clave de Google Maps para Android
#   Editá app.json y reemplazá YOUR_GOOGLE_MAPS_API_KEY por tu clave.
#   Cómo obtenerla: https://developers.google.com/maps/documentation/android-sdk/get-api-key

# 3) Iniciar el proyecto en Expo
npm run start
```

- Para probar en **Android físico**: escaneá el QR con **Expo Go**.
- Para **emulador Android**: abrí Android Studio > Device Manager y luego `npm run android` (o presioná `a` en la consola de Expo).

## Permisos que pide
- **Cámara** (obligatorio)
- **Ubicación** (opcional: si se deniega, la foto se guarda sin coordenadas)

## Estructura
```
tarea11/
  app/
    App.tsx
    theme.ts
    context/PhotosContext.tsx
    screens/
      CameraScreen.tsx
      GalleryScreen.tsx
      MapScreen.tsx
  app.json
  package.json
  tsconfig.json
  index.js
  assets/ (icon/splash opcionales)
```

## Notas
- Si el mapa no se ve en Android, asegurate de tener una **API key válida** en `app.json > expo.android.config.googleMaps.apiKey`.
- La ubicación usa `expo-location` con precisión **Balanced** para consumo eficiente.
- El diseño usa colores **rojo (#D40000)** y **negro** para un look estilo Newell's.

¡Éxitos! ⚫🔴
