import { useRouter } from "expo-router";
import { View, Text, Button, StyleSheet, FlatList, Image } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GalleryScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const saved = await AsyncStorage.getItem("appGallery");
      if (saved) setPhotos(JSON.parse(saved));
    };
    loadPhotos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📂 Galería</Text>

      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />

      {/* Botón para volver a la cámara */}
      <Button title="Volver a la cámara" onPress={() => router.push("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  image: { width: "100%", height: 200, marginBottom: 10, borderRadius: 8 },
});
