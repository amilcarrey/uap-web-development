# Mimi Fotos (Expo + React Native)

Aplicación móvil hecha con Expo y React Native que:

- Toma fotos con la cámara en formato 16:9.
- Obtiene ubicación (latitud/longitud) al momento de la captura.
- Persiste fotos (URI, coordenadas, fecha) en AsyncStorage.
- Guarda cada foto en la galería del sistema, dentro del álbum "Mimi Fotos".
- Permite borrar fotos de manera individual desde el modal o borrar todas de una vez.
- Visualiza fotos en grilla 3xN, con opción de agrandar en un modal semitransparente.
- Muestra ubicación debajo de cada foto en el modal.
- Cruz para cerrar y cesto de basura para eliminar fotos dentro del modal.

## Tecnologías

- React Native + Expo
- TypeScript
- expo-camera (API nueva: CameraView, useCameraPermissions)
- expo-location
- expo-media-library
- @react-native-async-storage/async-storage

## Puesta en marcha

1. Clonar / entrar al proyecto:

git clone <URL_DEL_REPOSITORIO>
cd mimi-fotos

2. Instalar dependencias:

npm install

3. Instalar APIs nativas (usa versiones compatibles con tu SDK):

npx expo install expo-camera expo-location expo-media-library @react-native-async-storage/async-storage

4. Iniciar el servidor de desarrollo:

npx expo start -c --tunnel

> Nota: El proyecto requiere que tengas los permisos de cámara, ubicación y galería habilitados en tu dispositivo/emulador.
