/**
 * Trainer Profile Screen
 *
 * Displays detailed information about a trainer and allows the student
 * to accept or reject the trainer connection request.
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
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StudentService } from '../services';
import { useStudent } from '../contexts/StudentContext';
import { TrainerDto } from '../types/api.types';

export default function TrainerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { acceptTrainer, rejectTrainer } = useStudent();

  const [trainer, setTrainer] = useState<TrainerDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadTrainerDetails();
    }
  }, [id]);

  const loadTrainerDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const trainerId = parseInt(id as string);
      const data = await StudentService.getTrainerDetails(trainerId);
      setTrainer(data);
    } catch (err: any) {
      console.error('Failed to load trainer details:', err);
      setError(err.message || 'Falha ao carregar detalhes do personal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptPress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAccept = async () => {
    if (!trainer) return;

    try {
      setIsAccepting(true);
      setShowConfirmModal(false);
      await acceptTrainer(trainer.id);

      Alert.alert(
        'Sucesso!',
        `O personal ${trainer.name} foi adicionado com sucesso! Agora os treinos estão liberados para você!`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'Erro',
        err.message || 'Falha ao aceitar personal. Tente novamente.'
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(private)/(student)/(tabs)/dashboard');
    }
  };

  const handleReject = async () => {
    if (!trainer) return;

    Alert.alert(
      'Rejeitar Solicitação',
      `Tem certeza que deseja rejeitar a solicitação de ${trainer.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: async () => {
            try {
              await rejectTrainer(trainer.id);
              Alert.alert('Solicitação rejeitada', 'A solicitação foi removida.', [
                { text: 'OK', onPress: handleBack },
              ]);
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Falha ao rejeitar solicitação');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Visualizar personal</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#BBF246" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !trainer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Visualizar personal</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error || 'Personal não encontrado'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTrainerDetails}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visualizar personal</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.profileSection}>
          <View style={styles.photoContainer}>
            {trainer.photoUrl ? (
              <View style={styles.photoPlaceholder}>
                {/* TODO: Add actual image component */}
                <Ionicons name="person" size={48} color="#6B7280" />
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={48} color="#6B7280" />
              </View>
            )}
          </View>
          <Text style={styles.email}>{trainer.email}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nome:</Text>
            <Text style={styles.detailValue}>{trainer.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Alunos:</Text>
            <Text style={styles.detailValue}>
              {trainer.studentCount} {trainer.studentCount === 1 ? 'Aluno' : 'Alunos'}
            </Text>
          </View>

          {trainer.credentials && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Formação:</Text>
              <Text style={styles.detailValue}>{trainer.credentials}</Text>
            </View>
          )}

          {trainer.description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sobre:</Text>
              <Text style={styles.detailValue}>{trainer.description}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isAccepting && styles.buttonDisabled]}
            onPress={handleAcceptPress}
            disabled={isAccepting}
          >
            {isAccepting ? (
              <ActivityIndicator color="#1A1A1A" />
            ) : (
              <Text style={styles.primaryButtonText}>Aceitar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReject}
            disabled={isAccepting}
          >
            <Text style={styles.secondaryButtonText}>Rejeitar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Conexão</Text>
            <Text style={styles.modalText}>
              O personal {trainer.name} será adicionado com sucesso! Agora os treinos estão
              liberados para você!
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmAccept}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#BBF246',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  photoContainer: {
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  primaryButton: {
    backgroundColor: '#BBF246',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  bottomSpacing: {
    height: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#BBF246',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
