import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export const TopBar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
