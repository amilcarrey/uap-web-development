import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import courses from '../../data/cursos.json';
import { loadProgress, clearProgress, saveProgress } from '@/services/storage';

export default function CourseResult() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const course = courses.find((c: any) => c.id === courseId);

  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!courseId) return;
      const p = await loadProgress(String(courseId));
      setProgress(p);
    })();
  }, [courseId]);

  const answers = progress?.answers ?? [];
  const total = course?.questions?.length ?? answers.length;
  const correct = answers.filter((a: any) => a.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const passed = percent >= 70;

  async function handleRetry() {
    if (!courseId) return;
    await clearProgress(String(courseId));
    router.replace(`/cursos/${courseId}`);
  }

  async function handleCertificate() {
    if (!courseId) return;
    const updated = { ...(progress || {}), certifiedAt: Date.now() };
    await saveProgress(String(courseId), updated);
    setProgress(updated);
    // simple feedback
    alert('Certificado emitido (simulado)');
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Text style={styles.percent}>{percent}%</Text>
        <Text style={styles.small}>{passed ? 'Aprobado' : 'No Aprobado'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{course?.title ?? 'Resultado'}</Text>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.stat}>Correctas: {correct}</Text>
          <Text style={styles.stat}>Incorrectas: {answers.length - correct}</Text>
          <Text style={styles.stat}>Total preguntas: {total}</Text>
        </View>

        <Pressable style={styles.primary} onPress={() => router.push('/cursos')}>
          <Text style={styles.primaryText}>Volver a cursos</Text>
        </Pressable>

        {!passed ? (
          <Pressable style={styles.secondary} onPress={handleRetry}>
            <Text style={styles.secondaryText}>Reintentar</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.secondary} onPress={handleCertificate}>
            <Text style={styles.secondaryText}>Obtener certificado</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  badge: { alignItems: 'center', marginBottom: 14 },
  percent: { fontSize: 54, fontWeight: '900', color: '#0f6efb' },
  small: { color: '#64748b', fontWeight: '700' },

  card: { width: '100%', maxWidth: 520, backgroundColor: '#fff', borderRadius: 14, padding: 18, elevation: 4 },
  title: { fontSize: 20, fontWeight: '900', marginBottom: 6 },
  stat: { color: '#475569', marginBottom: 4 },

  primary: { backgroundColor: '#0f6efb', padding: 12, borderRadius: 12, marginTop: 16 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '800' },

  secondary: { borderWidth: 1, borderColor: '#0f6efb', padding: 12, borderRadius: 12, marginTop: 8 },
  secondaryText: { color: '#0f6efb', textAlign: 'center', fontWeight: '800' },
});