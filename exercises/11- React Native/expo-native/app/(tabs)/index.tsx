// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// // import { HelloWave } from '@/components/hello-wave';
// // import ParallaxScrollView from '@/components/parallax-scroll-view';
// // import { ThemedText } from '@/components/themed-text';
// // import { ThemedView } from '@/components/themed-view';
// // import { Link } from 'expo-router';

// // export default function HomeScreen() {
// //   return (
// //     <ParallaxScrollView
// //       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
// //       headerImage={
// //         <Image
// //           source={require('@/assets/images/partial-react-logo.png')}
// //           style={styles.reactLogo}
// //         />
// //       }>
// //       <ThemedView style={styles.titleContainer}>
// //         <ThemedText type="title">Welcome!</ThemedText>
// //         <HelloWave />
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
// //         <ThemedText>
// //           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
// //           Press{' '}
// //           <ThemedText type="defaultSemiBold">
// //             {Platform.select({
// //               ios: 'cmd + d',
// //               android: 'cmd + m',
// //               web: 'F12',
// //             })}
// //           </ThemedText>{' '}
// //           to open developer tools.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <Link href="/modal">
// //           <Link.Trigger>
// //             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
// //           </Link.Trigger>
// //           <Link.Preview />
// //           <Link.Menu>
// //             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
// //             <Link.MenuAction
// //               title="Share"
// //               icon="square.and.arrow.up"
// //               onPress={() => alert('Share pressed')}
// //             />
// //             <Link.Menu title="More" icon="ellipsis">
// //               <Link.MenuAction
// //                 title="Delete"
// //                 icon="trash"
// //                 destructive
// //                 onPress={() => alert('Delete pressed')}
// //               />
// //             </Link.Menu>
// //           </Link.Menu>
// //         </Link>

