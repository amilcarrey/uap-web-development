import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [type, setType] = useState<"front" | "back">("back");
  const cameraRef = useRef<CameraView | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);

  useEffect(() => {
    if (!mediaPermission?.granted) requestMediaPermission();
  }, [mediaPermission]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No se otorgó permiso para la cámara</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={{ color: "white" }}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current && !takingPhoto) {
      try {
        setTakingPhoto(true);
        const picture = await cameraRef.current.takePictureAsync();
        setPhoto(picture.uri);
      } catch (error) {
        console.log("Error al tomar foto:", error);
      } finally {
        setTakingPhoto(false);
      }
    }
  };

  const savePhoto = async () => {
    if (!photo || saving) return;
    try {
      setSaving(true);
      if (mediaPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(photo);
      }

      const saved = await AsyncStorage.getItem("appGallery");
      const galleryArray = saved ? JSON.parse(saved) : [];
      galleryArray.push(photo);
      await AsyncStorage.setItem("appGallery", JSON.stringify(galleryArray));

      alert("✅ Foto guardada");
      setPhoto(null);
    } catch (error) {
      console.error("Error al guardar foto:", error);
      alert("❌ No se pudo guardar la foto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />

          {mediaPermission?.granted ? (
            <Button 
              title={saving ? "Guardando..." : "Guardar"} 
              onPress={savePhoto} 
              disabled={saving} 
            />
          ) : (
            <Button 
              title="Dar permiso galería" 
              onPress={requestMediaPermission} 
            />
          )}

          <TouchableOpacity style={styles.iconBtn} onPress={() => setPhoto(null)} disabled={saving}>
            <Ionicons name="refresh-outline" size={40} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing={type} />
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => setType(type === "back" ? "front" : "back")}>
              <Ionicons name="camera-reverse-outline" size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePhoto} disabled={takingPhoto}>
              <Ionicons
                name="camera-outline"
                size={60}
                color={takingPhoto ? "gray" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/Gallery")}>
              <Ionicons name="images-outline" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  preview: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
  },
  iconBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 50,
  },
  permissionBtn: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "blue",
    borderRadius: 10,
  },
});
