import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';

interface PhotoData {
  uri: string;
  location: Location.LocationObject | null;
  timestamp: number;
}

interface PhotoGalleryProps {
  photos: PhotoData[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const renderItem = ({ item }: { item: PhotoData }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.uri }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          📅 Fecha: {new Date(item.timestamp).toLocaleString()}
        </Text>
        {item.location && (
          <Text style={styles.infoText}>
            📍 Ubicación: {item.location.coords.latitude.toFixed(6)}, {item.location.coords.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    </View>
  );

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay fotos aún</Text>
        <Text style={styles.emptySubtext}>¡Captura algunas fotos con la cámara!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galería de Fotos ({photos.length})</Text>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: 'lightgray',
  },
  listContent: {
    paddingBottom: 20,
  },
  photoContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  photo: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
});