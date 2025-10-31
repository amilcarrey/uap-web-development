import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { navigate } from 'expo-router/build/global-state/routing';
import { useAtomValue } from 'jotai';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fotosAtom } from '../atom';

export default function TabTwoScreen() {
  const fotos = useAtomValue(fotosAtom);

  // Calculate initial region based on photos or use default
  const getInitialRegion = () => {
    if (fotos.length === 0) {
      return {
        latitude: -2.21452,
        longitude: -80.95151,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    // Calculate region that fits all markers
    const lats = fotos.map(f => f.lat);
    const longs = fotos.map(f => f.long);
    
    return {
      latitude: (Math.max(...lats) + Math.min(...lats)) / 2,
      longitude: (Math.max(...longs) + Math.min(...longs)) / 2,
      latitudeDelta: (Math.max(...lats) - Math.min(...lats)) * 1.1 || 0.05,
      longitudeDelta: (Math.max(...longs) - Math.min(...longs)) * 1.1 || 0.05,
    };
  };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="map"
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
            }}>
            Mapa
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.mapContainer}>
          {fotos.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>
                No hay fotos disponibles
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Toma algunas fotos para verlas en el mapa
              </ThemedText>
            </ThemedView>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={getInitialRegion()}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {fotos.map((foto, index) => (
                <Marker
                  key={`${foto.file}-${index}`}
                  coordinate={{
                    latitude: foto.lat,
                    longitude: foto.long,
                  }}
                  title={`Foto ${index + 1}`}
                  description={`Ubicación de la foto`}
                />
              ))}
            </MapView>
          )}
        </ThemedView>

        <ThemedView>
          <TouchableHighlight onPress={() => navigate('../pages/FotoList')}>
            <ThemedText style={styles.emptyText}>
                Ver todas las fotos
              </ThemedText>
          </TouchableHighlight>
        </ThemedView>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  mapContainer: {
    height: 400, // Fixed height for the map
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});