// //         <ThemedText>
// //           {`Tap the Explore tab to learn more about what's included in this starter app.`}
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
// //         <ThemedText>
// //           {`When you're ready, run `}
// //           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
// //           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
// //         </ThemedText>
// //       </ThemedView>
// //     </ParallaxScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   titleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   stepContainer: {
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   reactLogo: {
// //     height: 178,
// //     width: 290,
// //     bottom: 0,
// //     left: 0,
// //     position: 'absolute',
// //   },
// // });

import React, {useEffect, useState } from "react";

import * as Battery from 'expo-battery';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";

const UNSPLASH_ACCESS_KEY = '_R-omWural-GhuDh7-v0dBHbNs7kXhOZ3cZTR6M09R0';
const PIXABAY_API_KEY = '52360273-09ac75c0ffad8d47e90d2841f';

interface ImageResult {
  url: string;
  thumbnail: string;
  alt: string;
  source: string;
}

export default function App() {
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [currentImage, setCurrentImage] = useState<ImageResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageHistory, setImageHistory] = useState<Array<{level: number, image: ImageResult}>>([]);

    useEffect(() => {
        const fetchBatteryLevel = async () => {
            const level = await Battery.getBatteryLevelAsync();
            setBatteryLevel(Math.round(level * 100));
        }

        fetchBatteryLevel();

        // Suscripcion a cambios en el nivel de bateria
        const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(Math.round(batteryLevel * 100));
        });

        return () => subscription.remove();
    }, []);

    const generateSearchTerms = (number: number) => {
        return [
            // Deportes
            `jersey number ${number}`,
            `${number} football shirt`,
            `basketball ${number}`,
            
            // Calles y señalización
            `street sign ${number}`,
            `house number ${number}`,
            `door ${number}`,
            
            // Transporte
            `bus ${number}`,
            `train ${number}`,
            `route ${number}`,
            
            // General
            `number ${number}`,
            `${number} sign`,
            `${number} digit`,
            
            // Contexto específico según el nivel
            ...(number <= 20 ? [`emergency ${number}`, `warning ${number}`] : []),
            ...(number >= 80 ? [`winner ${number}`, `champion ${number}`] : []),
        ];
    };

    const searchUnsplash = async (query: string): Promise<ImageResult[]> => {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=5`);
        const data = await response.json();
        return data.results.map((item: any) => ({
            url: item.urls.full,
            thumbnail: item.urls.thumb,
            alt: item.alt_description || 'Image from Unsplash',
            source: 'Unsplash',
        }));
    }

    const generateFallbackImage = (number: number): ImageResult => {
        const colors = ['ff6b6b', '4ecdc4', '45b7d1', '96ceb4', 'feca57'];
        const color = colors[number % colors.length];
        
        return {
            url: `https://dummyimage.com/400x300/${color}/ffffff&text=${number}`,
            thumbnail: `https://dummyimage.com/200x150/${color}/ffffff&text=${number}`,
            alt: `Number ${number}`,
            source: 'Generated'
        };
    };

    const fetchImageForBattery = async (level: number) => {
        setLoading(true);
        try {
            const searchTerms = generateSearchTerms(level);
            let foundImage: ImageResult | null = null;

            // Intentar buscar con diferentes términos
            for (const term of searchTerms.slice(0, 3)) { // Limitar a 3 búsquedas
                const results = await searchUnsplash(term);
                if (results.length > 0) {
                    foundImage = results[0];
                    break;
                }
            }

            // Si no encontramos nada, usar imagen generada
            if (!foundImage) {
                foundImage = generateFallbackImage(level);
            }

            setCurrentImage(foundImage);
            
            // Agregar al historial
            setImageHistory(prev => [
                { level, image: foundImage! },
                ...prev.slice(0, 4) // Mantener solo los últimos 5
            ]);

        } catch (error) {
            console.error('Error fetching image:', error);
            setCurrentImage(generateFallbackImage(level));
        } finally {
            setLoading(false);
        }
    };

    const refreshImage = () => {
        if (batteryLevel !== null) {
            fetchImageForBattery(batteryLevel);
        }
    };

    const getBatteryColor = () => {
        if (batteryLevel === null) return '#666';
        if (batteryLevel <= 20) return '#ff4757';
        if (batteryLevel <= 50) return '#ffa502';
        return '#2ed573';
    };

    const showImageDetails = () => {
        if (currentImage) {
            Alert.alert(
                'Detalles de la Imagen',
                `Fuente: ${currentImage.source}\nDescripción: ${currentImage.alt}`,
                [{ text: 'OK' }]
            );
        }
    };

    return (
        // <View style={styles.container}>
        //     <Text className="text-3xl font-bold text-white" style={styles.text}>
        //         🔋 Batería: {batteryLevel !== null ? `${batteryLevel}%` : "Cargando..."}
        //     </Text>
        //     {/* Versión con Tailwind */}
        //     <View className="mt-4 p-4 bg-blue-500 rounded-lg">
        //         <Text className="text-white text-center font-bold">
        //             Con Tailwind CSS
        //         </Text>
        //     </View>
        // </View>

        <ScrollView style={styles.container}>
            {/* Header con información de batería */}
            <View style={styles.header}>
                <Text style={styles.title}>📱 Batería en Números</Text>
                <View style={[styles.batteryIndicator, { backgroundColor: getBatteryColor() }]}>
                    <Text style={styles.batteryText}>
                        {batteryLevel !== null ? `${batteryLevel}%` : "Cargando..."}
                    </Text>
                </View>
            </View>

            {/* Imagen principal */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007acc" />
                    <Text style={styles.loadingText}>
                        Buscando imagen con el número {batteryLevel}...
                    </Text>
                </View>
            ) : currentImage ? (
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={showImageDetails}>
                        <Image 
                            source={{ uri: currentImage.url }} 
                            style={styles.mainImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    
                    <View style={styles.imageInfo}>
                        <Text style={styles.imageSource}>
                            📸 {currentImage.source} | {currentImage.alt}
                        </Text>
                        <TouchableOpacity style={styles.refreshButton} onPress={refreshImage}>
                            <Text style={styles.refreshText}>🔄 Buscar otra imagen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}

            {/* Historial de imágenes */}
            {imageHistory.length > 0 && (
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>📚 Historial Reciente:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {imageHistory.map((item, index) => (
                            <TouchableOpacity 
                                key={`${item.level}-${index}`} 
                                style={styles.historyItem}
                                onPress={() => setCurrentImage(item.image)}
                            >
                                <Image 
                                    source={{ uri: item.image.thumbnail }} 
                                    style={styles.historyImage}
                                />
                                <Text style={styles.historyLevel}>{item.level}%</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Información adicional */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    💡 Esta app busca imágenes que contengan el número de tu batería actual.
                    {'\n'}🔋 Puede ser una camiseta deportiva, un cartel de calle, un número de casa, ¡cualquier cosa!
                </Text>
            </View>
        </ScrollView>
    );
}

// const styles = StyleSheet.create({
//     container: { //flex-1 items-center justify-center bg-gray-900
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#1f2937', // gray-800
//         padding: 20,
//     },
//     text: { //text-3xl font-bold text-white
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: 'white',
//         textAlign: 'center',
//     },
// });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2c3e50',
    },
    batteryIndicator: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginBottom: 10,
    },
    batteryText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    imageContainer: {
        padding: 20,
    },
    mainImage: {
        width: '100%',
        height: 300,
        borderRadius: 15,
        marginBottom: 15,
    },
    imageInfo: {
        alignItems: 'center',
    },
    imageSource: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
    },
    refreshButton: {
        backgroundColor: '#007acc',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    refreshText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    historyContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 15,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2c3e50',
    },
    historyItem: {
        marginRight: 15,
        alignItems: 'center',
    },
    historyImage: {
        width: 80,
        height: 60,
        borderRadius: 10,
        marginBottom: 8,
    },
    historyLevel: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
    infoContainer: {
        margin: 20,
        padding: 20,
        backgroundColor: '#e8f4f8',
        borderRadius: 15,
    },
    infoText: {
        fontSize: 14,
        color: '#34495e',
        lineHeight: 20,
    },
});
