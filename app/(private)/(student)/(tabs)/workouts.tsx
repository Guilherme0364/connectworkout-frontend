/**
 * Student Workouts List Screen
 *
 * Displays all assigned workouts for the student
 * with emphasis on the active workout
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WorkoutCard from '../../../components/WorkoutCard';
import { WorkoutService } from '../../../services/workout.service';
import type { WorkoutSummary } from '../../../types/api.types';
import { Theme } from '../../../styles/theme';

export default function StudentWorkoutsScreen() {
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);

      const data = await WorkoutService.getMyWorkouts();
      setWorkouts(data);

      // Find active workout
      const active = data.find(w => w.isActive);
      setActiveWorkout(active || null);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Não foi possível carregar seus treinos');
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWorkouts(true);
  };

  const handleWorkoutPress = (workout: WorkoutSummary) => {
    router.push({
      pathname: '/(private)/(student)/(workout)/workout-detail',
      params: { workoutId: workout.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando treinos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => fetchWorkouts()}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.centerContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Ionicons name="barbell-outline" size={64} color={Theme.colors.textTertiary} />
        <Text style={styles.emptyTitle}>Nenhum treino atribuído</Text>
        <Text style={styles.emptySubtitle}>
          Aguarde seu instrutor criar seu plano de treino
        </Text>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Treinos</Text>
        <Text style={styles.subtitle}>
          {workouts.length} {workouts.length === 1 ? 'treino' : 'treinos'} disponível
          {workouts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Active Workout Section */}
        {activeWorkout && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={20} color={Theme.colors.primary} />
              <Text style={styles.sectionTitle}>Treino Atual</Text>
            </View>
            <WorkoutCard
              workout={activeWorkout}
              onPress={() => handleWorkoutPress(activeWorkout)}
            />
          </View>
        )}

        {/* All Workouts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color={Theme.colors.textSecondary} />
            <Text style={styles.sectionTitle}>Todos os Treinos</Text>
          </View>
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={() => handleWorkoutPress(workout)}
            />
          ))}
        </View>
      </ScrollView>
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
    backgroundColor: Theme.colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
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
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
});
