import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useStudent } from '../../../contexts/StudentContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../../../components/EmptyState';

export default function StudentDashboard() {
	const { hasTrainer, trainerRequests, dashboardData, isLoading, refreshStudentData } = useStudent();
	const router = useRouter();

	useEffect(() => {
		// Load student data when component mounts
		refreshStudentData();
	}, []);

	// Show loading state
	if (isLoading && !dashboardData) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#BBF246" />
					<Text style={styles.loadingText}>Carregando...</Text>
				</View>
			</SafeAreaView>
		);
	}

	const pendingRequests = trainerRequests.filter(req => req.status === 'pending');

	// Show empty state if student has no trainer
	if (!hasTrainer) {
		return (
			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.header}>
						<Text style={styles.greeting}>Connect Workout</Text>
						<Text style={styles.welcomeText}>Bem-vindo ao seu treino personalizado</Text>
					</View>

					<View style={styles.emptyStateCard}>
						<EmptyState
							icon="fitness-outline"
							title="Você ainda não possui treinos"
							description="Aguarde um personal trainer aceitar sua solicitação ou enviar convite para começar"
							iconColor="#BBF246"
						/>

						{pendingRequests.length > 0 && (
							<>
								<View style={styles.requestsInfo}>
									<Ionicons name="mail-outline" size={20} color="#BBF246" />
									<Text style={styles.requestsText}>
										Você possui {pendingRequests.length} {pendingRequests.length === 1 ? 'solicitação pendente' : 'solicitações pendentes'}
									</Text>
								</View>
								<TouchableOpacity
									style={styles.primaryButton}
									onPress={() => router.push('/student/personal-requests')}
								>
									<Text style={styles.primaryButtonText}>Ver Solicitações</Text>
								</TouchableOpacity>
							</>
						)}
					</View>

					{/* Help Card */}
					<View style={styles.helpCard}>
						<Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
						<View style={styles.helpContent}>
							<Text style={styles.helpTitle}>Como começar?</Text>
							<Text style={styles.helpText}>
								• Aguarde um personal trainer enviar uma solicitação{'\n'}
								• Aceite a solicitação nas notificações{'\n'}
								• Comece seus treinos personalizados!
							</Text>
						</View>
					</View>

					<View style={styles.bottomSpacing} />
				</ScrollView>
			</SafeAreaView>
		);
	}

	// Show normal dashboard if student has trainer
	return <StudentDashboardWithTrainer />;
}

