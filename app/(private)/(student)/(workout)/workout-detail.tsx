/**
 * Workout Detail Screen
 *
 * Displays workout information with day selector and exercises
 * for the selected day
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
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DaySelector, { DAY_NAMES } from '../../../components/student/DaySelector';
import StudentExerciseListItem from '../../../components/student/StudentExerciseListItem';
import { WorkoutService } from '../../../services/workout.service';
import type { Workout } from '../../../types/api.types';
import { Theme } from '../../../styles/theme';

export default function WorkoutDetailScreen() {
  const params = useLocalSearchParams<{ workoutId: string }>();
  const workoutId = params.workoutId ? parseInt(params.workoutId, 10) : 0;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await WorkoutService.getWorkoutDetails(workoutId);
      setWorkout(data);

      // Auto-select today's workout if available, otherwise first day
      const today = new Date().getDay();
      const todayWorkout = data.workoutDays.find(
        (wd) => wd.dayOfWeek === today
      );
      setSelectedDay(
        todayWorkout ? today : data.workoutDays[0]?.dayOfWeek ?? null
      );
    } catch (err) {
      console.error('Error fetching workout details:', err);
      setError('Não foi possível carregar os detalhes do treino');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (workoutId) {
        fetchWorkoutDetails();
      }
    }, [workoutId])
  );

  const handleExercisePress = (exerciseId: number) => {
    router.push({
      pathname: '/(private)/(student)/(workout)/exercise-detail',
      params: {
        exerciseId: exerciseId.toString(),
        workoutId: workoutId.toString(),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando treino...</Text>
      </View>
    );
  }

  if (error || !workout) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={Theme.colors.error}
        />
        <Text style={styles.errorText}>
          {error || 'Treino não encontrado'}
        </Text>
        <Pressable style={styles.retryButton} onPress={fetchWorkoutDetails}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  const selectedDayWorkout = workout.workoutDays.find(
    (wd) => wd.dayOfWeek === selectedDay
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Theme.colors.textPrimary}
          />
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.workoutTitle} numberOfLines={1}>
            {workout.name}
          </Text>
          {workout.isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Ativo</Text>
            </View>
          )}
        </View>
      </View>

      {/* Day Selector */}
      <DaySelector
        workoutDays={workout.workoutDays.map((wd) => ({
          id: wd.id,
          dayOfWeek: wd.dayOfWeek,
          exercisesCount: wd.exercises.length,
        }))}
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
      />

      {/* Exercises List */}
      {selectedDay !== null && selectedDayWorkout && (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>
              {DAY_NAMES.full[selectedDay]}
            </Text>
            <Text style={styles.daySubtitle}>
              {selectedDayWorkout.exercises.length}{' '}
              {selectedDayWorkout.exercises.length === 1
                ? 'exercício'
                : 'exercícios'}
            </Text>
          </View>

          {selectedDayWorkout.exercises
            .sort((a, b) => a.order - b.order)
            .map((exercise, index) => (
              <StudentExerciseListItem
                key={exercise.id}
                exercise={exercise}
                index={index}
                onPress={() => handleExercisePress(exercise.id)}
              />
            ))}
        </ScrollView>
      )}
    </View>
  );
}

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
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  activeBadge: {
    backgroundColor: `${Theme.colors.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.components.badgeSuccessText,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  dayHeader: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  daySubtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
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
