/**
 * Student Profile Edit Screen - "Minha ficha"
 *
 * Allows students to view and edit their complete profile information including
 * personal data, physical stats, health conditions, goals, and observations.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStudent } from '../contexts/StudentContext';
import { Gender, UpdateStudentProfileDto } from '../types/api.types';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, loadProfile, isLoading } = useStudent();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 1 as Gender, // Default to Male
    height: '',
    weight: '',
    description: '',
    cpf: '',
    phone: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load profile data if not already loaded
    if (!profile) {
      loadProfile();
    }
  }, []);

  useEffect(() => {
    // Pre-fill form with profile data
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || 1,
        height: '', // Not in StudentProfileDto, will add if backend supports
        weight: '', // Not in StudentProfileDto, will add if backend supports
        description: profile.description || '',
        cpf: profile.cpf || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    // Age validation (optional but if provided must be valid)
    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120)) {
      newErrors.age = 'Idade inválida';
    }

    // Height validation (optional but if provided must be valid)
    if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) < 50 || Number(formData.height) > 300)) {
      newErrors.height = 'Altura inválida (cm)';
    }

    // Weight validation (optional but if provided must be valid)
    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 20 || Number(formData.weight) > 500)) {
      newErrors.weight = 'Peso inválido (kg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro de validação', 'Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setIsSaving(true);

      // Prepare data - convert strings to numbers where needed, send null for empty fields
      const updateData: UpdateStudentProfileDto = {
        name: formData.name.trim(),
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        description: formData.description.trim() || undefined,
        cpf: formData.cpf.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      };

      console.log('📤 Sending profile update:', updateData);

      await updateProfile(updateData);

      Alert.alert(
        'Sucesso!',
        'Perfil atualizado com sucesso',
        [
          {
            text: 'OK',
            onPress: handleBack,
          },
        ]
      );
    } catch (err: any) {
      console.error('❌ Update profile error:', err);

      // Handle validation errors from backend
      const errorMessage = err.message || 'Falha ao atualizar perfil. Tente novamente.';
      const validationErrors = err.errors;

      if (validationErrors && Array.isArray(validationErrors)) {
        Alert.alert('Erro de validação', validationErrors.join('\n'));
      } else if (validationErrors && typeof validationErrors === 'object') {
        const errorMessages = Object.values(validationErrors).flat().join('\n');
        Alert.alert('Erro de validação', errorMessages);
      } else {
        Alert.alert('Erro', errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(private)/(student)/(tabs)/dashboard');
    }
  };

  const updateField = (field: string, value: string | Gender) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const showGenderPicker = () => {
    Alert.alert(
      'Selecione o sexo',
      '',
      [
        {
          text: 'Masculino',
          onPress: () => updateField('gender', 1),
        },
        {
          text: 'Feminino',
          onPress: () => updateField('gender', 2),
        },
        {
          text: 'Outro',
          onPress: () => updateField('gender', 3),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const getGenderLabel = (gender: Gender): string => {
    switch (gender) {
      case 1:
        return 'M';
      case 2:
        return 'F';
      case 3:
        return 'Outro';
      default:
        return 'M';
    }
  };

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C4FF0D" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Minha ficha</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do aluno</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="João Silva"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Row: Gender, Age, Weight */}
          <View style={styles.row}>
            {/* Gender */}
            <View style={[styles.inputGroup, styles.rowItem]}>
              <Text style={styles.label}>Sexo</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={showGenderPicker}
              >
                <Text style={styles.pickerButtonText}>
                  {getGenderLabel(formData.gender)}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Age */}
            <View style={[styles.inputGroup, styles.rowItem]}>
              <Text style={styles.label}>Idade</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                value={formData.age}
                onChangeText={(value) => updateField('age', value.replace(/[^0-9]/g, ''))}
                placeholder="25"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={3}
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            {/* Weight */}
            <View style={[styles.inputGroup, styles.rowItem]}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={[styles.input, errors.weight && styles.inputError]}
                value={formData.weight}
                onChangeText={(value) => updateField('weight', value.replace(/[^0-9.]/g, ''))}
                placeholder="80.5"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>
          </View>

          {/* Height */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Altura (cm)</Text>
            <TextInput
              style={[styles.input, errors.height && styles.inputError]}
              value={formData.height}
              onChangeText={(value) => updateField('height', value.replace(/[^0-9.]/g, ''))}
              placeholder="175"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
            {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
          </View>

          {/* Description/Observations */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Disponível de segunda a sexta pela manhã..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* CPF */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={[styles.input, errors.cpf && styles.inputError]}
              value={formData.cpf}
              onChangeText={(value) => updateField('cpf', value)}
              placeholder="000.000.000-00"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
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
  scrollContent: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  rowItem: {
    flex: 1,
  },
  pickerButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#C4FF0D',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  bottomSpacing: {
    height: 100,
  },
});
