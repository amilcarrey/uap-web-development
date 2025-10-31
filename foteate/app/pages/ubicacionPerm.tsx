import * as Location from "expo-location";
import { useState } from "react";
import { Button, Text, View } from "react-native";

export default function LocationScreen() {
  const [location, setLocation] = useState<any>(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso denegado para acceder a la ubicación");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
  };

  return (
    <View>
      <Button title="Obtener ubicación" onPress={getLocation} />
      {location && (
        <Text>
          Lat: {location.coords.latitude}, Lng: {location.coords.longitude}
        </Text>
      )}
    </View>
  );
}
