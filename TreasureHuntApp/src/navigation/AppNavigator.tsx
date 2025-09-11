import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../screens/MapScreen';
import InventoryScreen from '../screens/InventoryScreen';

/**
 * Definición de tipos para los parámetros de navegación
 */
export type RootStackParamList = {
  Map: undefined;
  Inventory: undefined;
};

// Crear el stack navigator
const Stack = createStackNavigator<RootStackParamList>();

/**
 * Componente principal de navegación de la aplicación
 * Maneja la navegación entre la pantalla del mapa y el inventario
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2E8B57', // Verde mar para el tema de tesoros
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        {/* Pantalla principal del mapa */}
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: '🗺️ Mapa de Tesoros',
            headerTitleAlign: 'center',
          }}
        />
        
        {/* Pantalla del inventario */}
        <Stack.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            title: '🎒 Mi Inventario',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;