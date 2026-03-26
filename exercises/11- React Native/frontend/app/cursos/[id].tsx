import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import cursos from '../../data/cursos.json';
import { loadProgress, saveProgress, clearProgress } from '@/services/storage';

export default function CoursePlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const curso = cursos.find((c: any) => c.id === id);

  const [index, setIndex] = useState<number>(0);
  const [selected, setSelected] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }
      const p = await loadProgress(String(id));
      if (p) {
        setProgress(p);
        setIndex(typeof p.currentIndex === 'number' ? p.currentIndex : 0);
      } else {
        const init = { status: 'in-progress', currentIndex: 0, answers: [], startedAt: Date.now() };
        await saveProgress(String(id), init);
        setProgress(init);
        setIndex(0);
      }
      setLoading(false);
    })();
  }, [id]);

  // Redirect to result if already completed
  useEffect(() => {
    if (!loading && progress?.status === 'completed' && id) {
      router.replace(`/cursos/resultado?courseId=${id}`);
    }
  }, [loading, progress, id, router]);

  // If index is out of range, mark completed and redirect
  useEffect(() => {
    const total = curso?.questions?.length ?? 0;
    if (!loading && curso && total > 0 && index >= total && id) {
      (async () => {
        const updated = { ...(progress || {}), status: 'completed', completedAt: Date.now(), currentIndex: total };
        await saveProgress(String(id), updated);
        router.replace(`/cursos/resultado?courseId=${id}`);
      })();
    }
  }, [loading, curso, index, progress, id, router]);

  if (loading) return <Text style={{ padding: 16 }}>Cargando...</Text>;
  if (!curso) return <Text style={{ padding: 16 }}>Curso no encontrado</Text>;

  const total = curso.questions?.length ?? 0;
  if (total === 0) return <Text style={{ padding: 16 }}>Este curso no contiene preguntas aún.</Text>;

  // Ensure index is within bounds
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, total - 1));
  const q = curso.questions[safeIndex];

  if (!q) return <Text style={{ padding: 16 }}>No hay pregunta disponible.</Text>;

  async function handleContinue() {
    if (!q || !selected) return;
    try {
      const wasCorrect = !!selected.correct;
      const answers = [...(progress?.answers || []), { qId: q.id, choiceId: selected.id, correct: wasCorrect }];
      const next = safeIndex + 1;
      const nowCompleted = next >= total;
      const updated = {
        ...(progress || {}),
        currentIndex: next,
        answers,
        status: nowCompleted ? 'completed' : 'in-progress',
        completedAt: nowCompleted ? Date.now() : progress?.completedAt,
      };
      await saveProgress(String(id), updated);
      setProgress(updated);
      setSelected(null);
      if (nowCompleted) router.replace(`/cursos/resultado?courseId=${id}`);
      else setIndex(next);
    } catch (err) {
      console.error('handleContinue error', err);
      Alert.alert('Error', 'No fue posible guardar la respuesta.');
    }
  }

  async function reset() {
    await clearProgress(String(id));
    const init = { status: 'in-progress', currentIndex: 0, answers: [], startedAt: Date.now() };
    await saveProgress(String(id), init);
    setProgress(init);
    setIndex(0);
    setSelected(null);
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.courseTitle}>{curso.title}</Text>
        <Text style={styles.progress}>{safeIndex + 1}/{total}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.verseBadge}><Text style={styles.verseText}>{q.verse}</Text></View>
        <Text style={styles.question}>{q.text}</Text>

        <View style={{ marginTop: 14 }}>
          {(q.choices ?? []).map((ch: any, idx: number) => {
            const key = ch?.id ?? `choice-${idx}`;
            const isSelected = selected?.id === ch?.id;
            return (
              <Pressable key={key} style={[styles.choice, isSelected && styles.choiceActive]} onPress={() => setSelected(ch)}>
                <Text style={[styles.choiceText, isSelected && { color: '#042c6d', fontWeight: '800' }]}>{ch?.text ?? '—'}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected ? (
          <View style={styles.reflection}>
            <Text style={styles.reflectionTitle}>{selected.correct ? 'Reflexión (Correcto)' : 'Reflexión'}</Text>
            <Text style={styles.reflectionText}>{selected.reflection ?? 'Sin reflexión disponible.'}</Text>

            <Pressable style={styles.next} onPress={handleContinue}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{safeIndex + 1 >= total ? 'Terminar' : 'Continuar'}</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.hint} onPress={() => {}}>
            <Text style={{ color: '#65748b' }}>Selecciona una opción para ver la reflexión</Text>
          </Pressable>
        )}

        <Pressable style={styles.reset} onPress={reset}>
          <Text style={{ color: '#0f6efb' }}>Reiniciar progreso</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, marginBottom: 10 },
  courseTitle: { fontSize: 20, fontWeight: '800' },
  progress: { color: '#64748b', fontWeight: '700' },

  card: { backgroundColor: '#fff', marginHorizontal: 8, borderRadius: 14, padding: 16, elevation: 3 },
  verseBadge: { backgroundColor: '#eef2ff', paddingVertical: 6, paddingHorizontal: 10, alignSelf: 'flex-start', borderRadius: 8, marginBottom: 10 },
  verseText: { color: '#0f6efb', fontWeight: '700' },
  question: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  choice: { padding: 12, backgroundColor: '#f8fafc', borderRadius: 10, marginBottom: 8 },
  choiceActive: { backgroundColor: '#dbeafe' },
  choiceText: { color: '#0f172a' },

  reflection: { marginTop: 12, backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e6eefc' },
  reflectionTitle: { fontWeight: '800', marginBottom: 6 },
  reflectionText: { color: '#475569', marginBottom: 10 },

  next: { backgroundColor: '#0f6efb', padding: 12, borderRadius: 12, alignItems: 'center' },
  hint: { marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: '#fafafa', alignItems: 'center' },

  reset: { marginTop: 10, alignSelf: 'center' },
});