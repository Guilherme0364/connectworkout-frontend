import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Linking,
} from 'react-native';
import { Theme } from '../../styles/theme';
import { EditableProfileField } from '../../components/profile/EditableProfileField';
import { useAuth } from '../../hooks/useAuth';
import { UserService } from '../../services';
import { Gender } from '../../types/api.types';

export default function CoachDetailedProfile() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    gender: user?.gender || Gender.Other,
    bio: user?.bio || user?.description || '',
    phone: user?.phone || '',
    certifications: user?.certifications || '',
    specializations: user?.specializations || '',
    yearsOfExperience: user?.yearsOfExperience?.toString() || '',
    socialLinks: {
      instagram: user?.socialLinks?.instagram || '',
      facebook: user?.socialLinks?.facebook || '',
      website: user?.socialLinks?.website || '',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age?.toString() || '',
        gender: user.gender || Gender.Other,
        bio: user.bio || user.description || '',
        phone: user.phone || '',
        certifications: user.certifications || '',
        specializations: user.specializations || '',
        yearsOfExperience: user.yearsOfExperience?.toString() || '',
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          facebook: user.socialLinks?.facebook || '',
          website: user.socialLinks?.website || '',
        },
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome obrigatório';
    }

    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 120)) {
      newErrors.age = 'Digite uma idade válida (18-120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      age: user?.age?.toString() || '',
      gender: user?.gender || Gender.Other,
      bio: user?.bio || user?.description || '',
      phone: user?.phone || '',
      certifications: user?.certifications || '',
      specializations: user?.specializations || '',
      yearsOfExperience: user?.yearsOfExperience?.toString() || '',
      socialLinks: {
        instagram: user?.socialLinks?.instagram || '',
        facebook: user?.socialLinks?.facebook || '',
        website: user?.socialLinks?.website || '',
      },
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const updateData = {
        name: formData.name,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        bio: formData.bio,
        phone: formData.phone || undefined,
        certifications: formData.certifications || undefined,
        specializations: formData.specializations || undefined,
        yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined,
        socialLinks: {
          instagram: formData.socialLinks.instagram || null,
          facebook: formData.socialLinks.facebook || null,
          website: formData.socialLinks.website || null,
        },
      };

      const updatedUser = await UserService.updateProfile(updateData);

      if (updateUser) {
        await updateUser(updatedUser);
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
      setErrors({});
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert('Erro', error.message || 'Falha ao atualizar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const canGoBack = router.canGoBack();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Theme.colors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Perfil Completo</Text>
          {!isEditing && (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="pencil" size={20} color={Theme.colors.primary} />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Card */}
        <View style={styles.card}>
          {/* Profile Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={Theme.colors.primary} />
            </View>
          </View>

          {/* Editable Fields */}
          <EditableProfileField
            label="Nome Completo"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            isEditing={isEditing}
            required
            error={errors.name}
          />

          <EditableProfileField
            label="Idade"
            value={formData.age}
            onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
            isEditing={isEditing}
            keyboardType="numeric"
            error={errors.age}
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Gênero {isEditing && <Text style={styles.required}>*</Text>}
            </Text>
            {isEditing ? (
              <View style={styles.genderOptions}>
                {[
                  { label: 'Masculino', value: Gender.Male },
                  { label: 'Feminino', value: Gender.Female },
                  { label: 'Outro', value: Gender.Other },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      formData.gender === option.value && styles.genderOptionSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, gender: option.value }))}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        formData.gender === option.value && styles.genderOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.fieldValue}>
                {formData.gender === Gender.Male ? 'Masculino' : formData.gender === Gender.Female ? 'Feminino' : 'Outro'}
              </Text>
            )}
          </View>

          <EditableProfileField
            label="E-mail"
            value={user?.email || ''}
            onChangeText={() => {}}
            isEditing={false}
          />

          <EditableProfileField
            label="Telefone"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            isEditing={isEditing}
            keyboardType="phone-pad"
          />

          <EditableProfileField
            label="Anos de Experiência"
            value={formData.yearsOfExperience}
            onChangeText={(text) => setFormData(prev => ({ ...prev, yearsOfExperience: text }))}
            isEditing={isEditing}
            keyboardType="numeric"
          />

          <EditableProfileField
            label="Biografia / Descrição"
            value={formData.bio}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
            isEditing={isEditing}
            multiline
            numberOfLines={4}
          />

          <EditableProfileField
            label="Certificações"
            value={formData.certifications}
            onChangeText={(text) => setFormData(prev => ({ ...prev, certifications: text }))}
            isEditing={isEditing}
            multiline
            numberOfLines={3}
          />

          <EditableProfileField
            label="Especializações"
            value={formData.specializations}
            onChangeText={(text) => setFormData(prev => ({ ...prev, specializations: text }))}
            isEditing={isEditing}
            multiline
            numberOfLines={3}
          />

          {/* Social Links */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Links Sociais</Text>
            {isEditing ? (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Instagram (@usuário ou URL)"
                  placeholderTextColor={Theme.colors.textTertiary}
                  value={formData.socialLinks.instagram}
                  onChangeText={(text) =>
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: text }
                    }))
                  }
                />
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Facebook (usuário ou URL)"
                  placeholderTextColor={Theme.colors.textTertiary}
                  value={formData.socialLinks.facebook}
                  onChangeText={(text) =>
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, facebook: text }
                    }))
                  }
                />
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Website (https://...)"
                  placeholderTextColor={Theme.colors.textTertiary}
                  value={formData.socialLinks.website}
                  onChangeText={(text) =>
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, website: text }
                    }))
                  }
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            ) : (
              <View style={styles.socialLinksDisplay}>
                {formData.socialLinks.instagram && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => {
                      const url = formData.socialLinks.instagram.startsWith('http')
                        ? formData.socialLinks.instagram
                        : `https://instagram.com/${formData.socialLinks.instagram.replace('@', '')}`;
                      Linking.openURL(url);
                    }}
                  >
                    <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                    <Text style={styles.socialText}>{formData.socialLinks.instagram}</Text>
                  </TouchableOpacity>
                )}
                {formData.socialLinks.facebook && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => {
                      const url = formData.socialLinks.facebook.startsWith('http')
                        ? formData.socialLinks.facebook
                        : `https://facebook.com/${formData.socialLinks.facebook}`;
                      Linking.openURL(url);
                    }}
                  >
                    <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                    <Text style={styles.socialText}>{formData.socialLinks.facebook}</Text>
                  </TouchableOpacity>
                )}
                {formData.socialLinks.website && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => Linking.openURL(formData.socialLinks.website)}
                  >
                    <Ionicons name="globe-outline" size={20} color={Theme.colors.primary} />
                    <Text style={styles.socialText}>{formData.socialLinks.website}</Text>
                  </TouchableOpacity>
                )}
                {!formData.socialLinks.instagram && !formData.socialLinks.facebook && !formData.socialLinks.website && (
                  <Text style={styles.emptyValue}>Nenhum link social adicionado</Text>
                )}
              </View>
            )}
          </View>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Theme.colors.textOnPrimary} />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                )}
              </TouchableOpacity>
            </View>
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
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Theme.colors.primaryLight,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.darkerGray,
    marginLeft: 4,
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
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.gray700,
    marginBottom: 8,
  },
  required: {
    color: Theme.colors.error,
  },
  fieldValue: {
    fontSize: 15,
    color: Theme.colors.textPrimary,
    paddingVertical: 8,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.colors.gray300,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
  },
  genderOptionSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primaryLight,
  },
  genderOptionText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  genderOptionTextSelected: {
    color: Theme.colors.darkerGray,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Theme.colors.gray100,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  saveButton: {
    backgroundColor: Theme.colors.primary,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textOnPrimary,
  },
  socialLinksDisplay: {
    marginTop: 8,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Theme.colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  socialText: {
    fontSize: 14,
    color: Theme.colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  input: {
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Theme.colors.textPrimary,
  },
  emptyValue: {
    fontSize: 14,
    color: Theme.colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 24,
  },
});
