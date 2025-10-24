/**
 * EmptyState Component
 *
 * Reusable component for displaying empty states with icon, title, and description.
 * Used throughout the app when students have no trainer, no workouts, etc.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../styles/theme';

export type IconName = keyof typeof Ionicons.glyphMap;

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
  iconColor?: string;
  style?: ViewStyle;
}

export default function EmptyState({
  icon,
  title,
  description,
  iconColor = Theme.colors.textTertiary,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
});
