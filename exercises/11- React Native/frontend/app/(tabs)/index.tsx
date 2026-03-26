import React from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Scanner from '@/components/Scanner';

export default function TabIndexScreen() {
  const router = useRouter();
  const [scannerVisible, setScannerVisible] = React.useState(false);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.hero}>
        <Image source={require('../../assets/images/partial-react-logo.png')} style={styles.heroImage} />
        <Text style={styles.title}>Estudios Bíblicos Interactivos</Text>
        <Text style={styles.subtitle}>Reflexiona, responde y crece cada día.</Text>

        <View style={styles.actions}>
          <Pressable style={styles.primary} onPress={() => router.push('/cursos')}>
            <Text style={styles.primaryText}>Ver Cursos</Text>
          </Pressable>

          <Pressable style={styles.ghost} onPress={() => setScannerVisible(true)}>
            <Text style={styles.ghostText}>Escanear QR</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Destacado</Text>
        <Pressable style={styles.previewCard} onPress={() => router.push('/cursos/curso-1')}>
          <Image source={require('../../assets/images/react-logo.png')} style={styles.previewImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.previewCardTitle}>Amor y Perdón</Text>
            <Text style={styles.previewCardDesc}>Tres reflexiones cortas con preguntas para meditar.</Text>
          </View>
        </Pressable>
      </View>

      <Scanner visible={scannerVisible} onScanned={(id) => { setScannerVisible(false); router.push(`/cursos/${id}`); }} onCancel={() => setScannerVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, alignItems: 'stretch', gap: 18 },
  hero: { backgroundColor: '#f6f9ff', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 4 },
  heroImage: { width: 96, height: 96, marginBottom: 12, opacity: 0.95 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6, color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  primary: { backgroundColor: '#0f6efb', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  primaryText: { color: '#fff', fontWeight: '700' },
  ghost: { borderWidth: 1, borderColor: '#0f6efb', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  ghostText: { color: '#0f6efb', fontWeight: '700' },

  preview: { marginTop: 8 },
  previewTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  previewCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', elevation: 2 },
  previewImage: { width: 72, height: 56, borderRadius: 8, marginRight: 12 },
  previewCardTitle: { fontSize: 16, fontWeight: '800' },
  previewCardDesc: { fontSize: 13, color: '#6b7280' },
});