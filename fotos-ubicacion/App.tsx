import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Image, FlatList } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";

type Shot = {
  id: string;
  uri: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: number;
  assetId?: string;          
};

const STORAGE_KEY = "@fotos_ubicacion_entries";
const ALBUM_NAME = "Fotos Ubicación";

export default function App() {
  const [camPerm, requestCamPerm] = useCameraPermissions();
  const camRef = useRef<CameraView | null>(null);

  const [locPerm, setLocPerm] = useState<"pending" | "granted" | "denied">("pending");
  const [galleryPerm, setGalleryPerm] = useState<"pending" | "granted" | "denied">("pending");

  const [facing, setFacing] = useState<"back" | "front">("back");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<Shot[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (camPerm && !camPerm.granted) await requestCamPerm();

        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocPerm(status === "granted" ? "granted" : "denied");

        const { status: gStatus } = await MediaLibrary.requestPermissionsAsync();
        setGalleryPerm(gStatus === "granted" ? "granted" : "denied");

        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setEntries(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveEntries = async (data: Shot[]) => {
    setEntries(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const takePhoto = async () => {
    if (!camRef.current) return;

    try {
      setBusy(true);

      const photo = await camRef.current.takePictureAsync({ quality: 0.8, skipProcessing: true });

      let latitude: number | null = null;
      let longitude: number | null = null;

      if (locPerm === "granted") {
        try {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
        } catch (e: any) {
          console.warn("No se pudo obtener ubicación:", e?.message);
        }
      }

      let assetId: string | undefined = undefined;
      if (galleryPerm === "granted" && photo?.uri) {
        try {
          const asset = await MediaLibrary.createAssetAsync(photo.uri);
          assetId = asset.id;

         
          try {
            let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
            if (!album) {
              await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
            } else {
              await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
          } catch (albumErr) {
            console.warn("No se pudo actualizar el álbum (ya está en Recientes):", albumErr);
          }
        } catch (saveErr: any) {
          console.warn("Error guardando en galería:", saveErr?.message);
          Alert.alert("Aviso", "La foto se guardó en la app, pero no en la galería.");
        }
      } else if (galleryPerm !== "granted") {
        Alert.alert("Permiso de galería no concedido", "La foto se guardará solo dentro de la app.");
      }

      
      const shot: Shot = {
        id: String(Date.now()),
        uri: photo?.uri ?? "",
        latitude,
        longitude,
        timestamp: Date.now(),
        assetId, 
      };

      const next = [shot, ...entries];
      await saveEntries(next);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo capturar/guardar la foto");
    } finally {
      setBusy(false);
    }
  };

  const clearAll = () => {
    Alert.alert("Borrar todo", "¿Seguro que deseas eliminar todas las fotos guardadas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const ids = entries.map(e => e.assetId).filter(Boolean) as string[];
            if (ids.length > 0) {
              await MediaLibrary.deleteAssetsAsync(ids);
            }
          } catch (err) {
            console.warn("No se pudieron borrar algunos assets de la galería:", err);
          } finally {
            await saveEntries([]);
          }
        }
      }
    ]);
  };

  if (loading || !camPerm) {
    return (
      <View style={s.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Preparando…</Text>
      </View>
    );
  }

  if (!camPerm.granted) {
    return (
      <View style={s.center}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Permiso de cámara requerido</Text>
        <TouchableOpacity onPress={requestCamPerm} style={s.btn}>
          <Text style={s.btnText}>Conceder permiso</Text>
        </TouchableOpacity>
        <Text style={s.hint}>Si lo negaste antes, habilítalo en Ajustes → Expo Go → Cámara.</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Fotos con Ubicación</Text>
        <TouchableOpacity onPress={clearAll} style={s.btnGhost}>
          <Text style={s.btnGhostText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <View style={s.cameraWrap}>
        <CameraView ref={camRef} style={s.camera} facing={facing} animateShutter={false} />
      </View>

      <View style={s.row}>
        <TouchableOpacity onPress={() => setFacing(facing === "back" ? "front" : "back")} style={s.btn}>
          <Text style={s.btnText}>Cambiar cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto} style={[s.btn, s.btnPrimary]} disabled={busy}>
          <Text style={s.btnPrimaryText}>{busy ? "Capturando…" : "Tomar foto"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.permText}>Permiso de ubicación: {locPerm} · Galería: {galleryPerm}</Text>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={<Text style={{ textAlign: "center", color: "#666" }}>Aún no hay fotos.</Text>}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Image source={{ uri: item.uri }} style={s.cardImage} />
            <View style={s.cardInfo}>
              <Text style={s.cardTitle}>{new Date(item.timestamp).toLocaleString()}</Text>
              <Text style={s.cardSubtitle}>
                {item.latitude !== null && item.longitude !== null
                  ? `Lat: ${item.latitude.toFixed(6)}  Lon: ${item.longitude.toFixed(6)}`
                  : "Sin coordenadas"}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#de186b20" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  header: {
    paddingTop: 48, paddingHorizontal: 16, paddingBottom: 8,
    backgroundColor: "#db1f6a36",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomColor: "#d42077aa", borderBottomWidth: StyleSheet.hairlineWidth
  },
  title: { fontSize: 20, fontWeight: "800" },
  cameraWrap: { height: 260, margin: 12, borderRadius: 12, overflow: "hidden", backgroundColor: "#cd1e64b3" },
  camera: { flex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 4 },
  btn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, backgroundColor: "#db3686c3" },
  btnText: { fontWeight: "700" },
  btnPrimary: { backgroundColor: "#db3686c3" },
  btnPrimaryText: { color: "#f3ebefff", fontWeight: "800" },
  btnGhost: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#e5e7ebff" },
  btnGhostText: { color: "#e72ea6cc", fontWeight: "700" },
  hint: { color: "#d3598855", fontSize: 13, marginTop: 8, textAlign: "center" },
  permText: { marginTop: 8, marginLeft: 16, color: "#ce648fff" },
  card: {
    backgroundColor: "#d2256508", borderRadius: 12, overflow: "hidden",
    marginTop: 12, borderColor: "#e5e7eb", borderWidth: StyleSheet.hairlineWidth
  },
  cardImage: { width: "100%", height: 170, backgroundColor: "#bd3d7faf" },
  cardInfo: { padding: 12 },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
  cardSubtitle: { color: "#df2e6cff" }
});
