import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import DashboardCard from '../../../components/dashboard/DashboardCard';
import StatCard from '../../../components/dashboard/StatCard';
import ActivityCard from '../../../components/dashboard/ActivityCard';

export default function CoachDashboard() {
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
						color="#BBF246"
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
							<View style={[styles.actionIcon, { backgroundColor: '#BBF24615' }]}>
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
