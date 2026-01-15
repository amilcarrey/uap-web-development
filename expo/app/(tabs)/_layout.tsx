
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="pelotasaltarina" // Aca le decimos que pestaña queremos que se muestre al inicio tiene que ser igual al nombre de la pestaña
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      
      <Tabs.Screen
        name="pelotasaltarina" // Nombre de la pestaña
        options={{
          title: 'pelotasaltarina', // Titulo de la pestaña esa que esta en la parte de abajo
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="circle.grid.2x2.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
