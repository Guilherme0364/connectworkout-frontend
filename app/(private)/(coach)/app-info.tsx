import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { Theme } from '../../styles/theme';

export default function AppInfo() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url);
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
          <Text style={styles.title}>Sobre o Aplicativo</Text>
        </View>

        {/* App Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="barbell" size={64} color={Theme.colors.primary} />
          </View>
          <Text style={styles.appName}>ConnectWorkout</Text>
          <Text style={styles.appTagline}>Conecte-se, Treine, Transforme</Text>
        </View>

        {/* Version Card */}
        <View style={styles.card}>
          <View style={styles.versionRow}>
            <Ionicons name="information-circle" size={24} color={Theme.colors.primary} />
            <View style={styles.versionInfo}>
              <Text style={styles.versionLabel}>Versão</Text>
              <Text style={styles.versionValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sobre</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.aboutText}>
            ConnectWorkout é uma plataforma completa de gerenciamento de fitness projetada para ajudar personal trainers a gerenciar seus clientes e criar programas de treino eficazes.
          </Text>
          <Text style={styles.aboutText}>
            Com ferramentas intuitivas e poderosas, você pode acompanhar o progresso dos seus alunos, criar treinos personalizados e manter uma comunicação direta com sua base de clientes.
          </Text>
        </View>

        {/* Credits Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Créditos e Tecnologias</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.creditItem}>
            <View style={styles.creditIcon}>
              <Ionicons name="code-slash" size={20} color={Theme.colors.primary} />
            </View>
            <View style={styles.creditInfo}>
              <Text style={styles.creditTitle}>Equipe de Desenvolvimento</Text>
              <Text style={styles.creditDescription}>
                Desenvolvido com dedicação por estudantes e desenvolvedores apaixonados por tecnologia e fitness
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.creditItem}>
            <View style={styles.creditIcon}>
              <Ionicons name="barbell" size={20} color={Theme.colors.secondary} />
            </View>
            <View style={styles.creditInfo}>
              <Text style={styles.creditTitle}>ExerciseDB API</Text>
              <Text style={styles.creditDescription}>
                Banco de dados completo de exercícios com instruções e animações
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.creditItem}>
            <View style={styles.creditIcon}>
              <Ionicons name="logo-react" size={20} color="#61DAFB" />
            </View>
            <View style={styles.creditInfo}>
              <Text style={styles.creditTitle}>React Native & Expo</Text>
              <Text style={styles.creditDescription}>
                Framework multiplataforma para desenvolvimento mobile
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.creditItem}>
            <View style={styles.creditIcon}>
              <Ionicons name="server" size={20} color={Theme.colors.success} />
            </View>
            <View style={styles.creditInfo}>
              <Text style={styles.creditTitle}>Backend .NET</Text>
              <Text style={styles.creditDescription}>
                API robusta e escalável construída com .NET Core
              </Text>
            </View>
          </View>
        </View>

        {/* Links Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Links Úteis</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.')}
          >
            <View style={styles.linkLeft}>
              <Ionicons name="document-text-outline" size={20} color={Theme.colors.textSecondary} />
              <Text style={styles.linkText}>Termos de Serviço</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.')}
          >
            <View style={styles.linkLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Theme.colors.textSecondary} />
              <Text style={styles.linkText}>Política de Privacidade</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.')}
          >
            <View style={styles.linkLeft}>
              <Ionicons name="help-circle-outline" size={20} color={Theme.colors.textSecondary} />
              <Text style={styles.linkText}>Ajuda & Suporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.')}
          >
            <View style={styles.linkLeft}>
              <Ionicons name="mail-outline" size={20} color={Theme.colors.textSecondary} />
              <Text style={styles.linkText}>Contato</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Feito com {' '}
            <Ionicons name="heart" size={14} color={Theme.colors.error} />
            {' '} para a comunidade fitness
          </Text>
          <Text style={styles.footerCopyright}>
            © 2024 ConnectWorkout. Todos os direitos reservados.
          </Text>
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
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
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
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionInfo: {
    marginLeft: 16,
    flex: 1,
  },
  versionLabel: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  versionValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
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
  aboutText: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  creditItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  creditIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creditInfo: {
    flex: 1,
  },
  creditTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  creditDescription: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkText: {
    fontSize: 16,
    color: Theme.colors.textPrimary,
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  footerCopyright: {
    fontSize: 12,
    color: Theme.colors.textTertiary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 24,
  },
});
