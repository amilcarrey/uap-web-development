import { fotosAtom } from '@/app/atom';
import * as MediaLibrary from 'expo-media-library';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export type Foto = {
    file: string;
    long: number;
    lat: number;
}

type FotoItemProps = {
    foto: Foto;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 30) / 2; // Account for margins

export function FotoItem({ foto }: FotoItemProps) {
    return (
        <View style={styles.itemContainer}>
            {/* Contenedor de la foto */}
            <View style={styles.photoContainer}>
                <Image
                    source={{ uri: foto.file }}
                    style={styles.photo}
                />
            </View>
            
            {/* Contenedor del mapa */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: foto.lat,
                        longitude: foto.long,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                >
                    <Marker
                        coordinate={{ latitude: foto.lat, longitude: foto.long }}
                        title="Foto tomada aquí"
                    />
                </MapView>
            </View>
        </View>
    );
}

export default function FotosList() {
    const [permission, requestPermission] = MediaLibrary.usePermissions();
    const fotos: Foto[] = useAtomValue(fotosAtom);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkPermissions = async () => {
            if (permission?.granted) {
                // Load photos here if needed
                setIsLoading(false);
            } else if (permission?.canAskAgain) {
                await requestPermission();
            }
        };

        checkPermissions();
    }, [permission]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Loading photos...</Text>
            </View>
        );
    }

    if (fotos.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text>Aun no existen fotos</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={fotos}
                keyExtractor={(item) => item.file}
                renderItem={({ item }) => (
                    <FotoItem foto={item} />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    listContent: {
        padding: 16,
    },
    itemContainer: {
        flexDirection: 'row', // Esto hace que sea horizontal
        height: 200, // Altura fija para cada item
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    photoContainer: {
        flex: 1, // Ocupa la mitad del espacio
        backgroundColor: '#000',
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mapContainer: {
        flex: 1, // Ocupa la otra mitad del espacio
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});