import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";

type Shot = {
  id: string;
  uri: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: number;
  assetId?: string;
};

const STORAGE_KEY = "@mimi_fotos_entries";
const ALBUM_NAME = "Mimi Fotos";

const screenWidth = Dimensions.get("window").width;
const cameraHeight = (screenWidth - 20) * 9 / 16; // Cámara 16:9

export default function App() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);

  const [fontsLoaded] = useFonts({
    RubikBold: require("./assets/fonts/Rubik-Bold.ttf"),
  });

  // Cargar fotos guardadas
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setShots(JSON.parse(stored));
    })();
  }, []);

  // Guardar en AsyncStorage
  const saveShots = async (data: Shot[]) => {
    setShots(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const location = await Location.getCurrentPositionAsync({});

      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (!album) {
        album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      const newShot: Shot = {
        id: Date.now().toString(),
        uri: photo.uri,
        latitude: location?.coords.latitude ?? null,
        longitude: location?.coords.longitude ?? null,
        timestamp: Date.now(),
        assetId: asset.id,
      };

      await saveShots([newShot, ...shots]);
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto.");
      console.error(error);
    }
  };

  const clearAll = async () => {
    Alert.alert("Confirmar", "¿Eliminar todas las fotos guardadas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setShots([]);
        },
      },
    ]);
  };

  const deleteShot = async (id: string) => {
    const shotToDelete = shots.find((s) => s.id === id);
    if (shotToDelete?.assetId) {
      try {
        await MediaLibrary.deleteAssetsAsync([shotToDelete.assetId]);
      } catch (err) {
        console.warn("No se pudo eliminar de la galería:", err);
      }
    }
    const updated = shots.filter((s) => s.id !== id);
    await saveShots(updated);
    setModalVisible(false);
  };

  if (!cameraPermission || !locationPermission || !mediaPermission) return <View />;

  if (
    !cameraPermission.granted ||
    !locationPermission.granted ||
    !mediaPermission.granted
  ) {
    return (
      <View style={styles.center}>
        <Text>La app necesita permisos para funcionar.</Text>
        <TouchableOpacity onPress={requestCameraPermission} style={styles.btn}>
          <Text style={styles.btnText}>Dar permisos de cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={requestLocationPermission} style={styles.btn}>
          <Text style={styles.btnText}>Dar permisos de ubicación</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={requestMediaPermission} style={styles.btn}>
          <Text style={styles.btnText}>Dar permisos de galería</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Shot }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedShot(item);
        setModalVisible(true);
      }}
      style={{ margin: 2 }}
    >
      <Image
        source={{ uri: item.uri }}
        style={{
          width: (screenWidth - 8) / 3,
          height: ((screenWidth - 8) / 3) * 9 / 16,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mimi Fotos</Text>
        <TouchableOpacity onPress={clearAll}>
          <Text style={{ color: "red" }}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <CameraView
        ref={cameraRef}
        style={{ margin: 10, borderRadius: 10, overflow: "hidden", height: cameraHeight }}
        facing={cameraType}
      >
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() =>
            setCameraType((prev) => (prev === "back" ? "front" : "back"))
          }
        >
          <Text style={styles.btnText}>↺</Text>
        </TouchableOpacity>
      </CameraView>

      <TouchableOpacity onPress={takePicture} style={styles.btn}>
        <Text style={styles.btnText}>Tomar Foto</Text>
      </TouchableOpacity>

      <FlatList
        data={shots}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 2 }}
      />

      {/* Modal para foto */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBg}>
          {selectedShot && (
            <>
              <Image
                source={{ uri: selectedShot.uri }}
                style={{ width: screenWidth, height: screenWidth * 9 / 16 }}
              />
              <Text style={styles.modalMeta}>
                {selectedShot.latitude && selectedShot.longitude
                  ? `📍 ${selectedShot.latitude.toFixed(4)}, ${selectedShot.longitude.toFixed(4)}`
                  : "📍 Ubicación no disponible"}
              </Text>

              {/* Botón de eliminar debajo de la foto */}
              <TouchableOpacity
                onPress={() => deleteShot(selectedShot.id)}
                style={styles.trashButton}
              >
                <Text style={{ fontSize: 30, color: "red" }}>🗑️</Text>
              </TouchableOpacity>

              {/* Cruz arriba a la derecha */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <View style={styles.crossLine1} />
                <View style={styles.crossLine2} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#333", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  btn: {
    backgroundColor: "#007AFF",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  flipButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 50,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalBg: {
    flex: 1,
    backgroundColor: "#000000DD",
    justifyContent: "center",
    alignItems: "center",
  },
  modalMeta: { color: "#fff", marginTop: 10 },
  trashButton: { marginTop: 10 },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 30,
    height: 30,
  },
  crossLine1: {
    position: "absolute",
    width: 30,
    height: 3,
    backgroundColor: "#fff",
    transform: [{ rotate: "45deg" }],
  },
  crossLine2: {
    position: "absolute",
    width: 30,
    height: 3,
    backgroundColor: "#fff",
    transform: [{ rotate: "-45deg" }],
  },
});
