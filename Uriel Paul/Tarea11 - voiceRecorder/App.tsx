import * as React from "react";
import { View, StatusBar } from "react-native";
import Navigation from "./src/app/navigation";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0C" }}>
      <StatusBar barStyle="light-content" />
      <Navigation />
    </View>
  );
}
