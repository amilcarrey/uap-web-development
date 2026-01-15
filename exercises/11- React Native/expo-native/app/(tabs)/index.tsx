import React, {useEffect, useState } from "react";

import * as Battery from 'expo-battery';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from "react-native";


const UNSPLASH_ACCESS_KEY = '_R-omWural-GhuDh7-v0dBHbNs7kXhOZ3cZTR6M09R0';
const PIXABAY_API_KEY = '52360273-09ac75c0ffad8d47e90d2841f';

const GOOGLE_API_KEY = 'AIzaSyCj8KMAvcuHPdIgryUIr98LE11k3cMpZ-c';
const SEARCH_ENGINE_ID = '05ec0f3b68b4e4f59';

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

    const [manualLevel, setManualLevel] = useState<string>('');
    const [isManualMode, setIsManualMode] = useState<boolean>(false);

    useEffect(() => {
        const fetchBatteryLevel = async () => {
            const level = await Battery.getBatteryLevelAsync();
            setBatteryLevel(Math.round(level * 100));
            fetchImageForBattery(Math.round(level * 100));
        }

        fetchBatteryLevel();

        // Suscripcion a cambios en el nivel de bateria
        const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(Math.round(batteryLevel * 100));
            fetchImageForBattery(Math.round(batteryLevel * 100));
        });

        return () => subscription.remove();
    }, []);

    const generateSearchTerms = (number: number) => {
        return [
            // Queries súper específicas que garantizan números VISIBLES
            `"number ${number}" visible display shirt jersey uniform`,
            `"${number}" large number sports jersey basketball football`,
            `"#${number}" printed shirt uniform sports player`,
            `"${number}" displayed door house address street visible`,
            `"${number}" big number sign billboard display board`,
            
            // Queries de contexto visual específico
            `jersey with number ${number} printed visible sports`,
            `uniform showing number ${number} player sports`,
            `sign displaying number ${number} street house door`,
            `car racing number ${number} visible motorsport`,
            `player wearing number ${number} jersey shirt uniform`,
            
            // Queries que evitan contenido textual
            `"${number}" -text -article -news -blog visible number`,
            `"${number}" jersey uniform -wikipedia -stats -biography`,
            `"${number}" sports shirt -roster -team -lineup visible`,
            
            // Contextos específicos por número
            ...(number <= 99 && number >= 0 ? [`"${number}" two digit number display`] : []),
            ...(number <= 9 ? [`"${number}" single digit number large display`] : []),
            ...(number >= 10 ? [`"${number}" double digit sports jersey`] : []),
        ];
    };

    const generateGoogleSearchTerms = (number: number): string[] => {
        return [
            // Términos muy específicos para Google
            `"number ${number}" jersey sports`,
            `"${number}" football soccer uniform`,
            `"${number}" basketball shirt player`,
            `"#${number}" sports jersey`,
            `"player ${number}" uniform shirt`,
            
            // Señalización específica
            `"${number}" street address house door`,
            `"route ${number}" bus train transport`,
            `"${number}" sign billboard display`,
            
            // Racing y motorsport
            `"car ${number}" racing formula motorsport`,
            `"${number}" race car driver`,
            
            // Contexto específico por rango
            ...(number <= 10 ? [`"${number}" famous player legend`] : []),
            ...(number >= 23 && number <= 24 ? [`"${number}" jordan basketball`] : []),
            ...(number === 7 || number === 10 ? [`"${number}" ronaldo messi football`] : []),
        ];
    };

    const searchUnsplash = async (query: string): Promise<ImageResult[]> => {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=5`);

        const data = await response.json();

        if (!response.ok) {
            console.error('Unsplash API error:', data);
            return [];
        }

        if (!data.results || data.results.length === 0) {
            return [];
        }

        return data.results.map((item: any) => ({
            url: item.urls.regular,
            thumbnail: item.urls.thumb,
            alt: item.alt_description || 'Image from Unsplash',
            source: 'Unsplash',
        }));
    }

    const generateFallbackImage = (number: number): ImageResult => {

        const templates = [
            // Estilo jersey deportivo
            {
                bg: '1e3c72',
                text: 'ffffff',
                url: `https://dummyimage.com/400x300/1e3c72/ffffff.png&text=%23${number}%0AJERSEY`,
                style: 'Sports Jersey'
            },
            // Estilo señal de calle
            {
                bg: '27ae60',
                text: '000000',
                url: `https://dummyimage.com/400x300/27ae60/000000.png&text=STREET%0A${number}`,
                style: 'Street Sign'
            },
            // Estilo bus/transporte
            {
                bg: 'e74c3c',
                text: 'ffffff',
                url: `https://dummyimage.com/400x300/e74c3c/ffffff.png&text=ROUTE%0A${number}`,
                style: 'Transport'
            },
            // Estilo racing
            {
                bg: '000000',
                text: 'ffffff',
                url: `https://dummyimage.com/400x300/000000/ffffff.png&text=%23${number}%0ARACING`,
                style: 'Racing Car'
            },
            // Estilo casa/puerta
            {
                bg: '8e44ad',
                text: 'ffffff',
                url: `https://dummyimage.com/400x300/8e44ad/ffffff.png&text=HOUSE%0A${number}`,
                style: 'House Number'
            }
        ];
        
        const selected = templates[number % templates.length];
        
        return {
            url: selected.url,
            thumbnail: selected.url.replace('400x300', '200x150'),
            alt: `Generated ${selected.style} #${number}`,
            source: `Generated (${selected.style})`
        };
    };

    const searchPixabay = async (query: string): Promise<ImageResult[]> => {
        try {
            const response = await fetch(
                `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&min_width=400&per_page=5`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.hits?.map((item: any) => ({
                url: item.webformatURL,
                thumbnail: item.previewURL,
                alt: item.tags,
                source: 'Pixabay'
            })) || [];
        } catch (error) {
            console.error('Error searching Pixabay:', error);
            return [];
        }
    };

    const detectTextInImage = async (imageUrl: string, targetNumber: number): Promise<boolean> => {
        try {
            console.log(`🔍 Analizando imagen para número ${targetNumber}...`);
            
            const response = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requests: [
                            {
                                image: {
                                    source: {
                                        imageUri: imageUrl
                                    }
                                },
                                features: [
                                    {
                                        type: 'TEXT_DETECTION',
                                        maxResults: 10
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

            const data = await response.json();

            console.log('🤖 Google Vision response:', data);
            
            if (data.responses && data.responses[0].textAnnotations) {
                const detectedTexts: any[] = data.responses[0].textAnnotations;
                console.log(`📝 Textos detectados:`, detectedTexts.map(t => t.description));
                
                // Buscar el número específico en los textos detectados
                const numberStr = targetNumber.toString();
                const hasNumber = detectedTexts.some(text => 
                    text.description.includes(numberStr) ||
                    text.description === numberStr
                );
                
                console.log(`🎯 ¿Contiene el número ${targetNumber}? ${hasNumber ? '✅' : '❌'}`);
                return hasNumber;
            }
            
            return false;
        } catch (error) {
            console.error('Error en Google Vision:', error);
            return false; // Si falla la IA, acepta la imagen (fallback)
        }
    };

        // Nueva función para búsqueda con Google
    const searchGoogleImages = async (query: string, number: number): Promise<ImageResult[]> => {
        try {
            console.log(`🔍 Buscando en Google: ${query}`);

            const baseURL = 'https://www.googleapis.com/customsearch/v1';
            const params = new URLSearchParams({
                key: GOOGLE_API_KEY,
                cx: SEARCH_ENGINE_ID,
                q: query,
                searchType: 'image',
                num: '1',
                imgSize: 'MEDIUM',
                safe: 'medium'
            })

            const fullURL = `${baseURL}?${params.toString()}`;
            console.log('🌐 Google API URL:', fullURL);

            const response = await fetch(fullURL);

            if (!response.ok) {
                const errorData = await response.text();
                console.error(`Google API error ${response.status}:`, errorData);
                throw new Error(`Google API error ${response.status}: ${errorData}`);
            }
            
            const data = await response.json();
            console.log('📊 Google API response data:', data);
            
            if (!data.items || data.items.length === 0) {
                console.warn('No results found in Google API response');
                return [];
            }
            
            console.log(`✅ Found ${data.items.length} items from Google API`);
            
            return data.items.map((item: any) => ({
                url: item.link,
                thumbnail: item.image?.thumbnailLink || item.link,
                alt: item.title || `Image with number ${number}`,
                source: 'Google Search'
            }));
            
        } catch (error) {
            console.error('Google search error:', error);
            return [];
        }
    };

    const fetchImageForBattery = async (level: number) => {
        setLoading(true);
        try {
            
            let foundImage: ImageResult | null = null;
            let validatedImage: ImageResult | null = null;

            const googleTerms = generateGoogleSearchTerms(level);

            // Seleccionar términos de manera aleatoria
            const shuffledTerms = [...googleTerms].sort(() => Math.random() - 0.5);
            for (let i = 0; i < Math.min(5, googleTerms.length); i++) {
                // Generar número aleatorio para seleccionar término
                const randomIndex = Math.floor(Math.random() * googleTerms.length);
                const term = shuffledTerms[randomIndex];
                
                try {
                    console.log(`🔍 Google: Probando "${term}"`);
                    const googleResults = await searchGoogleImages(term, level);
                    
                    if (googleResults.length > 0) {
                        // 🤖 VALIDAR CON IA cada resultado
                        for (const image of googleResults.slice(0, 3)) { // Solo validar las primeras 3
                            console.log(`🤖 Validando imagen con IA: ${image.url.substring(0, 50)}...`);
                            
                            const hasTargetNumber = await detectTextInImage(image.url, level);
                            
                            if (hasTargetNumber) {
                                validatedImage = {
                                    ...image,
                                    alt: `✅ IA Validada: ${image.alt}`,
                                    source: `${image.source} (IA Verified)`
                                };
                                console.log(`🎯 ✅ Imagen validada por IA!`);
                                break;
                            } else {
                                console.log(`🎯 ❌ IA no encontró el número ${level} en esta imagen`);
                            }
                        }
                        
                        if (validatedImage) {
                            foundImage = validatedImage;
                            break;
                        }
                        
                        // Si no se validó ninguna, usar la primera como fallback
                        if (!foundImage) {
                            foundImage = {
                                ...googleResults[0],
                                alt: `⚠️ No validada: ${googleResults[0].alt}`,
                                source: `${googleResults[0].source} (Not AI Verified)`
                            };
                        }
                    }
                } catch (error) {
                    console.error(`❌ Error con término "${term}":`, error);
                    continue;
                }
            }
            

            // 🥈 SEGUNDA OPCIÓN: Pixabay con validación (si Google no encontró imagen validada)
            if (!validatedImage) {
                console.log(`🔄 Probando Pixabay con validación IA...`);
                const pixabayTerms = generateSearchTerms(level);
                
                for (const term of pixabayTerms.slice(0, 3)) {
                    try {
                        const pixabayResults = await searchPixabay(term);
                        
                        if (pixabayResults.length > 0) {
                            for (const image of pixabayResults.slice(0, 5)) {
                                const hasTargetNumber = await detectTextInImage(image.url, level);
                                
                                if (hasTargetNumber) {
                                    foundImage = {
                                        ...image,
                                        alt: `✅ IA Validada: ${image.alt}`,
                                        source: `${image.source} (IA Verified)`
                                    };
                                    break;
                                }
                            }
                            
                            if (foundImage && foundImage.source.includes('IA Verified')) break;
                            
                            // Fallback sin validación
                            if (!foundImage) {
                                foundImage = {
                                    ...pixabayResults[0],
                                    alt: `⚠️ No validada: ${pixabayResults[0].alt}`,
                                    source: `${pixabayResults[0].source} (Not AI Verified)`
                                };
                            }
                        }
                    } catch (error) {
                        console.error(`❌ Error en Pixabay: "${term}"`);
                        continue;
                    }
                }
            }

            // 🥈 TERCERA OPCIÓN: Unsplash con validación (si Google no encontró imagen validada)
            if (!validatedImage) {
                console.log(`🔄 Probando Unsplash con validación IA...`);
                const unsplashTerms = generateSearchTerms(level);
                
                for (const term of unsplashTerms.slice(0, 3)) {
                    try {
                        const unsplashResults = await searchUnsplash(term);

                        if (unsplashResults.length > 0) {
                            for (const image of unsplashResults.slice(0, 5)) {
                                const hasTargetNumber = await detectTextInImage(image.url, level);
                                
                                if (hasTargetNumber) {
                                    foundImage = {
                                        ...image,
                                        alt: `✅ IA Validada: ${image.alt}`,
                                        source: `${image.source} (IA Verified)`
                                    };
                                    break;
                                }
                            }
                            
                            if (foundImage && foundImage.source.includes('IA Verified')) break;
                            
                            // Fallback sin validación
                            if (!foundImage) {
                                foundImage = {
                                    ...unsplashResults[0],
                                    alt: `⚠️ No validada: ${unsplashResults[0].alt}`,
                                    source: `${unsplashResults[0].source} (Not AI Verified)`
                                };
                            }
                        }
                    } catch (error) {
                        console.error(`❌ Error en Unsplash: "${term}"`);
                        continue;
                    }
                }
            }

            // Si no encontramos nada, usar imagen generada
            if (!foundImage || !validatedImage) {
                    foundImage = generateFallbackImage(level);
                }

                setCurrentImage(foundImage);
                
                // Agregar al historial
                setImageHistory(prev => {
                const filtered = prev.filter(item => item.level !== level);
                return [
                    { level, image: foundImage! },
                    ...filtered.slice(0, 3)
                ];
            });

        } catch (error) {
            console.error('Error fetching image:', error);
            setCurrentImage(generateFallbackImage(level));
        } finally {
            setLoading(false);
        }
    };

    const refreshImage = () => {
        if (batteryLevel !== null && !loading) {
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

    const searchManualNumber = () => {
        const num = parseInt(manualLevel, 10);
        if (!isNaN(num) && num >= 0 && num <= 100) {
            fetchImageForBattery(num);
            setManualLevel('');
        } else {
            Alert.alert('Error', 'Por favor ingresa un número válido entre 0 y 100.', [{ text: 'OK' }]);
        }
    }

    const toggleMode = () => {
        setIsManualMode(!isManualMode);
        if (isManualMode) {
            // Si estamos desactivando el modo manual, refrescar con el nivel real de batería
            if (batteryLevel !== null) {
                fetchImageForBattery(batteryLevel);
            }
            setManualLevel('');
        }
    }



    return (
        <ScrollView style={styles.container}>
            {/* Header con información de batería */}
            <View style={styles.header}>
                <Text style={styles.title}>📱 Batería en Números</Text>
                
                {/* ✅ Botón para alternar modo */}
                <TouchableOpacity 
                    style={[styles.modeToggle, { backgroundColor: isManualMode ? '#e74c3c' : '#27ae60' }]}
                    onPress={toggleMode}
                >
                    <Text style={styles.modeToggleText}>
                        {isManualMode ? '🔧 Modo Testing' : '🔋 Modo Automático'}
                    </Text>
                </TouchableOpacity>

                {/* ✅ Input para modo manual */}
                {isManualMode ? (
                    <View style={styles.manualContainer}>
                        <Text style={styles.manualLabel}>🎯 Número a buscar:</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.numberInput}
                                value={manualLevel}
                                onChangeText={setManualLevel}
                                placeholder="Ej: 42"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={3}
                            />
                            <TouchableOpacity 
                                style={styles.searchButton}
                                onPress={searchManualNumber}
                            >
                                <Text style={styles.searchButtonText}>🔍 Buscar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    // Mostrar nivel de batería real en modo automático
                    <View style={[styles.batteryIndicator, { backgroundColor: getBatteryColor() }]}>
                        <Text style={styles.batteryText}>
                            🔋 {batteryLevel !== null ? `${batteryLevel}%` : "Cargando..."}
                        </Text>
                    </View>
                )}
            </View>

            {/* ✅ Mostrar qué número se está buscando */}
            {(isManualMode && manualLevel) || (!isManualMode && batteryLevel) ? (
                <View style={styles.searchInfo}>
                    <Text style={styles.searchInfoText}>
                        🎯 Buscando imágenes con el número:{' '}
                        <Text style={styles.searchNumber}>
                            {isManualMode ? manualLevel : batteryLevel}
                        </Text>
                    </Text>
                </View>
            ) : null}

            {/* Imagen principal */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007acc" />
                    <Text style={styles.loadingText}>
                        🔍 Buscando imagen con el número {isManualMode ? manualLevel : batteryLevel}...
                    </Text>
                    <Text style={styles.loadingSubtext}>
                        Explorando camisetas, carteles, señales... 📸
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

                        {/* Badge de validación IA */}
                        <View style={[
                            styles.aiValidationBadge, 
                            currentImage.source.includes('IA Verified') 
                                ? styles.aiValidatedBadge 
                                : styles.aiNotValidatedBadge
                        ]}>
                            <Text style={styles.aiBadgeText}>
                                {currentImage.source.includes('IA Verified') ? '🤖✅' : '⚠️'}
                            </Text>
                            <Text style={styles.aiBadgeText}>
                                {currentImage.source.includes('IA Verified') ? 'IA' : 'No IA'}
                            </Text>
                        </View>
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

            {/* ✅ Botones rápidos para testing */}
            {isManualMode && (
                <View style={styles.quickTestContainer}>
                    <Text style={styles.quickTestTitle}>⚡ Pruebas Rápidas:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {[7, 10, 23, 42, 69, 88, 99].map(num => (
                            <TouchableOpacity 
                                key={num}
                                style={styles.quickTestButton}
                                onPress={() => {
                                    setManualLevel(num.toString());
                                    fetchImageForBattery(num);
                                }}
                            >
                                <Text style={styles.quickTestButtonText}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

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
                    {'\n'}🤖 Utiliza IA para verificar que la imagen realmente contenga el número.
                    {'\n'}🎨 Si no encuentra nada adecuado, genera una imagen simple con el número.
                    {'\n\n'}🔄 Esta en version prueba, asi que se puede elegir el numero que quieras.
                </Text>
            </View>
        </ScrollView>
    );
}



// -------------- STYLES --------------

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
    loadingSubtext: {
        marginTop: 5,
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    imageContainer: {
        padding: 20,
    },
    mainImage: {
        width: '100%',
        height: 250,
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
    modeToggle: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginBottom: 15,
    },
    modeToggleText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    manualContainer: {
        width: '100%',
        alignItems: 'center',
    },
    manualLabel: {
        fontSize: 16,
        color: '#2c3e50',
        marginBottom: 10,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    numberInput: {
        borderWidth: 2,
        borderColor: '#3498db',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 100,
        backgroundColor: 'white',
    },
    searchButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 15,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchInfo: {
        margin: 15,
        padding: 15,
        backgroundColor: '#fff3cd',
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    searchInfoText: {
        fontSize: 16,
        color: '#856404',
        textAlign: 'center',
    },
    searchNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d39e00',
    },
    quickTestContainer: {
        margin: 20,
        padding: 15,
        backgroundColor: '#e8f4f8',
        borderRadius: 15,
    },
    quickTestTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
    },
    quickTestButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        minWidth: 50,
        alignItems: 'center',
    },
    quickTestButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    aiValidationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    aiValidatedBadge: {
        backgroundColor: '#27ae60',
    },
    aiNotValidatedBadge: {
        backgroundColor: '#f39c12',
    },
    aiBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 2,
    },
});
