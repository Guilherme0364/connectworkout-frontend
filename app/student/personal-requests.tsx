/**
 * Personal Requests Screen
 *
 * Displays a list of pending trainer connection requests.
 * Students can view and accept trainer requests from this screen.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStudent } from '../contexts/StudentContext';
import EmptyState from '../components/EmptyState';

export default function PersonalRequestsScreen() {
  const router = useRouter();
  const { trainerRequests, loadTrainerRequests, isLoading } = useStudent();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrainerRequests();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTrainerRequests();
    setRefreshing(false);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(private)/(student)/(tabs)/dashboard');
    }
  };

  const handleViewTrainer = (trainerId: number) => {
    router.push(`/student/trainer-profile?id=${trainerId}`);
  };

  const pendingRequests = trainerRequests.filter(req => req.status === 'pending');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitações de personal</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C4FF0D" />
            <Text style={styles.loadingText}>Carregando solicitações...</Text>
          </View>
        ) : pendingRequests.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="Nenhuma solicitação"
            description="Você não possui solicitações de personal no momento"
            iconColor="#9CA3AF"
          />
        ) : (
          <>
            <Text style={styles.subtitle}>
              Você possui {pendingRequests.length} {pendingRequests.length === 1 ? 'solicitação' : 'solicitações'}
            </Text>

            {pendingRequests.map((request) => (
              <TouchableOpacity
                key={request.id}
                style={styles.requestCard}
                onPress={() => handleViewTrainer(request.trainerId)}
              >
                <View style={styles.requestInfo}>
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={24} color="#6B7280" />
                  </View>
                  <View style={styles.requestDetails}>
                    <Text style={styles.trainerName}>Personal {request.trainerName}</Text>
                    <Text style={styles.trainerEmail}>{request.trainerEmail}</Text>
                    {request.trainerStudentCount !== undefined && (
                      <Text style={styles.trainerStats}>
                        {request.trainerStudentCount} {request.trainerStudentCount === 1 ? 'aluno' : 'alunos'}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewTrainer(request.trainerId)}
                >
                  <Ionicons name="chevron-forward" size={24} color="#6B7280" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensate for back button
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 24,
    marginBottom: 16,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requestDetails: {
    flex: 1,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  trainerEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  trainerStats: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  viewButton: {
    padding: 8,
  },
  bottomSpacing: {
    height: 24,
  },
});
