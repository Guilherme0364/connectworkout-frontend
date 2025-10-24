import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Pressable,
	TextInput,
	RefreshControl,
	ActivityIndicator,
	Alert,
	Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DashboardCard from '../../../components/dashboard/DashboardCard';
import StatCard from '../../../components/dashboard/StatCard';
import ProgressBar from '../../../components/dashboard/ProgressBar';
import EmptyState from '../../../components/EmptyState';
import { InstructorService } from '../../../services';
import { handleApiError } from '../../../utils/errorHandler';
import { useAuthContext } from '../../../contexts/AuthContext';
import type { StudentSummaryDto } from '../../../types/api.types';

export default function Students() {
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading } = useAuthContext();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');
	const [students, setStudents] = useState<StudentSummaryDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// Fetch students on mount, but only if authenticated
	useEffect(() => {
		// Wait for auth check to complete
		if (authLoading) {
			return;
		}

		// Only fetch if authenticated
		if (isAuthenticated) {
			fetchStudents();
		} else {
			// Not authenticated, stop loading
			setLoading(false);
		}
	}, [authLoading, isAuthenticated]);

	const fetchStudents = async (isRefreshing = false) => {
		try {
			if (isRefreshing) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}

			const data = await InstructorService.getStudents();
			setStudents(data);
		} catch (error: any) {
			// Don't show error UI for 401 - auth context will handle redirect
			if (error?.status !== 401) {
				handleApiError(error, 'Não foi possível carregar os alunos');
			}
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const onRefresh = () => {
		fetchStudents(true);
	};

	const mockStudents = [
		{
			id: 1,
			name: 'Sarah Johnson',
			email: 'sarah@example.com',
			joinDate: '2024-01-01',
			status: 'active',
			workoutsCompleted: 24,
			nextSession: '2024-01-16 14:00',
			progress: 85,
			goals: ['Weight Loss', 'Strength'],
			avatar: '👩',
		},
		{
			id: 2,
			name: 'Mike Davis',
			email: 'mike@example.com',
			joinDate: '2023-12-15',
			status: 'active',
			workoutsCompleted: 31,
			nextSession: '2024-01-15 16:00',
			progress: 92,
			goals: ['Muscle Gain', 'Endurance'],
			avatar: '👨',
		},
		{
			id: 3,
			name: 'Emma Wilson',
			email: 'emma@example.com',
			joinDate: '2024-01-10',
			status: 'new',
			workoutsCompleted: 3,
			nextSession: '2024-01-17 18:00',
			progress: 30,
			goals: ['Flexibility', 'Balance'],
			avatar: '👩‍🦰',
		},
		{
			id: 4,
			name: 'John Smith',
			email: 'john@example.com',
			joinDate: '2023-11-20',
			status: 'inactive',
			workoutsCompleted: 18,
			nextSession: null,
			progress: 60,
			goals: ['Weight Loss'],
			avatar: '👴',
		},
	];

	const filters = [
		{ key: 'all' as const, label: 'Todos', count: students.length },
		{ key: 'active' as const, label: 'Ativos', count: students.filter(s => s.activeWorkoutId).length },
		{ key: 'inactive' as const, label: 'Inativos', count: students.filter(s => !s.activeWorkoutId).length },
	];

	const filteredStudents = students.filter(student => {
		const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			student.email.toLowerCase().includes(searchQuery.toLowerCase());

		let matchesFilter = true;
		if (selectedFilter === 'active') {
			matchesFilter = !!student.activeWorkoutId;
		} else if (selectedFilter === 'inactive') {
			matchesFilter = !student.activeWorkoutId;
		}

		return matchesSearch && matchesFilter;
	});

	// Cross-platform alert helper
	const showAlert = (title: string, message: string) => {
		console.log(`[Alert] ${title}: ${message}`);
		if (Platform.OS === 'web') {
			// Use window.alert for web
			window.alert(`${title}\n\n${message}`);
		} else {
			// Use native Alert for mobile
			Alert.alert(title, message, [{ text: 'OK' }]);
		}
	};

	const handleStudentPress = (studentId: number) => {
		// Navigate to student workout view (their "ficha")
		console.log('🔘 Student card pressed - navigating to workout view');
		router.push(`/(private)/(coach)/student-workout-view?studentId=${studentId}`);
	};

	const handleManageWorkouts = (studentId: number) => {
		// Navigate to manage all workouts for this student
		console.log('🔘 Manage workouts pressed - navigating to student-workouts');
		router.push(`/(private)/(coach)/(workout)/student-workouts?studentId=${studentId}`);
	};

	const handleAddStudent = () => {
		console.log('🔘 handleAddStudent called - navigating to add-student screen');
		router.push('/(private)/(coach)/add-student');
	};

	const handleCreateWorkout = () => {
		console.log('🔘 handleCreateWorkout called - navigating to select student');
		if (filteredStudents.length === 0) {
			showAlert(
				'Nenhum aluno',
				'Você precisa ter alunos cadastrados antes de criar um treino.'
			);
			return;
		}

		// Navigate to select student screen
		router.push('/(private)/(coach)/select-student-workout');
	};

	const getProgress = (student: StudentSummaryDto) => {
		if (student.totalExercisesToday === 0) return 0;
		return Math.round((student.completedExercisesToday / student.totalExercisesToday) * 100);
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#BBF246" />
					<Text style={styles.loadingText}>Carregando alunos...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Meus Alunos</Text>
					<Text style={styles.subtitle}>Gerencie e acompanhe o progresso dos seus alunos</Text>
				</View>

				{/* Student Stats Overview */}
				<View style={styles.statsRow}>
					<StatCard
						title="Total de Alunos"
						value={students.length}
						subtitle="cadastrados"
						icon="people"
						color="#BBF246"
					/>
					<StatCard
						title="Alunos Ativos"
						value={students.filter(s => s.activeWorkoutId).length}
						subtitle="com treino ativo"
						icon="fitness"
						color="#10B981"
					/>
				</View>

				{/* Search Bar */}
				<View style={styles.searchContainer}>
					<Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
					<TextInput
						style={styles.searchInput}
						placeholder="Search students..."
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholderTextColor="#9CA3AF"
					/>
				</View>

				{/* Filter Tabs */}
				<View style={styles.filterContainer}>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{filters.map((filter) => (
							<Pressable
								key={filter.key}
								style={[
									styles.filterTab,
									selectedFilter === filter.key && styles.filterTabActive,
								]}
								onPress={() => setSelectedFilter(filter.key)}
							>
								<Text
									style={[
										styles.filterTabText,
										selectedFilter === filter.key && styles.filterTabTextActive,
									]}
								>
									{filter.label} ({filter.count})
								</Text>
							</Pressable>
						))}
					</ScrollView>
				</View>

				{/* Students List */}
				{filteredStudents.length === 0 ? (
					<EmptyState
						icon="people-outline"
						title="Nenhum aluno encontrado"
						description={
							searchQuery
								? 'Tente ajustar sua busca'
								: 'Você ainda não possui alunos cadastrados'
						}
					/>
				) : (
					<View style={styles.studentsList}>
						{filteredStudents.map((student) => (
							<DashboardCard
								key={student.id}
								title=""
								onPress={() => handleStudentPress(student.id)}
							>
								<View style={styles.studentCard}>
									<View style={styles.studentHeader}>
										<View style={styles.studentAvatar}>
											<Ionicons name="person" size={24} color="#BBF246" />
										</View>
										<View style={styles.studentInfo}>
											<Text style={styles.studentName}>{student.name}</Text>
											<Text style={styles.studentEmail}>{student.email}</Text>
											<View style={styles.studentMeta}>
												<View
													style={[
														styles.statusBadge,
														{
															backgroundColor: student.activeWorkoutId
																? '#10B98115'
																: '#EF444415',
														},
													]}
												>
													<Text
														style={[
															styles.statusText,
															{
																color: student.activeWorkoutId ? '#10B981' : '#EF4444',
															},
														]}
													>
														{student.activeWorkoutId ? 'Ativo' : 'Inativo'}
													</Text>
												</View>
											</View>
										</View>
										<View style={styles.studentCardActions}>
											<Pressable
												style={styles.manageWorkoutsButton}
												onPress={(e) => {
													e.stopPropagation();
													handleManageWorkouts(student.id);
												}}
											>
												<Ionicons name="create-outline" size={18} color="#BBF246" />
											</Pressable>
											<Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
										</View>
									</View>

									{student.activeWorkoutName && (
										<View style={styles.activeWorkout}>
											<Ionicons name="barbell-outline" size={16} color="#6B7280" />
											<Text style={styles.activeWorkoutText}>
												Treino: {student.activeWorkoutName}
											</Text>
										</View>
									)}

									{student.totalExercisesToday > 0 && (
										<>
											<View style={styles.studentStats}>
												<View style={styles.stat}>
													<Text style={styles.statValue}>
														{student.completedExercisesToday}
													</Text>
													<Text style={styles.statLabel}>Concluídos</Text>
												</View>
												<View style={styles.stat}>
													<Text style={styles.statValue}>
														{student.totalExercisesToday}
													</Text>
													<Text style={styles.statLabel}>Total Hoje</Text>
												</View>
												<View style={styles.stat}>
													<Text style={styles.statValue}>{getProgress(student)}%</Text>
													<Text style={styles.statLabel}>Progresso</Text>
												</View>
											</View>

											<ProgressBar
												value={getProgress(student)}
												label="Progresso de Hoje"
												color="#BBF246"
												showPercentage={false}
											/>
										</>
									)}
								</View>
							</DashboardCard>
						))}
					</View>
				)}

				{/* Quick Actions */}
				<DashboardCard
					title="Ações Rápidas"
					icon="flash-outline"
					color="#8B5CF6"
				>
					<View style={styles.quickActions}>
						<Pressable style={styles.actionButton} onPress={handleAddStudent}>
							<View style={[styles.actionIcon, { backgroundColor: '#BBF24615' }]}>
								<Ionicons name="person-add" size={24} color="#BBF246" />
							</View>
							<Text style={styles.actionText}>Adicionar Aluno</Text>
						</Pressable>
						<Pressable style={styles.actionButton} onPress={handleCreateWorkout}>
							<View style={[styles.actionIcon, { backgroundColor: '#10B98115' }]}>
								<Ionicons name="barbell" size={24} color="#10B981" />
							</View>
							<Text style={styles.actionText}>Criar Treino</Text>
						</Pressable>
					</View>
				</DashboardCard>

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
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 16,
		color: '#6B7280',
	},
	statsRow: {
		flexDirection: 'row',
		marginBottom: 24,
		marginHorizontal: -4,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
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
	searchIcon: {
		marginRight: 12,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: '#111827',
	},
	filterContainer: {
		marginBottom: 24,
	},
	filterTab: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 8,
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 2,
	},
	filterTabActive: {
		backgroundColor: '#BBF246',
	},
	filterTabText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#6B7280',
	},
	filterTabTextActive: {
		color: '#FFFFFF',
	},
	studentsList: {
		marginBottom: 24,
	},
	studentCard: {
		padding: 0,
	},
	studentHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 16,
	},
	studentAvatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#F3F4F6',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	avatarText: {
		fontSize: 24,
	},
	studentInfo: {
		flex: 1,
	},
	studentName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 2,
	},
	studentEmail: {
		fontSize: 14,
		color: '#6B7280',
		marginBottom: 8,
	},
	studentMeta: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	studentCardActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	manageWorkoutsButton: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: '#EFF6FF',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
		marginRight: 8,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
	},
	joinDate: {
		fontSize: 12,
		color: '#9CA3AF',
	},
	moreButton: {
		padding: 4,
	},
	studentStats: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 16,
		backgroundColor: '#F9FAFB',
		borderRadius: 8,
		paddingVertical: 12,
	},
	stat: {
		alignItems: 'center',
	},
	statValue: {
		fontSize: 18,
		fontWeight: '700',
		color: '#111827',
	},
	statLabel: {
		fontSize: 12,
		color: '#6B7280',
		marginTop: 2,
	},
	goals: {
		marginTop: 16,
		marginBottom: 12,
	},
	goalsLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginBottom: 8,
	},
	goalsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	goalTag: {
		backgroundColor: '#BBF24615',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 8,
		marginBottom: 4,
	},
	goalText: {
		fontSize: 12,
		color: '#3B82F6',
		fontWeight: '500',
	},
	nextSession: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB',
	},
	nextSessionText: {
		fontSize: 14,
		color: '#6B7280',
		marginLeft: 8,
	},
	quickActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 16,
	},
	actionButton: {
		alignItems: 'center',
		flex: 1,
	},
	actionIcon: {
		width: 48,
		height: 48,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 8,
	},
	actionText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#374151',
		textAlign: 'center',
	},
	bottomSpacing: {
		height: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: '#6B7280',
	},
	activeWorkout: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB',
	},
	activeWorkoutText: {
		fontSize: 14,
		color: '#6B7280',
		fontWeight: '500',
	},
});