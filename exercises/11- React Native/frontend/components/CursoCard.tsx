import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Modal, Platform, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { buildQrPayload } from '@/services/qr';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function CursoCard({ course }: { course: any }) {
  const router = useRouter();
  const [qrVisible, setQrVisible] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);

  function openCourse() {
    router.push(`/cursos/${course.id}`);
  }

  function payload() {
    return buildQrPayload(course.id);
  }

  function qrApiUrl(p: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(p)}`;
  }

  async function shareQrAsImage() {
    const p = payload();
    const remote = qrApiUrl(p);
    try {
      if (Platform.OS === 'web') {
        window.open(remote, '_blank');
        return;
      }
      setLoadingShare(true);
      const fileName = `${p.replace(/[^a-z0-9]/gi, '_')}.png`;
      const baseDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
      if (!baseDir) {
        await Linking.openURL(remote);
        return;
      }
      const localUri = baseDir + fileName;
      const downloaded = await FileSystem.downloadAsync(remote, localUri);
      const uri = downloaded.uri ?? localUri;
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { dialogTitle: course.title });
      } else {
        Alert.alert('Compartir', 'No es posible compartir en este dispositivo. La imagen está en: ' + uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo compartir el QR.');
    } finally {
      setLoadingShare(false);
    }
  }

  return (
    <>
      <View style={styles.card}>
        <Image
          source={
            course.image
              ? // si course.image es URI remota, usar { uri: course.image }; si es path local, fallback al asset require
                course.image.startsWith('http') || course.image.startsWith('data:') || course.image.startsWith('file:')
                ? { uri: course.image }
                : { uri: course.image }
              : require('../assets/images/react-logo.png')
          }
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{course.title}</Text>
          <Text numberOfLines={2} style={styles.desc}>{course.questions?.length ?? 0} lecciones • Reflexión</Text>

          <View style={styles.row}>
            <Pressable style={styles.start} onPress={openCourse}>
              <Text style={styles.startText}>Iniciar</Text>
            </Pressable>

            <Pressable style={styles.qrBtn} onPress={() => setQrVisible(true)}>
              <Text style={styles.qrText}>QR</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal visible={qrVisible} transparent animationType="slide" onRequestClose={() => setQrVisible(false)}>
        <View style={modal.backdrop}>
          <View style={modal.container}>
            <Text style={modal.title}>QR del curso</Text>
            <Image source={{ uri: qrApiUrl(payload()) }} style={{ width: 220, height: 220, marginVertical: 12 }} />
            <Text style={{ color: '#64748b', marginBottom: 12 }}>{payload()}</Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={() => setQrVisible(false)} style={modal.btn}>
                <Text>Cerrar</Text>
              </Pressable>

              <Pressable onPress={async () => { await shareQrAsImage(); setQrVisible(false); }} style={[modal.btn, { backgroundColor: '#0f6efb' }]}>
                <Text style={{ color: '#fff' }}>{loadingShare ? 'Compartiendo...' : 'Compartir imagen'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 12, elevation: 3, alignItems: 'center' },
  image: { width: 88, height: 64, borderRadius: 10, marginRight: 12, backgroundColor: '#eef2ff' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  desc: { color: '#64748b', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  start: { backgroundColor: '#0f6efb', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, marginRight: 8 },
  startText: { color: '#fff', fontWeight: '700' },
  qrBtn: { borderWidth: 1, borderColor: '#c7d2fe', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  qrText: { color: '#0f6efb', fontWeight: '700' },
});

const modal = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: 320, backgroundColor: '#fff', borderRadius: 12, padding: 18, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  btn: { padding: 10, borderRadius: 8, backgroundColor: '#eef2ff', minWidth: 110, alignItems: 'center' },
});