import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { Theme } from '../../styles/theme';
import { InstructorService } from '../../services';
import { handleApiError } from '../../utils/errorHandler';
import type { UserDto } from '../../types/api.types';
import { Gender } from '../../types/api.types';

export default function StudentProfile() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const [student, setStudent] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    if (studentId) {
      loadStudentProfile();
    }
  }, [studentId]);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      const studentData = await InstructorService.getStudentDetails(Number(studentId));
      setStudent(studentData);
      // Notes would come from backend in a real implementation
      setNotes('');
    } catch (error) {
      handleApiError(error, 'Não foi possível carregar o perfil do aluno');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const canGoBack = router.canGoBack();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          {canGoBack && (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Theme.colors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Perfil do Aluno</Text>
        </View>

        {/* Profile Header Card */}
        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={Theme.colors.primary} />
            </View>
          </View>
          <Text style={styles.userName}>{student.name}</Text>
          <Text style={styles.userEmail}>{student.email}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        </View>

        <View style={styles.card}>
          {student.age && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={Theme.colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Idade</Text>
                <Text style={styles.infoValue}>{student.age} anos</Text>
              </View>
            </View>
          )}

          {student.gender && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={Theme.colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gênero</Text>
                <Text style={styles.infoValue}>
                  {student.gender === Gender.Male ? 'Masculino' : student.gender === Gender.Female ? 'Feminino' : 'Outro'}
                </Text>
              </View>
            </View>
          )}

          {student.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={Theme.colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{student.phone}</Text>
              </View>
            </View>
          )}

          {(student.bio || student.description) && (
            <View style={styles.bioSection}>
              <Text style={styles.bioLabel}>Sobre</Text>
              <Text style={styles.bioText}>{student.bio || student.description}</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/(private)/(coach)/student-workout-view?studentId=${studentId}`)}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: Theme.colors.primaryLight }]}>
                <Ionicons name="barbell" size={20} color={Theme.colors.darkerGray} />
              </View>
              <Text style={styles.actionText}>Ver Treinos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/(private)/(coach)/(workout)/student-workouts?studentId=${studentId}`)}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: Theme.colors.secondaryLight }]}>
                <Ionicons name="add-circle" size={20} color={Theme.colors.white} />
              </View>
              <Text style={styles.actionText}>Gerenciar Treinos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Coach Notes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Anotações do Coach</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.notesDescription}>
            Adicione observações, metas ou notas importantes sobre este aluno
          </Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Ex: Foco em perda de peso, lesão no joelho direito, preferência por treinos curtos..."
            placeholderTextColor={Theme.colors.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.saveNotesButton}>
            <Text style={styles.saveNotesButtonText}>Salvar Anotações</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
  },
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Theme.colors.textPrimary,
  },
  bioSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.gray700,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: 8,
  },
  notesDescription: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  notesInput: {
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    minHeight: 120,
  },
  saveNotesButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveNotesButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textOnPrimary,
  },
  bottomSpacing: {
    height: 24,
  },
});
