/**
 * DayCard Component
 *
 * Reusable card for displaying workout day information
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WorkoutDay } from '../types/api.types';
import { DayOfWeekLabels } from '../types/api.types';
import { Theme } from '../styles/theme';

interface DayCardProps {
  day: WorkoutDay;
  onPress?: () => void;
  onDelete?: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, onPress, onDelete }) => {
  const exerciseCount = day.exercises?.length || 0;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.dayInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={24} color={Theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.dayName}>{DayOfWeekLabels[day.dayOfWeek]}</Text>
            <Text style={styles.exerciseCount}>
              {exerciseCount} {exerciseCount === 1 ? 'exercício' : 'exercícios'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {onDelete && (
            <Pressable
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Ionicons name="trash-outline" size={20} color={Theme.colors.error} />
            </Pressable>
          )}
          {onPress && (
            <Ionicons name="chevron-forward-outline" size={20} color={Theme.colors.textTertiary} />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  exerciseCount: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
});

export default DayCard;
