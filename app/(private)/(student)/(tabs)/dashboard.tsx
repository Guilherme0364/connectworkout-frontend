import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useStudent } from '../../../contexts/StudentContext';
import { useRouter } from 'expo-router';
import DashboardCard from '../../../components/dashboard/DashboardCard';
import StatCard from '../../../components/dashboard/StatCard';
import ActivityCard from '../../../components/dashboard/ActivityCard';
import ProgressBar from '../../../components/dashboard/ProgressBar';
import EmptyState from '../../../components/EmptyState';

export default function StudentDashboard() {
	const { hasTrainer, isLoading, refreshStudentData } = useStudent();
	const router = useRouter();

	useEffect(() => {
		// Load student data when component mounts
		refreshStudentData();
	}, []);

	// Show loading state
	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<Text style={styles.loadingText}>Carregando...</Text>
				</View>
			</SafeAreaView>
		);
	}

	// Show empty state if student has no trainer
	if (!hasTrainer) {
		return (
			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.header}>
						<Text style={styles.greeting}>Connect Workout</Text>
					</View>

					<View style={styles.emptyStateCard}>
						<EmptyState
							icon="fitness-outline"
							title="Você ainda não possui exercícios"
							description="Conecte com um personal para iniciar treinos"
							iconColor="#C4FF0D"
						/>
						<TouchableOpacity
							style={styles.primaryButton}
							onPress={() => router.push('/student/personal-requests')}
						>
							<Text style={styles.primaryButtonText}>Ver Solicitações de Personal</Text>
						</TouchableOpacity>
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
	const mockData = {
		weeklyProgress: 75,
		streak: 12,
		workoutsThisWeek: 4,
		nextSession: 'Tomorrow at 2:00 PM',
		recentActivities: [
			{
				id: 1,
				title: 'Upper Body Strength',
				subtitle: 'Completed with Sarah',
				time: '2 hours ago',
				status: 'completed' as const,
				icon: 'fitness-outline' as const,
			},
			{
				id: 2,
				title: 'Cardio Session',
				subtitle: 'Scheduled with Mike',
				time: 'Tomorrow 2:00 PM',
				status: 'pending' as const,
				icon: 'heart-outline' as const,
			},
			{
				id: 3,
				title: 'Nutrition Check-in',
				subtitle: 'Weekly review',
				time: 'Friday 10:00 AM',
				status: 'pending' as const,
				icon: 'restaurant-outline' as const,
			},
		],
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.greeting}>Good morning!</Text>
					<Text style={styles.welcomeText}>Ready for another great workout?</Text>
				</View>

				{/* Stats Row */}
				<View style={styles.statsRow}>
					<StatCard
						title="Current Streak"
						value={mockData.streak}
						subtitle="days"
						icon="flame"
						color="#F59E0B"
						trend={{ value: 8, isPositive: true }}
					/>
					<StatCard
						title="This Week"
						value={mockData.workoutsThisWeek}
						subtitle="workouts"
						icon="fitness"
						color="#10B981"
						trend={{ value: 12, isPositive: true }}
					/>
				</View>

				{/* Today's Workout */}
				<DashboardCard
					title="Today's Workout"
					subtitle="Push Day - Upper Body Focus"
					icon="barbell-outline"
					color="#3B82F6"
					onPress={() => console.log('Start workout pressed')}
				>
					<View style={styles.workoutDetails}>
						<View style={styles.workoutStat}>
							<Text style={styles.workoutStatValue}>45</Text>
							<Text style={styles.workoutStatLabel}>minutes</Text>
						</View>
						<View style={styles.workoutStat}>
							<Text style={styles.workoutStatValue}>8</Text>
							<Text style={styles.workoutStatLabel}>exercises</Text>
						</View>
						<View style={styles.workoutStat}>
							<Text style={styles.workoutStatValue}>3</Text>
							<Text style={styles.workoutStatLabel}>sets each</Text>
						</View>
					</View>
				</DashboardCard>

				{/* Weekly Progress */}
				<DashboardCard
					title="Weekly Progress"
					subtitle="You're doing great! Keep it up!"
					icon="trending-up-outline"
					color="#10B981"
				>
					<ProgressBar
						value={mockData.weeklyProgress}
						label="Weekly Goal Progress"
						color="#10B981"
						showPercentage={true}
					/>
					<View style={styles.progressStats}>
						<Text style={styles.progressText}>
							{mockData.workoutsThisWeek} of 5 workouts completed
						</Text>
					</View>
				</DashboardCard>

				{/* Quick Actions */}
				<DashboardCard
					title="Quick Actions"
					icon="flash-outline"
					color="#8B5CF6"
				>
					<View style={styles.quickActions}>
						<View style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#3B82F615' }]}>
								<Text style={[styles.actionIconText, { color: '#3B82F6' }]}>📅</Text>
							</View>
							<Text style={styles.actionText}>Book Session</Text>
						</View>
						<View style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#10B98115' }]}>
								<Text style={[styles.actionIconText, { color: '#10B981' }]}>🍎</Text>
							</View>
							<Text style={styles.actionText}>Meal Plan</Text>
						</View>
						<View style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#F59E0B15' }]}>
								<Text style={[styles.actionIconText, { color: '#F59E0B' }]}>💬</Text>
							</View>
							<Text style={styles.actionText}>Message Coach</Text>
						</View>
					</View>
				</DashboardCard>

				{/* Recent Activities */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Recent Activities</Text>
					{mockData.recentActivities.map((activity) => (
						<ActivityCard
							key={activity.id}
							title={activity.title}
							subtitle={activity.subtitle}
							time={activity.time}
							status={activity.status}
							icon={activity.icon}
							onPress={() => console.log('Activity pressed:', activity.title)}
						/>
					))}
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
	primaryButton: {
		backgroundColor: '#C4FF0D',
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 16,
	},
	primaryButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1A1A1A',
	},
	statsRow: {
		flexDirection: 'row',
		marginBottom: 16,
		marginHorizontal: -4,
	},
	workoutDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 16,
	},
	workoutStat: {
		alignItems: 'center',
	},
	workoutStatValue: {
		fontSize: 20,
		fontWeight: '700',
		color: '#111827',
	},
	workoutStatLabel: {
		fontSize: 12,
		color: '#6B7280',
		marginTop: 2,
	},
	progressStats: {
		marginTop: 8,
	},
	progressText: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
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
	actionIconText: {
		fontSize: 20,
	},
	actionText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#374151',
		textAlign: 'center',
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 16,
	},
	bottomSpacing: {
		height: 20,
	},
});
