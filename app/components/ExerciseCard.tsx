/**
 * ExerciseCard Component
 *
 * Reusable card for displaying exercise information with GIF preview
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Exercise } from '../types/api.types';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit?: () => void;
  onDelete?: () => void;
  draggable?: boolean;
  onPress?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onEdit,
  onDelete,
  draggable,
  onPress,
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.content}>
        {draggable && (
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-two" size={24} color="#9CA3AF" />
          </View>
        )}

        <Image
          source={{ uri: exercise.gifUrl }}
          style={styles.gif}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {exercise.name}
          </Text>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="fitness-outline" size={14} color="#6B7280" />
              <Text style={styles.detailText}>
                {exercise.sets} × {exercise.repetitions}
              </Text>
            </View>

            {exercise.weight && (
              <View style={styles.detailRow}>
                <Ionicons name="barbell-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>{exercise.weight} kg</Text>
              </View>
            )}

            {exercise.restSeconds && (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>{exercise.restSeconds}s</Text>
              </View>
            )}
          </View>

          {exercise.notes && (
            <View style={styles.notesContainer}>
              <Ionicons name="document-text-outline" size={14} color="#6B7280" />
              <Text style={styles.notes} numberOfLines={2}>
                {exercise.notes}
              </Text>
            </View>
          )}

          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{exercise.bodyPart}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{exercise.equipment}</Text>
            </View>
          </View>
        </View>

        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Ionicons name="create-outline" size={20} color="#3B82F6" />
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
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
    padding: 12,
    alignItems: 'flex-start',
  },
  dragHandle: {
    marginRight: 8,
    paddingVertical: 8,
  },
  gif: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
  },
  notes: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    padding: 4,
  },
});

export default ExerciseCard;
