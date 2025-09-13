//src/app/navigation.tsx
// src/app/navigation.tsx
// Navegación mínima por ahora (sin dependencias externas).
// Renderiza la HomeScreen directamente. Si más adelante querés
// usar React Navigation, podés reemplazar este componente por
// un Stack Navigator sin tocar el resto de la app.

import * as React from "react";
import { View, StatusBar } from "react-native";
import HomeScreen from "../features/recordings/screens/HomeScreen";

export default function Navigation() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0C" }}>
      <StatusBar barStyle="light-content" />
      <HomeScreen />
    </View>
  );
}

/*
  Para migrar a React Navigation cuando lo necesites:

  1) Instalar deps:
     npx expo install react-native-screens react-native-safe-area-context
     npm i @react-navigation/native @react-navigation/native-stack

  2) Reemplazar el contenido por algo como:

     import { NavigationContainer } from "@react-navigation/native";
     import { createNativeStackNavigator } from "@react-navigation/native-stack";
     const Stack = createNativeStackNavigator();

     export default function Navigation() {
       return (
         <NavigationContainer>
           <Stack.Navigator screenOptions={{ headerShown: false }}>
             <Stack.Screen name="Home" component={HomeScreen} />
           </Stack.Navigator>
         </NavigationContainer>
       );
     }
*/
