import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Componente principal de la aplicación de búsqueda de tesoros
 * Configura el navegador principal y el contexto de área segura
 */
export default function App() {
  return (
    <SafeAreaProvider>
      {/* Configurar la barra de estado */}
      <StatusBar style="light" backgroundColor="#2E8B57" />
      
      {/* Navegador principal de la aplicación */}
      <AppNavigator />
    </SafeAreaProvider>
  );
}
