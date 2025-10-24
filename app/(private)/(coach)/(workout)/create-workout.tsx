/**
 * Coach Create Workout Screen
 *
 * Allows coach to create a new workout for a student
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WorkoutService } from '../../../services';
import { handleApiError, showSuccess } from '../../../utils/errorHandler';

export default function CoachCreateWorkout() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const [workoutName, setWorkoutName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const validateForm = (): boolean => {
    if (!workoutName.trim()) {
      setError('O nome do treino é obrigatório');
      return false;
    }
    setError('');
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setCreating(true);
      const result = await WorkoutService.createWorkout({
        studentId: Number(studentId),
        name: workoutName.trim(),
      });

      showSuccess('Sucesso', 'Treino criado com sucesso!');

      // Navigate to edit workout screen to add days and exercises
      router.replace(`/(private)/(coach)/(workout)/edit-workout?workoutId=${result.id}`);
    } catch (error) {
      handleApiError(error, 'Não foi possível criar o treino');
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(private)/(coach)/(tabs)/students');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="close" size={24} color="#111827" />
          </Pressable>
          <Text style={styles.title}>Novo Treino</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Nome do Treino <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="Ex: Treino A, Treino B, Treino de Força"
                placeholderTextColor="#9CA3AF"
                value={workoutName}
                onChangeText={(text) => {
                  setWorkoutName(text);
                  if (error) setError('');
                }}
                maxLength={50}
                autoFocus
                editable={!creating}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Text style={styles.hint}>
                Dê um nome descritivo para este treino
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="information-circle" size={24} color="#BBF246" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Próximo Passo</Text>
              <Text style={styles.infoText}>
                Após criar o treino, você poderá adicionar os dias da semana e os exercícios.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
          disabled={creating}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            styles.createButton,
            creating && styles.buttonDisabled,
          ]}
          onPress={handleCreate}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Criar Treino</Text>
            </>
          )}
        </Pressable>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  form: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#3B82F6',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  createButton: {
    backgroundColor: '#BBF246',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
