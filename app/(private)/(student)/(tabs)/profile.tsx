import React, { useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
	ActivityIndicator,
	Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useStudent } from '../../../contexts/StudentContext';
import EmptyState from '../../../components/EmptyState';

export default function StudentProfile() {
	const { user, logout } = useAuth();
	const router = useRouter();
	const {
		hasTrainer,
		currentTrainer,
		profile,
		isLoading,
		loadCurrentTrainer,
		loadProfile,
		disconnectTrainer,
	} = useStudent();

	useEffect(() => {
		loadProfile();
		loadCurrentTrainer();
	}, []);

	const handleDisconnectTrainer = () => {
		if (!currentTrainer) return;

		const message = `Tem certeza que deseja cancelar a conexão com ${currentTrainer.name}?`;
		const confirmed = Platform.OS === 'web'
			? window.confirm(message)
			: true;

		if (confirmed) {
			disconnectTrainer()
				.then(() => {
					if (Platform.OS === 'web') {
						window.alert('Conexão cancelada com sucesso!');
					}
				})
				.catch((err: any) => {
					if (Platform.OS === 'web') {
						window.alert(err.message || 'Falha ao cancelar conexão');
					}
				});
		}
	};

	const handleLogout = async () => {
		const confirmed = Platform.OS === 'web'
			? window.confirm('Tem certeza que deseja sair?')
			: true;

		if (confirmed) {
			try {
				console.log('🔴 Starting logout...');

				// Navigate FIRST to avoid seeing any errors during state clearing
				if (Platform.OS === 'web') {
					console.log('🔄 Navigating to login...');
					window.location.href = '/';
					// Logout will happen in the background as page unloads
					await logout();
				} else {
					// On native, navigate then logout
					router.replace('/(auth)/sign-in');
					setTimeout(async () => {
						await logout();
						console.log('✅ Logout completed');
					}, 100);
				}
			} catch (error) {
				console.error('Logout failed:', error);
				if (Platform.OS === 'web') {
					window.alert('Erro ao fazer logout. Tente novamente.');
				}
			}
		}
	};

	if (isLoading && !profile) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#3B82F6" />
					<Text style={styles.loadingText}>Carregando...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>Meu Perfil</Text>
				</View>

				{/* User Info Card */}
				<View style={styles.card}>
					<View style={styles.userInfo}>
						<View style={styles.avatar}>
							<Ionicons name="person" size={40} color="#3B82F6" />
						</View>
						<View style={styles.userDetails}>
							<Text style={styles.userName}>{profile?.name || user?.name || 'Aluno'}</Text>
							<Text style={styles.userEmail}>{profile?.email || user?.email || ''}</Text>
						</View>
					</View>
				</View>

				{/* Trainer Section */}
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Meu Personal</Text>
				</View>

				{hasTrainer && currentTrainer ? (
					<View style={styles.card}>
						<View style={styles.trainerHeader}>
							<View style={styles.trainerAvatar}>
								<Ionicons name="person" size={32} color="#3B82F6" />
							</View>
							<View style={styles.trainerInfo}>
								<Text style={styles.trainerName}>{currentTrainer.name}</Text>
								<Text style={styles.trainerEmail}>{currentTrainer.email}</Text>
								{currentTrainer.studentCount !== undefined && (
									<Text style={styles.trainerStats}>
										{currentTrainer.studentCount}{' '}
										{currentTrainer.studentCount === 1 ? 'aluno' : 'alunos'}
									</Text>
								)}
							</View>
						</View>

						{currentTrainer.description && (
							<View style={styles.trainerDetail}>
								<Text style={styles.detailLabel}>Sobre:</Text>
								<Text style={styles.detailValue}>{currentTrainer.description}</Text>
							</View>
						)}

						<TouchableOpacity
							style={styles.disconnectButton}
							onPress={handleDisconnectTrainer}
						>
							<Text style={styles.disconnectButtonText}>Cancelar conexão com personal</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.card}>
						<EmptyState
							icon="person-add-outline"
							title="Nenhum personal conectado"
							description="Aguarde seu personal adicionar os treinos e começe agora!"
							iconColor="#9CA3AF"
						/>
					</View>
				)}

				{/* Quick Actions */}
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Ações</Text>
				</View>

				<View style={styles.card}>
					<TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
						<View style={styles.actionLeft}>
							<View style={[styles.actionIcon, styles.actionIconDanger]}>
								<Ionicons name="log-out-outline" size={20} color="#EF4444" />
							</View>
							<Text style={[styles.actionText, styles.actionTextDanger]}>Sair</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color="#EF4444" />
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
		marginTop: 16,
		fontSize: 16,
		color: '#6B7280',
	},
	header: {
		paddingTop: 16,
		paddingBottom: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: '#111827',
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: '#EFF6FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	userDetails: {
		flex: 1,
	},
	userName: {
		fontSize: 20,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 4,
	},
	userEmail: {
		fontSize: 14,
		color: '#6B7280',
	},
	sectionHeader: {
		marginTop: 8,
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
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
		backgroundColor: '#EFF6FF',
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
		color: '#111827',
		marginBottom: 2,
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
	trainerDetail: {
		marginBottom: 12,
	},
	detailLabel: {
		fontSize: 12,
		fontWeight: '500',
		color: '#6B7280',
		marginBottom: 4,
	},
	detailValue: {
		fontSize: 14,
		color: '#111827',
	},
	disconnectButton: {
		marginTop: 16,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#EF4444',
		alignItems: 'center',
	},
	disconnectButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#EF4444',
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
		backgroundColor: '#F9FAFB',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	actionIconDanger: {
		backgroundColor: '#FEF2F2',
	},
	actionText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#111827',
	},
	actionTextDanger: {
		color: '#EF4444',
	},
	bottomSpacing: {
		height: 24,
	},
});
