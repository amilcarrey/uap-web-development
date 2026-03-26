import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform, StatusBar } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

function RootContent() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const minHorizontal = 12;
  const maxContentWidth = 720;
  const isLarge = width >= maxContentWidth;
  const calculated = isLarge ? Math.max((width - maxContentWidth) / 2, minHorizontal) : minHorizontal;
  // nunca permitir padding mayor que 8% del ancho del dispositivo (evita márgenes grandes en móviles)
  const horizontalPadding = Math.min(calculated, Math.floor(width * 0.08));

  const topPadding = insets.top + (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 8) : 8);
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <View
        style={[
          styles.container,
          {
            paddingTop: topPadding,
            paddingBottom: bottomPadding,
            paddingHorizontal: horizontalPadding,
            maxWidth: isLarge ? maxContentWidth : '100%',
            width: '100%',
          },
        ]}
      >
        <Slot />
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <RootContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});