function StudentDashboardWithTrainer() {
	const { dashboardData } = useStudent();
	const router = useRouter();

	if (!dashboardData) return null;

	const { currentTrainer, workoutCount, exerciseCount, activeWorkoutId, studentName } = dashboardData;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.greeting}>Bem-vindo, {studentName}!</Text>
					<Text style={styles.welcomeText}>Continue seu progresso</Text>
				</View>

				{/* Stats Cards */}
				<View style={styles.statsContainer}>
					<View style={styles.statCard}>
						<Ionicons name="fitness-outline" size={32} color="#007AFF" />
						<Text style={styles.statNumber}>{workoutCount}</Text>
						<Text style={styles.statLabel}>Treinos</Text>
					</View>

					<View style={styles.statCard}>
						<Ionicons name="checkmark-circle-outline" size={32} color="#4CAF50" />
						<Text style={styles.statNumber}>{activeWorkoutId ? '1' : '0'}</Text>
						<Text style={styles.statLabel}>Ativo</Text>
					</View>

					<View style={styles.statCard}>
						<Ionicons name="barbell-outline" size={32} color="#FF9800" />
						<Text style={styles.statNumber}>{exerciseCount}</Text>
						<Text style={styles.statLabel}>Exercícios</Text>
					</View>
				</View>

				{/* Active Workout CTA */}
				{activeWorkoutId ? (
					<TouchableOpacity
						style={styles.activeWorkoutButton}
						onPress={() => router.push({
							pathname: '/(private)/(student)/(workout)/workout-detail',
							params: { workoutId: activeWorkoutId.toString() }
						})}
					>
						<Ionicons name="play-circle" size={24} color="#fff" />
						<Text style={styles.activeWorkoutText}>Começar Treino Ativo</Text>
					</TouchableOpacity>
				) : (
					<View style={styles.emptyStateCard}>
						<EmptyState
							icon="barbell-outline"
							title="Aguardando treinos"
							description="Seu personal trainer adicionará seus treinos em breve. Você será notificado quando os treinos estiverem disponíveis."
							iconColor="#BBF246"
						/>
					</View>
				)}

				{/* Trainer Info Card */}
				{currentTrainer && (
					<View style={styles.trainerCard}>
						<View style={styles.trainerCardHeader}>
							<Ionicons name="person-circle-outline" size={24} color="#BBF246" />
							<Text style={styles.trainerCardTitle}>Seu Personal Trainer</Text>
						</View>
						<View style={styles.trainerCardContent}>
							<View style={styles.trainerCardRow}>
								<Text style={styles.trainerCardLabel}>Nome:</Text>
								<Text style={styles.trainerCardValue}>{currentTrainer.name}</Text>
							</View>
							<View style={styles.trainerCardRow}>
								<Text style={styles.trainerCardLabel}>Email:</Text>
								<Text style={styles.trainerCardValue}>{currentTrainer.email}</Text>
							</View>
							{currentTrainer.description && (
								<View style={styles.trainerCardRow}>
									<Text style={styles.trainerCardLabel}>Sobre:</Text>
									<Text style={styles.trainerCardValue}>{currentTrainer.description}</Text>
								</View>
							)}
							<View style={styles.trainerCardRow}>
								<Text style={styles.trainerCardLabel}>Alunos:</Text>
								<Text style={styles.trainerCardValue}>{currentTrainer.studentCount} {currentTrainer.studentCount === 1 ? 'aluno' : 'alunos'}</Text>
							</View>
						</View>
					</View>
				)}

				{/* Info Card */}
				<View style={styles.infoCard}>
					<Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
					<View style={styles.infoContent}>
						<Text style={styles.infoTitle}>Dicas para Treinar</Text>
						<Text style={styles.infoText}>
							• Mantenha a constância nos treinos{'\n'}
							• Hidrate-se antes, durante e depois{'\n'}
							• Respeite os tempos de descanso{'\n'}
							• Em caso de dúvidas, consulte seu personal
						</Text>
					</View>
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
	header: {
		paddingTop: 16,
		paddingBottom: 24,
	},
	greeting: {
		fontSize: 28,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 4,
	},
	welcomeText: {
		fontSize: 16,
		color: '#6B7280',
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
	emptyStateCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 24,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	requestsInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F0F9FF',
		padding: 12,
		borderRadius: 8,
		marginTop: 16,
		gap: 8,
	},
	requestsText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#111827',
	},
	primaryButton: {
		backgroundColor: '#BBF246',
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 12,
	},
	primaryButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1A1A1A',
	},
	helpCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
		flexDirection: 'row',
		gap: 16,
	},
	helpContent: {
		flex: 1,
	},
	helpTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 8,
	},
	helpText: {
		fontSize: 14,
		color: '#6B7280',
		lineHeight: 20,
	},
	statsContainer: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 16,
	},
	statCard: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#111827',
		marginTop: 8,
	},
	statLabel: {
		fontSize: 12,
		color: '#6B7280',
		marginTop: 4,
	},
	activeWorkoutButton: {
		flexDirection: 'row',
		backgroundColor: '#4CAF50',
		padding: 16,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	activeWorkoutText: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	trainerCard: {
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
	trainerCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		gap: 12,
	},
	trainerCardTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
	},
	trainerCardContent: {
		gap: 12,
	},
	trainerCardRow: {
		flexDirection: 'column',
	},
	trainerCardLabel: {
		fontSize: 12,
		fontWeight: '500',
		color: '#6B7280',
		marginBottom: 4,
	},
	trainerCardValue: {
		fontSize: 15,
		color: '#111827',
		lineHeight: 22,
	},
	infoCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
		flexDirection: 'row',
		gap: 16,
	},
	infoContent: {
		flex: 1,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 8,
	},
	infoText: {
		fontSize: 14,
		color: '#6B7280',
		lineHeight: 20,
	},
	bottomSpacing: {
		height: 20,
	},
});
