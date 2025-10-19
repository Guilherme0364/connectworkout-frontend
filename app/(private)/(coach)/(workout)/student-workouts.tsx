/**
 * Coach Student Workouts Screen
 *
 * Displays all workouts for a selected student
 * Allows coach to create, edit, and delete workouts
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import WorkoutCard from '../../../components/WorkoutCard';
import EmptyState from '../../../components/EmptyState';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { WorkoutService, InstructorService } from '../../../services';
import { handleApiError, showConfirmation, showSuccess } from '../../../utils/errorHandler';
import type { WorkoutSummary, UserDto } from '../../../types/api.types';

export default function CoachStudentWorkouts() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const [student, setStudent] = useState<UserDto | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  const fetchData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [studentData, workoutsData] = await Promise.all([
        InstructorService.getStudentDetails(Number(studentId)),
        WorkoutService.getStudentWorkouts(Number(studentId)),
      ]);

      setStudent(studentData);
      setWorkouts(workoutsData);
    } catch (error) {
      handleApiError(error, 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchData(true);
  };

  const handleCreateWorkout = () => {
    router.push(`/(private)/(coach)/(workout)/create-workout?studentId=${studentId}`);
  };

  const handleEditWorkout = (workoutId: number) => {
    router.push(`/(private)/(coach)/(workout)/edit-workout?workoutId=${workoutId}`);
  };

  const handleDeletePress = (workoutId: number) => {
    setWorkoutToDelete(workoutId);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!workoutToDelete) return;

    try {
      setDeleting(true);
      await WorkoutService.deleteWorkout(workoutToDelete);
      setWorkouts(workouts.filter((w) => w.id !== workoutToDelete));
      showSuccess('Sucesso', 'Treino excluído com sucesso');
    } catch (error) {
      handleApiError(error, 'Não foi possível excluir o treino');
    } finally {
      setDeleting(false);
      setDeleteDialogVisible(false);
      setWorkoutToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setWorkoutToDelete(null);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(private)/(coach)/(tabs)/students');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Carregando treinos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Treinos</Text>
            {student && <Text style={styles.subtitle}>{student.name}</Text>}
          </View>
        </View>

        {/* Workouts List */}
        {workouts.length === 0 ? (
          <EmptyState
            icon="barbell-outline"
            title="Nenhum treino criado"
            description="Crie o primeiro treino para este aluno"
          />
        ) : (
          <View style={styles.workoutsList}>
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={() => handleEditWorkout(workout.id)}
                onEdit={() => handleEditWorkout(workout.id)}
                onDelete={() => handleDeletePress(workout.id)}
              />
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* FAB - Create Workout */}
      <Pressable style={styles.fab} onPress={handleCreateWorkout}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Excluir Treino"
        message="Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita."
        confirmText={deleting ? 'Excluindo...' : 'Excluir'}
        cancelText="Cancelar"
        confirmColor="#EF4444"
        icon="trash-outline"
        iconColor="#EF4444"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  workoutsList: {
    marginBottom: 24,
  },
  bottomSpacing: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
