/**
 * Exercise Detail Screen
 *
 * Displays detailed exercise information including:
 * - Exercise GIF animation
 * - Training parameters (sets, reps, weight, rest)
 * - Muscle information
 * - Step-by-step instructions
 * - Instructor notes
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutService } from '../../../services/workout.service';
import { ExerciseService } from '../../../services/exercise.service';
import type { Workout, Exercise, ExerciseDbModel } from '../../../types/api.types';
import { Theme } from '../../../styles/theme';
import { ExerciseImageService, RESOLUTION } from '../../../services/exerciseImage.service';

type TabType = 'overview' | 'instructions';

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams<{
    exerciseId: string;
    workoutId: string;
  }>();
  const exerciseId = params.exerciseId ? parseInt(params.exerciseId, 10) : 0;
  const workoutId = params.workoutId ? parseInt(params.workoutId, 10) : 0;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [exerciseDbDetails, setExerciseDbDetails] = useState<ExerciseDbModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingInstructions, setLoadingInstructions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [imageError, setImageError] = useState(false);

  const fetchExerciseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch workout to get exercise details
      const workout = await WorkoutService.getWorkoutDetails(workoutId);

      // Find the exercise in the workout
      let foundExercise: Exercise | null = null;
      for (const day of workout.workoutDays) {
        const ex = day.exercises.find((e) => e.id === exerciseId);
        if (ex) {
          foundExercise = ex;
          break;
        }
      }

      if (!foundExercise) {
        throw new Error('Exercício não encontrado');
      }

      setExercise(foundExercise);

      // Optionally fetch full details from ExerciseDB
      if (foundExercise.exerciseDbId) {
        setLoadingInstructions(true);
        try {
          const dbDetails = await ExerciseService.getExerciseById(
            foundExercise.exerciseDbId
          );
          setExerciseDbDetails(dbDetails);
        } catch (err) {
          console.log('Could not load exercise instructions:', err);
          // Not critical, continue without instructions
        } finally {
          setLoadingInstructions(false);
        }
      }
    } catch (err) {
      console.error('Error fetching exercise details:', err);
      setError('Não foi possível carregar os detalhes do exercício');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (exerciseId && workoutId) {
        fetchExerciseDetails();
      }
    }, [exerciseId, workoutId])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando exercício...</Text>
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={Theme.colors.error}
        />
        <Text style={styles.errorText}>
          {error || 'Exercício não encontrado'}
        </Text>
        <Pressable style={styles.retryButton} onPress={fetchExerciseDetails}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={Theme.colors.textPrimary}
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Detalhes do Exercício
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Exercise GIF */}
        <View style={styles.gifContainer}>
          {!imageError ? (
            <Image
              source={ExerciseImageService.getImageProps(exercise.exerciseDbId, RESOLUTION.STUDENT)}
              style={styles.gif}
              contentFit="contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.gif, styles.gifPlaceholder]}>
              <Ionicons
                name="barbell"
                size={64}
                color={Theme.colors.textTertiary}
              />
            </View>
          )}
        </View>

        {/* Exercise Name */}
        <View style={styles.nameContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>

          {/* Muscle Info */}
          {exerciseDbDetails && (
            <View style={styles.muscleInfo}>
              {exerciseDbDetails.target && (
                <View style={styles.muscleTag}>
                  <Text style={styles.muscleLabel}>Principal:</Text>
                  <Text style={styles.muscleValue}>
                    {exerciseDbDetails.target}
                  </Text>
                </View>
              )}

              {exerciseDbDetails.secondaryMuscles.length > 0 && (
                <View style={styles.muscleTag}>
                  <Text style={styles.muscleLabel}>Secundários:</Text>
                  <Text style={styles.muscleValue}>
                    {exerciseDbDetails.secondaryMuscles.join(', ')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'overview' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('overview')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'overview' && styles.tabTextActive,
              ]}
            >
              Visão Geral
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === 'instructions' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('instructions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'instructions' && styles.tabTextActive,
              ]}
            >
              Instruções
            </Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <OverviewTab exercise={exercise} />
        ) : (
          <InstructionsTab
            exerciseDbDetails={exerciseDbDetails}
            loading={loadingInstructions}
          />
        )}
      </ScrollView>
    </View>
  );
}

