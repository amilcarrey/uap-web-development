import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions, Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // responsive padding for page content (invisible border)
  const minSafe = 8;
  const horizontalMarginMobile = 12;
  const maxContentWidth = 720;
  const isLarge = width >= maxContentWidth;
  const calculated = isLarge ? Math.max((width - maxContentWidth) / 2, horizontalMarginMobile) : horizontalMarginMobile;
  const horizontalPadding = Math.min(calculated, Math.floor(width * 0.08));

  const bottomInset = Math.max(insets.bottom, minSafe);
  const tabBarHeight = 56 + bottomInset;

  // icon sizing responsive
  const baseIconSize = Math.round(Math.min(34, Math.max(18, width * 0.06)));
  const activeScale = 1.12;

  const tint = Colors[colorScheme ?? 'light'].tint;
  const inactive = Colors[colorScheme ?? 'light'].icon ?? '#777';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: Platform.OS === 'android' ? 6 : 8,
          borderTopWidth: 0.5,
          width: '100%',
        },
        tabBarLabelStyle: { fontSize: 12 },
        // sceneContainerStyle aplica el padding SOLO al contenido de las pantallas,
        // no al TabBar, creando el "borde invisible" seguro para notch/márgenes.
        // Removed sceneContainerStyle because it is not a valid property for BottomTabNavigationOptions.
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }: any) => (
            <IconSymbol
              size={focused ? Math.round(baseIconSize * activeScale) : baseIconSize}
              name={focused ? 'house.fill' : 'house'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cursos"
        options={{
          title: 'Cursos',
          tabBarIcon: ({ color, focused }: any) => (
            <IconSymbol
              size={focused ? Math.round(baseIconSize * activeScale) : baseIconSize}
              name={focused ? 'book.closed.fill' : 'book.closed'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}