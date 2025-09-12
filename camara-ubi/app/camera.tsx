// app/camera.tsx
import { useEffect, useRef, useState } from "react";
import { View, Text, Button, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const camRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
        <Text>Se necesita permiso de cámara.</Text>
        <Button title="Conceder permiso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} ref={camRef} facing="back" />
      <View style={{ padding: 12, gap: 8 }}>
        <Button
          title="Sacar foto"
          onPress={async () => {
            const photo = await camRef.current?.takePictureAsync();
            if (photo?.uri) setPhotoUri(photo.uri);
          }}
        />
        {photoUri && (
          <>
            <Text>Foto tomada:</Text>
            <Image source={{ uri: photoUri }} style={{ width: 160, height: 160, borderRadius: 8 }} />
          </>
        )}
      </View>
    </View>
  );
}
