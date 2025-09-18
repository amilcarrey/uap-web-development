import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../theme';
import { usePhotos } from '../context/PhotosContext';

export default function MapScreen() {
  const { photos } = usePhotos();

  const initial = useMemo(() => {
    const first = photos.find(p => p.latitude && p.longitude);
    if (first && first.latitude && first.longitude) {
      return {
        latitude: first.latitude,
        longitude: first.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    // Rosario (Newell's) default
    return { latitude: -32.9527, longitude: -60.6393, latitudeDelta: 0.2, longitudeDelta: 0.2 };
  }, [photos]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initial}>
        {photos.map(p => (
          (p.latitude && p.longitude) ? (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={'Foto'}
              description={new Date(p.timestamp).toLocaleString()}
            />
          ) : null
        ))}
      </MapView>
      {photos.length === 0 && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Aún no hay ubicaciones. Sacá una foto primero.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  overlayText: { color: colors.text, textAlign: 'center' },
});
