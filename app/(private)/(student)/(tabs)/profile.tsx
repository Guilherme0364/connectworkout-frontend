import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
} from 'react-native';
import { Theme } from '../../../styles/theme';
import { useStudent } from '../../../contexts/StudentContext';
import { useAuth } from '../../../hooks/useAuth';
import { UserService } from '../../../services';

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { hasTrainer, currentTrainer, disconnectTrainer } = useStudent();

  const [loggingOut, setLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos de senha');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erro', 'As senhas novas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Erro', 'A senha nova deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setSaving(true);
      await UserService.updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setShowPasswordChange(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      Alert.alert('Erro', error.message || 'Falha ao alterar senha. Verifique sua senha atual.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    const confirmed = Platform.OS === 'web'
      ? window.confirm('Tem certeza que deseja sair?')
      : await new Promise((resolve) => {
          Alert.alert(
            'Sair',
            'Tem certeza que deseja sair?',
            [
              { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Sair', style: 'destructive', onPress: () => resolve(true) },
            ]
          );
        });

    if (!confirmed) return;

    try {
      setLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
      Alert.alert('Erro', 'Falha ao sair. Tente novamente.');
    }
  };

  const handleDisconnectTrainer = () => {
    if (!currentTrainer) return;

    Alert.alert(
      'Cancelar Conexão',
      `Tem certeza que deseja cancelar a conexão com ${currentTrainer.name}?\n\nVocê perderá o acesso aos treinos atuais.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnectTrainer();
              Alert.alert('Sucesso', 'Conexão cancelada com sucesso!');
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Falha ao cancelar conexão.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    if (isDeletingAccount) return;

    // First confirmation
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.\n\nSerá excluído permanentemente:\n\n• Seu perfil de aluno\n• Conexões com personal trainers\n• Treinos e histórico de exercícios\n• Todos os seus dados',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: showFinalDeleteConfirmation
        }
      ]
    );
  };

  const showFinalDeleteConfirmation = () => {
    // Second confirmation (final warning)
    Alert.alert(
      'Confirmação Final',
      'ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nTodos os seus dados serão permanentemente excluídos e não poderão ser recuperados.\n\nDeseja realmente excluir sua conta?',
      [
        {
          text: 'Não, manter minha conta',
          style: 'cancel'
        },
        {
          text: 'Sim, excluir permanentemente',
          style: 'destructive',
          onPress: confirmDeleteAccount
        }
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);

      // Call API to delete account
      await UserService.deleteStudentAccount();

      // Success - account deleted
      // Use the logout function which will clear storage and navigate to login
      await logout();

      // Show success message after navigation
      setTimeout(() => {
        Alert.alert(
          'Conta Excluída',
          'Sua conta foi excluída com sucesso.',
          [{ text: 'OK' }]
        );
      }, 500);
    } catch (error: any) {
      console.error('Delete account error:', error);
      setIsDeletingAccount(false);

      let errorMessage = 'Ocorreu um erro ao excluir a conta. Por favor, tente novamente.';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Você não tem permissão para realizar esta ação.';
      } else if (!error.response) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }

      Alert.alert('Erro ao Excluir Conta', errorMessage, [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        {/* Profile Header Card */}
        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={Theme.colors.primary} />
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'Aluno'}</Text>
          <Text style={styles.userRole}>Aluno</Text>
        </View>

        {/* Profile Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Meu Perfil</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={Theme.colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>
          </View>

          {user?.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={Theme.colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={() => router.push('/(private)/(student)/detailed-profile')}
          >
            <Text style={styles.viewProfileButtonText}>Ver Perfil Completo</Text>
            <Ionicons name="arrow-forward" size={18} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Trainer Card */}
        {hasTrainer && currentTrainer && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meu Personal</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.trainerHeader}>
                <View style={styles.trainerAvatar}>
                  <Ionicons name="person" size={32} color={Theme.colors.primary} />
                </View>
                <View style={styles.trainerInfo}>
                  <Text style={styles.trainerName}>{currentTrainer.name}</Text>
                  <Text style={styles.trainerEmail}>{currentTrainer.email}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={handleDisconnectTrainer}
              >
                <Ionicons name="person-remove-outline" size={18} color={Theme.colors.error} />
                <Text style={styles.disconnectButtonText}>Cancelar conexão</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* App Information Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={Theme.colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Versão</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>

          <View style={styles.appDescription}>
            <Text style={styles.appDescriptionText}>
              ConnectWorkout - Sua plataforma de treinos
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={() => router.push('/(private)/(student)/app-info')}
          >
            <Text style={styles.viewProfileButtonText}>Ver Informações Completas</Text>
            <Ionicons name="arrow-forward" size={18} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ações da Conta</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setShowPasswordChange(!showPasswordChange)}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: Theme.colors.primaryLight }]}>
                <Ionicons name="key-outline" size={20} color={Theme.colors.darkerGray} />
              </View>
              <Text style={styles.actionText}>Alterar Senha</Text>
            </View>
            <Ionicons
              name={showPasswordChange ? 'chevron-up' : 'chevron-forward'}
              size={20}
              color={Theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {showPasswordChange && (
            <View style={styles.passwordSection}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Senha Atual"
                placeholderTextColor={Theme.colors.textTertiary}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                secureTextEntry
              />
              <TextInput
                style={styles.passwordInput}
                placeholder="Nova Senha"
                placeholderTextColor={Theme.colors.textTertiary}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                secureTextEntry
              />
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmar Nova Senha"
                placeholderTextColor={Theme.colors.textTertiary}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.button, styles.saveButton, styles.fullWidthButton]}
                onPress={handleChangePassword}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Theme.colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Atualizar Senha</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: Theme.colors.errorLight }]}>
                {loggingOut ? (
                  <ActivityIndicator size="small" color={Theme.colors.error} />
                ) : (
                  <Ionicons name="log-out-outline" size={20} color={Theme.colors.error} />
                )}
              </View>
              <Text style={[styles.actionText, { color: Theme.colors.error }]}>
                {loggingOut ? 'Saindo...' : 'Sair'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.error} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleDeleteAccount}
            disabled={isDeletingAccount}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: Theme.colors.errorLight }]}>
                {isDeletingAccount ? (
                  <ActivityIndicator size="small" color="#dc2626" />
                ) : (
                  <Ionicons name="trash-outline" size={20} color="#dc2626" />
                )}
              </View>
              <Text style={[styles.actionText, { color: '#dc2626' }]}>
                {isDeletingAccount ? 'Excluindo...' : 'Excluir Conta'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#dc2626" />
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
  header: {
    paddingTop: 16,
    paddingBottom: 24,
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
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
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
  userRole: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
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
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Theme.colors.primaryLight,
    borderRadius: 8,
    marginTop: 16,
  },
  viewProfileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.darkerGray,
    marginRight: 8,
  },
  appDescription: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  appDescriptionText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
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
  trainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: 2,
  },
  trainerEmail: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Theme.colors.errorLight,
    borderRadius: 8,
    marginTop: 8,
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.error,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: 12,
  },
  actionItem: {
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
  passwordSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  passwordInput: {
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: Theme.colors.primary,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textOnPrimary,
  },
  fullWidthButton: {
    marginTop: 12,
  },
  bottomSpacing: {
    height: 24,
  },
});
