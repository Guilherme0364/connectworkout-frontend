import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
	Platform,
	ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthContext } from '../../../contexts/AuthContext';
import StatCard from '../../../components/dashboard/StatCard';
import { InstructorService, WorkoutService } from '../../../services';

export default function CoachProfile() {
	const { user, logout } = useAuth();
	const { isAuthenticated, isLoading: authLoading } = useAuthContext();
	const router = useRouter();
	const [studentsCount, setStudentsCount] = useState(0);
	const [totalWorkouts, setTotalWorkouts] = useState(0);
	const [loadingStats, setLoadingStats] = useState(true);

	// Load statistics on mount, but only if authenticated
	useEffect(() => {
		// Wait for auth check to complete
		if (authLoading) {
			return;
		}

		// Only fetch if authenticated
		if (isAuthenticated) {
			loadStatistics();
		} else {
			setLoadingStats(false);
		}
	}, [authLoading, isAuthenticated]);

	const loadStatistics = async () => {
		try {
			setLoadingStats(true);

			// Fetch all students
			const studentsData = await InstructorService.getStudents();
			setStudentsCount(studentsData.length);

			// Fetch workouts for each student in parallel
			const workoutsPromises = studentsData.map(student =>
				WorkoutService.getStudentWorkouts(student.id).catch(() => [])
			);
			const workoutsArrays = await Promise.all(workoutsPromises);

			// Calculate total count
			const total = workoutsArrays.reduce((sum, workouts) => sum + workouts.length, 0);
			setTotalWorkouts(total);
		} catch (error: any) {
			console.error('Failed to load statistics:', error);
			// Don't show error to user for 401 errors
			// For other errors, just keep counts at 0
		} finally {
			setLoadingStats(false);
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
							<Text style={styles.userName}>{user?.name || 'Coach'}</Text>
							<Text style={styles.userEmail}>{user?.email || ''}</Text>
							<View style={styles.badge}>
								<Ionicons name="fitness" size={14} color="#BBF246" />
								<Text style={styles.badgeText}>Personal Trainer</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Statistics */}
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Estatísticas</Text>
				</View>

				{loadingStats ? (
					<View style={styles.statsLoadingContainer}>
						<ActivityIndicator size="small" color="#BBF246" />
						<Text style={styles.statsLoadingText}>Carregando estatísticas...</Text>
					</View>
				) : (
					<View style={styles.statsRow}>
						<StatCard
							title="Total de Alunos"
							value={studentsCount}
							subtitle="cadastrados"
							icon="people"
							color="#BBF246"
						/>
						<StatCard
							title="Treinos Criados"
							value={totalWorkouts}
							subtitle="no total"
							icon="barbell"
							color="#10B981"
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
		marginBottom: 8,
	},
	badge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#EFF6FF',
		alignSelf: 'flex-start',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		gap: 4,
	},
	badgeText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#BBF246',
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
	statsLoadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 24,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		marginBottom: 16,
	},
	statsLoadingText: {
		marginLeft: 12,
		fontSize: 14,
		color: '#6B7280',
	},
	statsRow: {
		flexDirection: 'row',
		marginBottom: 16,
		marginHorizontal: -4,
	},
	statsContainer: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 16,
	},
	statCard: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
	},
	statValue: {
		fontSize: 24,
		fontWeight: '700',
		color: '#111827',
		marginTop: 8,
	},
	statLabel: {
		fontSize: 12,
		color: '#6B7280',
		marginTop: 4,
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