// Overview Tab Component
const OverviewTab: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
  <View style={styles.tabContent}>
    <Text style={styles.sectionTitle}>Parâmetros do Treino</Text>

    <View style={styles.parametersGrid}>
      <View style={styles.parameterCard}>
        <Ionicons name="repeat" size={32} color={Theme.colors.primary} />
        <Text style={styles.parameterValue}>{exercise.sets}</Text>
        <Text style={styles.parameterLabel}>Séries</Text>
      </View>

      <View style={styles.parameterCard}>
        <Ionicons name="fitness" size={32} color={Theme.colors.primary} />
        <Text style={styles.parameterValue}>{exercise.repetitions}</Text>
        <Text style={styles.parameterLabel}>Repetições</Text>
      </View>

      {exercise.weight !== undefined && exercise.weight > 0 && (
        <View style={styles.parameterCard}>
          <Ionicons name="barbell" size={32} color={Theme.colors.primary} />
          <Text style={styles.parameterValue}>{exercise.weight}kg</Text>
          <Text style={styles.parameterLabel}>Peso</Text>
        </View>
      )}

      {exercise.restSeconds !== undefined && exercise.restSeconds > 0 && (
        <View style={styles.parameterCard}>
          <Ionicons name="time" size={32} color={Theme.colors.primary} />
          <Text style={styles.parameterValue}>{exercise.restSeconds}s</Text>
          <Text style={styles.parameterLabel}>Descanso</Text>
        </View>
      )}
    </View>

    {/* Equipment and Body Part Tags */}
    <View style={styles.tagsContainer}>
      <View style={styles.infoTag}>
        <Ionicons name="body" size={16} color={Theme.colors.primary} />
        <Text style={styles.infoTagText}>{exercise.bodyPart}</Text>
      </View>
      <View style={styles.infoTag}>
        <Ionicons name="barbell" size={16} color={Theme.colors.primary} />
        <Text style={styles.infoTagText}>{exercise.equipment}</Text>
      </View>
    </View>

    {/* Instructor Notes */}
    {exercise.notes && (
      <View style={styles.notesBox}>
        <View style={styles.notesHeader}>
          <Ionicons
            name="information-circle"
            size={20}
            color={Theme.colors.info}
          />
          <Text style={styles.notesTitle}>Observações do Instrutor</Text>
        </View>
        <Text style={styles.notesText}>{exercise.notes}</Text>
      </View>
    )}
  </View>
);

// Instructions Tab Component
const InstructionsTab: React.FC<{
  exerciseDbDetails: ExerciseDbModel | null;
  loading: boolean;
}> = ({ exerciseDbDetails, loading }) => {
  if (loading) {
    return (
      <View style={styles.tabContent}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando instruções...</Text>
      </View>
    );
  }

  if (!exerciseDbDetails || !exerciseDbDetails.instructions || exerciseDbDetails.instructions.length === 0) {
    return (
      <View style={styles.tabContent}>
        <View style={styles.emptyInstructions}>
          <Ionicons
            name="document-text-outline"
            size={64}
            color={Theme.colors.textTertiary}
          />
          <Text style={styles.emptyText}>
            Instruções não disponíveis para este exercício
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Como Executar</Text>

      {exerciseDbDetails.instructions.map((instruction, index) => (
        <View key={index} style={styles.instructionStep}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.instructionText}>{instruction}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  gifContainer: {
    backgroundColor: Theme.colors.surface,
    padding: 16,
    alignItems: 'center',
  },
  gif: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  gifPlaceholder: {
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    backgroundColor: Theme.colors.surface,
    padding: 16,
    paddingTop: 8,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  muscleInfo: {
    gap: 8,
  },
  muscleTag: {
    backgroundColor: Theme.colors.background,
    padding: 12,
    borderRadius: 8,
  },
  muscleLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  muscleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    textTransform: 'capitalize',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  tabTextActive: {
    color: Theme.colors.primary,
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 16,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  parameterCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  parameterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginTop: 8,
  },
  parameterLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${Theme.colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoTagText: {
    fontSize: 14,
    color: Theme.colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  notesBox: {
    backgroundColor: `${Theme.colors.info}10`,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.info,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.info,
  },
  notesText: {
    fontSize: 14,
    color: Theme.colors.textPrimary,
    lineHeight: 20,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    lineHeight: 20,
  },
  emptyInstructions: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Theme.colors.textSecondary,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
