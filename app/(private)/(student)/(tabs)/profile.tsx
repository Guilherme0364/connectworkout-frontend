import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
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
} from 'react-native';
import { useStudent } from '../../../contexts/StudentContext';
import { useAuth } from '../../../hooks/useAuth';

export default function StudentProfile() {
	const { user, logout } = useAuth();
	const router = useRouter();
	const {
		hasTrainer,
		currentTrainer,
		profile,
		isLoading,
		loadDashboard,
		disconnectTrainer,
	} = useStudent();

	useEffect(() => {
		// Load dashboard data which includes profile and trainer info
		loadDashboard();
	}, []);

	const handleDisconnectTrainer = () => {
		if (!currentTrainer) return;

		Alert.alert(
			'Cancelar Conexão',
			`Tem certeza que deseja cancelar a conexão com ${currentTrainer.name}?\n\nVocê perderá o acesso aos treinos atuais e precisará aceitar uma nova solicitação para continuar.`,
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Confirmar',
					style: 'destructive',
					onPress: async () => {
						try {
							await disconnectTrainer();
							Alert.alert(
								'Sucesso',
								'Conexão cancelada com sucesso! Você pode aceitar uma nova solicitação de personal trainer.',
								[{ text: 'OK' }]
							);
						} catch (err: any) {
							Alert.alert(
								'Erro',
								err.message || 'Falha ao cancelar conexão. Tente novamente.'
							);
						}
					},
				},
			]
		);
	};

	const handleLogout = async () => {
		console.log('🔴 StudentProfile.handleLogout invoked');

		if (Platform.OS === 'web') {
			// Use native confirm on web to ensure dialog appears in browser and logs happen
			const confirmed = window.confirm('Tem certeza que deseja sair da sua conta?');
			if (!confirmed) {
				console.log('Logout cancelled (web)');
				return;
			}

			try {
				console.log('🔴 Starting logout (web)...');
				// logout() from AuthContext handles everything:
				// - Calls backend logout API
				// - Calls globalLogout() which clears storage and state
				// - globalLogout() also handles navigation
				await logout();
				console.log('✅ Logout completed (web)');
			} catch (error) {
				console.error('Logout failed (web):', error);
				window.alert('Erro ao fazer logout. Tente novamente.');
			}
			return;
		}

		// Native path: show alert confirmation
		Alert.alert(
			'Sair',
			'Tem certeza que deseja sair da sua conta?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Sair',
					style: 'destructive',
					onPress: async () => {
						console.log('🔴 Starting logout (native)...');
						try {
							// logout() from AuthContext handles everything:
							// - Calls backend logout API
							// - Calls globalLogout() which clears storage and state
							// - globalLogout() also handles navigation
							await logout();
							console.log('✅ Logout completed (native)');
						} catch (error) {
							console.error('Logout failed (native):', error);
							Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
						}
					},
				},
			]
		);
	};

	if (isLoading && !profile) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#BBF246" />
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
							<Ionicons name="person" size={40} color="#BBF246" />
						</View>
						<View style={styles.userDetails}>
							<Text style={styles.userName}>{profile?.name || user?.name || 'Aluno'}</Text>
							<Text style={styles.userEmail}>{profile?.email || user?.email || ''}</Text>
						</View>
					</View>
				</View>

				{/* Trainer Section - Only show if student has a trainer */}
				{(hasTrainer || currentTrainer) && (
					<>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Meu Personal</Text>
						</View>

						<View style={styles.card}>
							<View style={styles.trainerHeader}>
								<View style={styles.trainerAvatar}>
									<Ionicons name="person" size={32} color="#BBF246" />
								</View>
								<View style={styles.trainerInfo}>
									<Text style={styles.trainerName}>{currentTrainer?.name || 'Carregando...'}</Text>
									<Text style={styles.trainerEmail}>{currentTrainer?.email || ''}</Text>
									{currentTrainer?.studentCount !== undefined && (
										<Text style={styles.trainerStats}>
											{currentTrainer.studentCount}{' '}
											{currentTrainer.studentCount === 1 ? 'aluno' : 'alunos'}
										</Text>
									)}
								</View>
							</View>

							{currentTrainer?.description && (
								<View style={styles.trainerDetail}>
									<Text style={styles.detailLabel}>Sobre:</Text>
									<Text style={styles.detailValue}>{currentTrainer.description}</Text>
								</View>
							)}

							<TouchableOpacity
								style={styles.disconnectButton}
								onPress={handleDisconnectTrainer}
							>
								<Ionicons name="person-remove-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
								<Text style={styles.disconnectButtonText}>Cancelar conexão</Text>
							</TouchableOpacity>
						</View>
					</>
				)}

				{/* Quick Actions */}
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Ações</Text>
				</View>

				<View style={styles.card}>
					<TouchableOpacity
						style={styles.actionItem}
						onPress={() => {
							console.log('👆 Logout button pressed (student)');
							handleLogout();
						}}
					>
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
		backgroundColor: '#F0F9F0',
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
		backgroundColor: '#F0F9F0',
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
		backgroundColor: '#FEF2F2',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
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
