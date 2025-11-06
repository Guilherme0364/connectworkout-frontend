/**
 * StudentExerciseListItem Component
 *
 * Displays exercise information in a list format for students
 * Shows exercise GIF, details, and training parameters
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Exercise } from '../../types/api.types';
import { Theme } from '../../styles/theme';
import { ExerciseImageService, RESOLUTION } from '../../services/exerciseImage.service';

interface StudentExerciseListItemProps {
  exercise: Exercise;
  index: number;
  onPress: () => void;
}

const StudentExerciseListItem: React.FC<StudentExerciseListItemProps> = ({
  exercise,
  index,
  onPress,
}) => {
  const [imageError, setImageError] = useState(false);
  const hasValidGifUrl = exercise.gifUrl && exercise.gifUrl.trim().length > 0;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Exercise Number */}
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>

      {/* Exercise GIF Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {hasValidGifUrl && !imageError ? (
          <Image
            source={ExerciseImageService.getImageProps(exercise.exerciseDbId, RESOLUTION.INSTRUCTOR)}
            style={styles.thumbnail}
            contentFit="cover"
            onError={(error) => {
              console.error('Failed to load exercise GIF:', exercise.gifUrl, error);
              setImageError(true);
            }}
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Ionicons name="barbell" size={24} color={Theme.colors.textTertiary} />
          </View>
        )}
      </View>

      {/* Exercise Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {exercise.name}
        </Text>

        {/* Training Parameters */}
        <View style={styles.parameters}>
          <View style={styles.parameter}>
            <Ionicons name="repeat" size={12} color={Theme.colors.textSecondary} />
            <Text style={styles.parameterText}>
              {exercise.sets} × {exercise.repetitions}
            </Text>
          </View>

          {exercise.weight && (
            <View style={styles.parameter}>
              <Ionicons name="barbell" size={12} color={Theme.colors.textSecondary} />
              <Text style={styles.parameterText}>{exercise.weight}kg</Text>
            </View>
          )}

          {exercise.restSeconds && (
            <View style={styles.parameter}>
              <Ionicons name="time" size={12} color={Theme.colors.textSecondary} />
              <Text style={styles.parameterText}>{exercise.restSeconds}s</Text>
            </View>
          )}
        </View>

        {/* Tags */}
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{exercise.bodyPart}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{exercise.equipment}</Text>
          </View>
        </View>

        {/* Instructor Notes */}
        {exercise.notes && (
          <View style={styles.notesContainer}>
            <Ionicons name="information-circle" size={14} color={Theme.colors.info} />
            <Text style={styles.notesText} numberOfLines={2}>
              {exercise.notes}
            </Text>
          </View>
        )}
      </View>

      {/* Chevron */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={Theme.colors.textTertiary}
        style={styles.chevron}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  thumbnailContainer: {
    marginRight: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Theme.colors.background,
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: 6,
  },
  parameters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  parameter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  parameterText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: `${Theme.colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: Theme.colors.primary,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    backgroundColor: `${Theme.colors.info}10`,
    padding: 6,
    borderRadius: 4,
  },
  notesText: {
    flex: 1,
    fontSize: 11,
    color: Theme.colors.info,
    fontStyle: 'italic',
  },
  chevron: {
    marginLeft: 8,
  },
});

export default StudentExerciseListItem;
