import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { InstructorService } from '../../../services';
import { StudentSummaryDto } from '../../../types/api.types';
import { handleApiError } from '../../../utils/errorHandler';
import { Theme } from '../../../styles/theme';
import StatCard from '../../../components/dashboard/StatCard';
import DashboardCard from '../../../components/dashboard/DashboardCard';
import { TimelineItem } from '../../../components/dashboard/TimelineItem';

export default function CoachDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State for calculated statistics
  const [students, setStudents] = useState<StudentSummaryDto[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudentsCount, setActiveStudentsCount] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [recentStudents, setRecentStudents] = useState<StudentSummaryDto[]>([]);
  const [workoutsThisMonth, setWorkoutsThisMonth] = useState(0);
  const [newStudentsThisWeek, setNewStudentsThisWeek] = useState(0);

  // Activity feed - Phase 2 feature (not yet implemented in backend)
  // TODO: Implement when /api/activities/feed endpoint is available
  const [recentActivities] = useState<any[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch statistics and students in parallel (Phase 1)
      const [statistics, studentsData] = await Promise.all([
        InstructorService.getStatistics(),
        InstructorService.getStudents(),
      ]);

      // Set statistics from API response
      setTotalStudents(statistics.totalStudents);
      setActiveStudentsCount(statistics.activeStudents);
      setCompletionRate(Math.round(statistics.completionRateToday));
      setWorkoutsThisMonth(statistics.workoutsCreatedThisMonth);
      setNewStudentsThisWeek(statistics.newStudentsThisWeek);

      // Set students data for display
      setStudents(studentsData);
      const sortedStudents = [...studentsData].slice(0, 6);
      setRecentStudents(sortedStudents);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      handleApiError(error, 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleViewAllStudents = () => {
    router.push('/(private)/(coach)/(tabs)/students');
  };

  const handleAddStudent = () => {
    router.push('/(private)/(coach)/add-student');
  };

  const handleCreateWorkout = () => {
    router.push('/(private)/(coach)/(workout)/create-workout');
  };

  const handleStudentPress = (studentId: string) => {
    router.push({
      pathname: '/(private)/(coach)/student-workout-view',
      params: { studentId },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando painel...</Text>
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
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bem-vindo de volta, {user?.name || 'Personal'}!</Text>
          <Text style={styles.subGreeting}>
            {totalStudents} {totalStudents === 1 ? 'aluno' : 'alunos'} • {activeStudentsCount} {activeStudentsCount === 1 ? 'ativo' : 'ativos'}
          </Text>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total de Alunos"
            value={totalStudents}
            subtitle="no programa"
            icon="people"
            color={Theme.colors.primary}
          />
          <StatCard
            title="Treinos Ativos"
            value={activeStudentsCount}
            subtitle="atribuídos"
            icon="barbell"
            color={Theme.colors.secondary}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Taxa de Conclusão"
            value={`${completionRate}%`}
            subtitle="média de hoje"
            icon="checkmark-circle"
            color={Theme.colors.success}
          />
          <StatCard
            title="Novos Esta Semana"
            value={newStudentsThisWeek}
            subtitle="alunos entraram"
            icon="trending-up"
            color={Theme.colors.accent}
          />
        </View>

        {/* Active Students Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alunos Ativos</Text>
            <TouchableOpacity onPress={handleViewAllStudents}>
              <Text style={styles.viewAllButton}>Ver Todos</Text>
            </TouchableOpacity>
          </View>

          {recentStudents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={Theme.colors.gray400} />
              <Text style={styles.emptyStateTitle}>Nenhum aluno ainda</Text>
              <Text style={styles.emptyStateText}>
                Adicione seu primeiro aluno para começar
              </Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddStudent}>
                <Text style={styles.emptyStateButtonText}>Adicionar Aluno</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.studentsGrid}>
              {recentStudents.map((student) => (
                <TouchableOpacity
                  key={student.id}
                  style={styles.studentCard}
                  onPress={() => handleStudentPress(student.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.studentAvatar}>
                    <Ionicons name="person" size={24} color={Theme.colors.primary} />
                  </View>
                  <Text style={styles.studentName} numberOfLines={1}>
                    {student.name}
                  </Text>
                  {student.activeWorkoutId ? (
                    <>
                      <Text style={styles.studentWorkout} numberOfLines={1}>
                        {student.activeWorkoutName}
                      </Text>
                      <View style={styles.studentProgress}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${
                                  student.totalExercisesToday > 0
                                    ? (student.completedExercisesToday /
                                        student.totalExercisesToday) *
                                      100
                                    : 0
                                }%`,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {student.completedExercisesToday}/{student.totalExercisesToday}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.noWorkoutText}>Nenhum treino ativo</Text>
                  )}
                  <View style={styles.studentActions}>
                    <Ionicons name="eye-outline" size={16} color={Theme.colors.darkerGray} />
                    <Text style={styles.viewDetailsText}>Ver</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* General Information / Statistics */}
        <DashboardCard
          title="Visão Geral Mensal"
          icon="calendar-outline"
          color={Theme.colors.secondary}
        >
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Ionicons name="barbell" size={24} color={Theme.colors.primary} />
              <Text style={styles.overviewValue}>{workoutsThisMonth}</Text>
              <Text style={styles.overviewLabel}>Treinos Criados</Text>
            </View>
            <View style={styles.overviewItem}>
              <Ionicons name="fitness" size={24} color={Theme.colors.success} />
              <Text style={styles.overviewValue}>{activeStudentsCount}</Text>
              <Text style={styles.overviewLabel}>Programas Ativos</Text>
            </View>
            <View style={styles.overviewItem}>
              <Ionicons name="trophy" size={24} color={Theme.colors.accent} />
              <Text style={styles.overviewValue}>{completionRate}%</Text>
              <Text style={styles.overviewLabel}>Conclusão Média</Text>
            </View>
          </View>
        </DashboardCard>

        {/* Recent Activity Feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          {recentActivities.length === 0 ? (
            <View style={styles.emptyActivityState}>
              <Ionicons name="time-outline" size={40} color={Theme.colors.gray400} />
              <Text style={styles.emptyStateText}>Nenhuma atividade recente</Text>
            </View>
          ) : (
            <DashboardCard title="" icon="time-outline" color={Theme.colors.primary}>
              {recentActivities.map((activity, index) => (
                <TimelineItem
                  key={activity.id}
                  icon={activity.icon}
                  iconColor={activity.iconColor}
                  iconBgColor={activity.iconBgColor}
                  title={activity.title}
                  subtitle={activity.subtitle}
                  time={activity.time}
                  isLast={index === recentActivities.length - 1}
                />
              ))}
            </DashboardCard>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
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
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: -4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginHorizontal: -8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  studentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  studentCard: {
    width: '48%',
    backgroundColor: Theme.colors.white,
    borderRadius: 12,
    padding: 16,
    margin: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  studentWorkout: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  noWorkoutText: {
    fontSize: 13,
    color: Theme.colors.textTertiary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  studentProgress: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Theme.colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
  },
  studentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    color: Theme.colors.darkerGray,
    fontWeight: '600',
    marginLeft: 4,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: Theme.colors.white,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.gray700,
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyStateButtonText: {
    color: Theme.colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyActivityState: {
    backgroundColor: Theme.colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});
