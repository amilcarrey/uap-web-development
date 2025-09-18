# Photo Camera App - React Native

Aplicación móvil simple para tomar fotos usando React Native con Expo.

## Funcionalidades

- Acceso a la cámara del dispositivo
- Tomar fotos con botón de captura
- Cambiar entre cámara frontal y trasera
- Galería para ver fotos tomadas
- Guardar fotos en la galería del dispositivo

## Instalación

### Requisitos previos
- Node.js instalado
- Expo CLI instalado globalmente: `npm install -g @expo/cli`
- Aplicación Expo Go en tu dispositivo iOS

### Pasos de instalación

1. Navegar al directorio del proyecto:
```bash
cd exercises/tarea-react-native
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el proyecto:
```bash
npx expo start
```

4. Escanear el código QR con tu dispositivo iOS usando la app Expo Go

## Uso

1. Al abrir la app, acepta los permisos de cámara y galería
2. Usa el botón circular blanco para tomar fotos
3. Usa "Cambiar" para alternar entre cámara frontal y trasera
4. Usa "Galería" para ver las fotos tomadas
5. En la galería, usa "← Cámara" para volver a la cámara

## Tecnologías utilizadas

- React Native
- Expo
- expo-camera
- expo-media-library

## APIs Nativas utilizadas

- **Cámara**: Para capturar fotos y video
- **Galería/Media Library**: Para guardar y acceder a fotos