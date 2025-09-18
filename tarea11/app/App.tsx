import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { PhotosProvider } from './context/PhotosContext';
import CameraScreen from './screens/CameraScreen';
import GalleryScreen from './screens/GalleryScreen';
import MapScreen from './screens/MapScreen';
import { colors } from './theme';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Cámara" component={CameraScreen} options={{ tabBarIcon: () => <Text style={{color: colors.primary}}>📷</Text> }} />
      <Tab.Screen name="Galería" component={GalleryScreen} options={{ tabBarIcon: () => <Text style={{color: colors.primary}}>🖼️</Text> }} />
      <Tab.Screen name="Mapa" component={MapScreen} options={{ tabBarIcon: () => <Text style={{color: colors.primary}}>🗺️</Text> }} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PhotosProvider>
      <NavigationContainer theme={{colors: {background: colors.background, card: colors.surface, text: colors.text, border: colors.border, notification: colors.primary, primary: colors.primary}, dark: true}}>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
          <Stack.Screen name="Cámara Lepra" component={Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PhotosProvider>
  );
}
