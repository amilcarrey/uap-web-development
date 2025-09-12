// app/tabs/index.tsx
import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import * as Location from "expo-location";
import { Link } from "expo-router";
import { useCameraPermissions } from "expo-camera";

export default function HomeTab() {
  const [loading, setLoading] = useState(true);
  const [camGranted, setCamGranted] = useState<boolean | null>(null);
  const [locGranted, setLocGranted] = useState<boolean | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const requestAllPermissions = async () => {
    try {
      setLoading(true);

      // Cámara
      let camStatus = cameraPermission?.status;
      if (!cameraPermission?.granted) {
        const response = await requestCameraPermission();
        camStatus = response.status;
      }
      setCamGranted(camStatus === "granted");

      // Ubicación (foreground)
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      const ok = locStatus === "granted";
      setLocGranted(ok);

      if (ok) {
        const pos = await Location.getCurrentPositionAsync({});
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      } else {
        setCoords(null);
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudieron solicitar permisos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestAllPermissions();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
        <ActivityIndicator />
        <Text>Solicitando permisos…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Permisos</Text>
      <Text>📷 Cámara: {camGranted === null ? "—" : camGranted ? "concedido ✅" : "denegado ❌"}</Text>
      <Text>📍 Ubicación: {locGranted === null ? "—" : locGranted ? "concedido ✅" : "denegado ❌"}</Text>
      {coords && <Text>Lat: {coords.lat.toFixed(6)} | Lon: {coords.lon.toFixed(6)}</Text>}

      <Button title="Reintentar permisos" onPress={requestAllPermissions} />

      {/* Ejemplo de navegación a una pantalla de cámara real (opcional) */}
      <Link href="/camera" asChild>
        <Button title="Ir a la cámara" />
      </Link>
    </View>
  );
}
