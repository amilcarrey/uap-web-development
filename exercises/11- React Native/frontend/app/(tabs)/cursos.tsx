import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import courses from '../../data/cursos.json';
import CursoCard from '@/components/CursoCard';
import { useRouter } from 'expo-router';

export default function CursosList() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      <Text style={styles.header}>Cursos</Text>
      <Text style={styles.sub}>Selecciona un curso para comenzar</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => <CursoCard course={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingVertical: 8 },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  sub: { color: '#6b7280', marginBottom: 12 },
});