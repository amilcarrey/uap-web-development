import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { usePhotos } from '../context/PhotosContext';

export default function GalleryScreen() {
  const { photos } = usePhotos();

  return (
    <View style={styles.container}>
      {photos.length === 0 ? (
        <Text style={styles.empty}>Sin fotos todavía. Toca el tab Cámara para sacar una 📷</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <View style={styles.meta}>
                <Text style={styles.text}>Tomada: {new Date(item.timestamp).toLocaleString()}</Text>
                <Text style={styles.textSmall}>
                  {item.latitude && item.longitude
                    ? `Lat: ${item.latitude.toFixed(5)}  Lng: ${item.longitude.toFixed(5)}`
                    : 'Ubicación no disponible'}
                </Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: { color: colors.muted, padding: 16, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: colors.border,
    borderWidth: 1,
  },
  image: { width: '100%', height: 220 },
  meta: { padding: 12 },
  text: { color: colors.text, fontWeight: '600' },
  textSmall: { color: colors.muted, marginTop: 4 },
});
