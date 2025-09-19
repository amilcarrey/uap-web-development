import React, {useEffect, useState } from "react";

import * as Battery from 'expo-battery';
import { View, Text } from "react-native";

export default function App() {
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

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

    return (
    <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-3xl font-bold text-white">
            🔋 Batería: {batteryLevel !== null ? `${batteryLevel}%` : "Cargando..."}
        </Text>
    </View>
    );
}