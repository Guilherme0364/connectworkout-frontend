/**
 * ExerciseCard Component
 *
 * Reusable card for displaying exercise information with GIF preview
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Exercise } from '../types/api.types';
import { Theme } from '../styles/theme';
import { ExerciseImageService, RESOLUTION } from '../services/exerciseImage.service';

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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const hasValidGifUrl = exercise.gifUrl && exercise.gifUrl.trim().length > 0;

  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.content}>
        {draggable && (
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-two" size={24} color={Theme.colors.textTertiary} />
          </View>
        )}

        {hasValidGifUrl && !imageError ? (
          <Image
            source={ExerciseImageService.getImageProps(exercise.exerciseDbId, RESOLUTION.INSTRUCTOR)}
            style={styles.gif}
            contentFit="cover"
            onError={(error) => {
              console.error('Failed to load exercise GIF:', exercise.gifUrl, error);
              setImageError(true);
              setImageLoading(false);
            }}
            onLoadStart={() => setImageLoading(true)}
            onLoad={() => setImageLoading(false)}
          />
        ) : (
          <View style={[styles.gif, styles.gifPlaceholder]}>
            <Ionicons name="fitness" size={32} color={Theme.colors.textTertiary} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {exercise.name}
          </Text>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="fitness-outline" size={14} color={Theme.colors.textSecondary} />
              <Text style={styles.detailText}>
                {exercise.sets} × {exercise.repetitions}
              </Text>
            </View>

            {exercise.weight && (
              <View style={styles.detailRow}>
                <Ionicons name="barbell-outline" size={14} color={Theme.colors.textSecondary} />
                <Text style={styles.detailText}>{exercise.weight} kg</Text>
              </View>
            )}

            {exercise.restSeconds && (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color={Theme.colors.textSecondary} />
                <Text style={styles.detailText}>{exercise.restSeconds}s</Text>
              </View>
            )}
          </View>

          {exercise.notes && (
            <View style={styles.notesContainer}>
              <Ionicons name="document-text-outline" size={14} color={Theme.colors.textSecondary} />
              <Text style={styles.notes} numberOfLines={2}>
                {exercise.notes}
              </Text>
            </View>
          )}

          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {exercise.bodyPart}
              </Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {exercise.equipment}
              </Text>
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
                <Ionicons name="create-outline" size={20} color={Theme.colors.primary} />
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
                <Ionicons name="trash-outline" size={20} color={Theme.colors.error} />
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
    backgroundColor: Theme.colors.gray100,
  },
  gifPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.gray100,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
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
    color: Theme.colors.textSecondary,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 8,
    backgroundColor: Theme.colors.gray50,
    padding: 8,
    borderRadius: 6,
  },
  notes: {
    flex: 1,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: `${Theme.colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: Theme.components.badgeSuccessText,
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
