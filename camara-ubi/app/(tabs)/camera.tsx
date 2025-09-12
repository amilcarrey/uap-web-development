// app/camera.tsx (o donde tengas tu pantalla)
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";

export default function CameraScreen() {
  const [camPerm, requestCamPerm] = useCameraPermissions();
  const [locGranted, setLocGranted] = useState<boolean | null>(null);
  const [libGranted, setLibGranted] = useState<boolean | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      // Cámara
      if (!camPerm?.granted) {
        await requestCamPerm();
      }
      // Ubicación
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      setLocGranted(locStatus === "granted");

      // Biblioteca/galería
      const media = await MediaLibrary.requestPermissionsAsync();
      setLibGranted(media.status === "granted");
    })();
  }, [camPerm?.granted]);

  const takePhotoAndGetLocation = async () => {
    if (!cameraRef.current || !cameraReady) return;

    const picture = await cameraRef.current.takePictureAsync();
    if (picture?.uri) {
      setPhoto(picture.uri);

      if (locGranted) {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        } catch {
          setLocation(null);
        }
      }

      if (libGranted) {
        await MediaLibrary.saveToLibraryAsync(picture.uri);
        Alert.alert("Foto guardada", "La foto se guardó en la galería.");
      }
    }
  };

  // Estados de permisos
  if (!camPerm) return null;
  if (!camPerm.granted) {
    return (
      <View style={styles.center}>
        <Text>Se necesita permiso de cámara.</Text>
        <Button title="Conceder cámara" onPress={requestCamPerm} />
      </View>
    );
  }
  if (locGranted === null || libGranted === null) {
    return <View style={styles.center}><Text>Solicitando permisos…</Text></View>;
  }
  if (!locGranted) {
    return <View style={styles.center}><Text>Permiso de ubicación denegado</Text></View>;
  }
  if (!libGranted) {
    return <View style={styles.center}><Text>Permiso de galería denegado</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 2 }}
        facing="back"
        onCameraReady={() => setCameraReady(true)}
      />
      <View style={styles.center}>
        <Button title="Tomar foto y obtener ubicación" onPress={takePhotoAndGetLocation} />
        {photo && (
          <Image source={{ uri: photo }} style={{ width: 200, height: 200, marginTop: 10 }} />
        )}
        {location && (
          <Text style={{ marginTop: 10 }}>
            Ubicación: Lat {location.latitude}, Lon {location.longitude}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
