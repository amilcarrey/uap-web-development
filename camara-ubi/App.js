import { Camera } from 'expo-camera';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const locationStatus = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(locationStatus.status === 'granted');
        })();
    }, []);

    const takePhotoAndGetLocation = async () => {
        if (cameraRef.current && cameraReady) {
            const photoData = await cameraRef.current.takePictureAsync();
            setPhoto(photoData.uri);
            try {
                const locationData = await Location.getCurrentPositionAsync({});
                setLocation(locationData.coords);
            } catch (error) {
                setLocation(null);
            }
        }
    };

    if (hasCameraPermission === null || hasLocationPermission === null) {
        return <View style={styles.center}><Text>Solicitando permisos...</Text></View>;
    }
    if (!hasCameraPermission) {
        return <View style={styles.center}><Text>Permiso de cámara denegado</Text></View>;
    }
    if (!hasLocationPermission) {
        return <View style={styles.center}><Text>Permiso de ubicación denegado</Text></View>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Camera
                style={{ flex: 2 }}
                ref={cameraRef}
                onCameraReady={() => setCameraReady(true)}
            />
            <View style={styles.center}>
                <Button title="Tomar foto y obtener ubicación" onPress={takePhotoAndGetLocation} />
                {photo && (
                    <Image source={{ uri: photo }} style={{ width: 200, height: 200, marginTop: 10 }} />
                )}
                {location && (
                    <Text style={{ marginTop: 10 }}>
                        Ubicación: Lat {location.latitude}, Lon {location.longitude}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});