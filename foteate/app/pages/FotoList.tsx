import FotosList from "@/components/foto";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <Text style={styles.title}>Galeria</Text>
      <FotosList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 60, // Added padding for status bar and title
  },
  title: {
    fontSize: 32, // Slightly smaller for better proportion
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
    paddingHorizontal: 20, // Added horizontal padding
    textAlign: "left", // Align to left for better readability
  },
});