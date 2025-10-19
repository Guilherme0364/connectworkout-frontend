/**
 * WorkoutCard Component
 *
 * Reusable card for displaying workout summary information
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WorkoutSummary } from '../types/api.types';

interface WorkoutCardProps {
  workout: WorkoutSummary;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onPress,
  onEdit,
  onDelete,
}) => {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{workout.name}</Text>
          {workout.isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Ativo</Text>
            </View>
          )}
        </View>

        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable style={styles.actionButton} onPress={onEdit}>
                <Ionicons name="create-outline" size={20} color="#3B82F6" />
              </Pressable>
            )}
            {onDelete && (
              <Pressable style={styles.actionButton} onPress={onDelete}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </Pressable>
            )}
          </View>
        )}
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.statText}>
            {workout.daysCount} {workout.daysCount === 1 ? 'dia' : 'dias'}
          </Text>
        </View>

        <View style={styles.stat}>
          <Ionicons name="barbell-outline" size={16} color="#6B7280" />
          <Text style={styles.statText}>
            {workout.exercisesCount} {workout.exercisesCount === 1 ? 'exercício' : 'exercícios'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>
          Criado em {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
        </Text>
        {onPress && (
          <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default WorkoutCard;
