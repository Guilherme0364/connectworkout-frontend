import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import DashboardCard from '../../components/dashboard/DashboardCard';
import StatCard from '../../components/dashboard/StatCard';
import ActivityCard from '../../components/dashboard/ActivityCard';
import ProgressBar from '../../components/dashboard/ProgressBar';

export default function Dashboard() {
	const { role } = useAuth();

	if (role === 'student') {
		return <StudentDashboard />;
	}

	return <CoachDashboard />;
}

function StudentDashboard() {
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

function CoachDashboard() {
	const mockData = {
		todaySessions: 6,
		activeStudents: 23,
		completionRate: 88,
		revenue: '$2,450',
		upcomingSessions: [
			{
				id: 1,
				title: 'Sarah Johnson - HIIT',
				subtitle: '2:00 PM - 3:00 PM',
				time: 'In 30 minutes',
				status: 'pending' as const,
				icon: 'person-outline' as const,
			},
			{
				id: 2,
				title: 'Mike Davis - Strength',
				subtitle: '3:30 PM - 4:30 PM',
				time: 'In 1.5 hours',
				status: 'pending' as const,
				icon: 'person-outline' as const,
			},
			{
				id: 3,
				title: 'Emma Wilson - Yoga',
				subtitle: '5:00 PM - 6:00 PM',
				time: 'In 3 hours',
				status: 'pending' as const,
				icon: 'person-outline' as const,
			},
		],
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.greeting}>Welcome back, Coach!</Text>
					<Text style={styles.welcomeText}>
						You have {mockData.todaySessions} sessions scheduled today
					</Text>
				</View>

				{/* Stats Row */}
				<View style={styles.statsRow}>
					<StatCard
						title="Today's Sessions"
						value={mockData.todaySessions}
						subtitle="scheduled"
						icon="calendar"
						color="#3B82F6"
					/>
					<StatCard
						title="Active Students"
						value={mockData.activeStudents}
						subtitle="this month"
						icon="people"
						color="#10B981"
						trend={{ value: 15, isPositive: true }}
					/>
				</View>

				<View style={styles.statsRow}>
					<StatCard
						title="Completion Rate"
						value={`${mockData.completionRate}%`}
						subtitle="this week"
						icon="checkmark-circle"
						color="#8B5CF6"
						trend={{ value: 5, isPositive: true }}
					/>
					<StatCard
						title="Monthly Revenue"
						value={mockData.revenue}
						subtitle="this month"
						icon="card"
						color="#F59E0B"
						trend={{ value: 12, isPositive: true }}
					/>
				</View>

				{/* Quick Actions for Coach */}
				<DashboardCard
					title="Quick Actions"
					icon="flash-outline"
					color="#8B5CF6"
				>
					<View style={styles.quickActions}>
						<View style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#3B82F615' }]}>
								<Text style={[styles.actionIconText, { color: '#3B82F6' }]}>👤</Text>
							</View>
							<Text style={styles.actionText}>Add Student</Text>
						</View>
						<View style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#10B98115' }]}>
								<Text style={[styles.actionIconText, { color: '#10B981' }]}>🏋️</Text>
							</View>
							<Text style={styles.actionText}>Create Workout</Text>
						</View>
						<View style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#F59E0B15' }]}>
								<Text style={[styles.actionIconText, { color: '#F59E0B' }]}>📊</Text>
							</View>
							<Text style={styles.actionText}>View Reports</Text>
						</View>
					</View>
				</DashboardCard>

				{/* Today's Schedule */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
					{mockData.upcomingSessions.map((session) => (
						<ActivityCard
							key={session.id}
							title={session.title}
							subtitle={session.subtitle}
							time={session.time}
							status={session.status}
							icon={session.icon}
							onPress={() => console.log('Session pressed:', session.title)}
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