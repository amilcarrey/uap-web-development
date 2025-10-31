import { Foto } from "@/components/foto";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { navigate } from "expo-router/build/global-state/routing";
import { useAtom } from "jotai";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { fotosAtom } from "../atom";


export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [fotos, setFotos] = useAtom(fotosAtom)

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso denegado para acceder a la ubicación");
      return null;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    return currentLocation;
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>Necesitamos acceso a la cámara</Text>
        <Button title="Dar permiso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <>
      <CameraView
        style={{ flex: 1 }}
        ref={(ref) => setCameraRef(ref)}
      >
        <Button
          title="Tomar foto"
          onPress={async () => {
            if (cameraRef) {
              const photo = await cameraRef.takePictureAsync();
              const loc = await getLocation();
              if (loc) {
                const foto: Foto = { file: photo.uri, lat: loc.coords.latitude, long: loc.coords.longitude }
                setFotos((prev) => [...prev, foto])
              } else {
                console.log("No se pudo obtener ubicación");
              }
            }
            setTimeout(() => {
              navigate("/pages/FotoList");
            }, 1500)
          }}
        />
      </CameraView>
    </>
  );
}
