import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Pressable,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import DashboardCard from '../../components/dashboard/DashboardCard';
import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';

export default function Progress() {
	const { role } = useAuth();
	const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

	const periods = [
		{ key: 'week' as const, label: 'This Week' },
		{ key: 'month' as const, label: 'This Month' },
		{ key: 'year' as const, label: 'This Year' },
	];

	if (role === 'student') {
		return <StudentProgress selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} periods={periods} />;
	}

	return <CoachAnalytics selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} periods={periods} />;
}

interface ProgressProps {
	selectedPeriod: 'week' | 'month' | 'year';
	setSelectedPeriod: (period: 'week' | 'month' | 'year') => void;
	periods: { key: 'week' | 'month' | 'year'; label: string }[];
}

function StudentProgress({ selectedPeriod, setSelectedPeriod, periods }: ProgressProps) {
	const mockData = {
		week: {
			workoutsCompleted: 4,
			totalWorkouts: 5,
			caloriesBurned: 1200,
			averageHeartRate: 145,
			personalBests: 2,
			consistency: 80,
		},
		month: {
			workoutsCompleted: 18,
			totalWorkouts: 20,
			caloriesBurned: 5400,
			averageHeartRate: 142,
			personalBests: 8,
			consistency: 90,
		},
		year: {
			workoutsCompleted: 180,
			totalWorkouts: 200,
			caloriesBurned: 54000,
			averageHeartRate: 140,
			personalBests: 45,
			consistency: 85,
		},
	};

	const data = mockData[selectedPeriod];
	const completionRate = Math.round((data.workoutsCompleted / data.totalWorkouts) * 100);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.title}>Your Progress</Text>
					<Text style={styles.subtitle}>Track your fitness journey</Text>
				</View>

				{/* Period Selector */}
				<View style={styles.periodSelector}>
					{periods.map((period) => (
						<Pressable
							key={period.key}
							style={[
								styles.periodButton,
								selectedPeriod === period.key && styles.periodButtonActive,
							]}
							onPress={() => setSelectedPeriod(period.key)}
						>
							<Text
								style={[
									styles.periodButtonText,
									selectedPeriod === period.key && styles.periodButtonTextActive,
								]}
							>
								{period.label}
							</Text>
						</Pressable>
					))}
				</View>

				{/* Overall Progress */}
				<DashboardCard
					title="Overall Progress"
					subtitle={`${data.workoutsCompleted} of ${data.totalWorkouts} workouts completed`}
					icon="trophy-outline"
					color="#F59E0B"
				>
					<ProgressBar
						value={completionRate}
						label="Completion Rate"
						color="#F59E0B"
						showPercentage={true}
					/>
				</DashboardCard>

				{/* Stats Grid */}
				<View style={styles.statsGrid}>
					<StatCard
						title="Workouts"
						value={data.workoutsCompleted}
						subtitle="completed"
						icon="fitness"
						color="#10B981"
					/>
					<StatCard
						title="Calories"
						value={data.caloriesBurned.toLocaleString()}
						subtitle="burned"
						icon="flame"
						color="#EF4444"
					/>
				</View>

				<View style={styles.statsGrid}>
					<StatCard
						title="Avg. Heart Rate"
						value={data.averageHeartRate}
						subtitle="bpm"
						icon="heart"
						color="#EC4899"
					/>
					<StatCard
						title="Personal Bests"
						value={data.personalBests}
						subtitle="achieved"
						icon="medal"
						color="#8B5CF6"
					/>
				</View>

				{/* Detailed Progress */}
				<DashboardCard
					title="Detailed Breakdown"
					icon="bar-chart-outline"
					color="#3B82F6"
				>
					<View style={styles.progressDetails}>
						<ProgressBar
							value={data.consistency}
							label="Consistency Score"
							color="#10B981"
							showPercentage={true}
						/>
						<ProgressBar
							value={75}
							label="Strength Progress"
							color="#3B82F6"
							showPercentage={true}
						/>
						<ProgressBar
							value={85}
							label="Endurance Progress"
							color="#8B5CF6"
							showPercentage={true}
						/>
					</View>
				</DashboardCard>

				{/* Achievement Cards */}
				<DashboardCard
					title="Recent Achievements"
					subtitle="Keep up the great work!"
					icon="star-outline"
					color="#F59E0B"
				>
					<View style={styles.achievements}>
						<View style={styles.achievement}>
							<Text style={styles.achievementIcon}>🏆</Text>
							<View style={styles.achievementText}>
								<Text style={styles.achievementTitle}>Week Warrior</Text>
								<Text style={styles.achievementDesc}>Completed 4 workouts this week</Text>
							</View>
						</View>
						<View style={styles.achievement}>
							<Text style={styles.achievementIcon}>🔥</Text>
							<View style={styles.achievementText}>
								<Text style={styles.achievementTitle}>Calorie Crusher</Text>
								<Text style={styles.achievementDesc}>Burned over 1000 calories</Text>
							</View>
						</View>
						<View style={styles.achievement}>
							<Text style={styles.achievementIcon}>💪</Text>
							<View style={styles.achievementText}>
								<Text style={styles.achievementTitle}>Personal Best</Text>
								<Text style={styles.achievementDesc}>New deadlift record: 150lbs</Text>
							</View>
						</View>
					</View>
				</DashboardCard>

				<View style={styles.bottomSpacing} />
			</ScrollView>
		</SafeAreaView>
	);
}

function CoachAnalytics({ selectedPeriod, setSelectedPeriod, periods }: ProgressProps) {
	const mockData = {
		week: {
			totalSessions: 35,
			completedSessions: 33,
			revenue: 2450,
			newStudents: 3,
			retention: 94,
			avgRating: 4.8,
		},
		month: {
			totalSessions: 140,
			completedSessions: 132,
			revenue: 9800,
			newStudents: 12,
			retention: 91,
			avgRating: 4.7,
		},
		year: {
			totalSessions: 1680,
			completedSessions: 1596,
			revenue: 98000,
			newStudents: 144,
			retention: 89,
			avgRating: 4.6,
		},
	};

	const data = mockData[selectedPeriod];
	const completionRate = Math.round((data.completedSessions / data.totalSessions) * 100);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.title}>Analytics</Text>
					<Text style={styles.subtitle}>Track your coaching performance</Text>
				</View>

				{/* Period Selector */}
				<View style={styles.periodSelector}>
					{periods.map((period) => (
						<Pressable
							key={period.key}
							style={[
								styles.periodButton,
								selectedPeriod === period.key && styles.periodButtonActive,
							]}
							onPress={() => setSelectedPeriod(period.key)}
						>
							<Text
								style={[
									styles.periodButtonText,
									selectedPeriod === period.key && styles.periodButtonTextActive,
								]}
							>
								{period.label}
							</Text>
						</Pressable>
					))}
				</View>

				{/* Performance Overview */}
				<DashboardCard
					title="Performance Overview"
					subtitle={`${data.completedSessions} of ${data.totalSessions} sessions completed`}
					icon="trending-up-outline"
					color="#10B981"
				>
					<ProgressBar
						value={completionRate}
						label="Session Completion Rate"
						color="#10B981"
						showPercentage={true}
					/>
				</DashboardCard>

				{/* Revenue & Students Stats */}
				<View style={styles.statsGrid}>
					<StatCard
						title="Revenue"
						value={`$${data.revenue.toLocaleString()}`}
						subtitle="earned"
						icon="card"
						color="#F59E0B"
						trend={{ value: 12, isPositive: true }}
					/>
					<StatCard
						title="New Students"
						value={data.newStudents}
						subtitle="this period"
						icon="person-add"
						color="#10B981"
						trend={{ value: 8, isPositive: true }}
					/>
				</View>

				<View style={styles.statsGrid}>
					<StatCard
						title="Retention Rate"
						value={`${data.retention}%`}
						subtitle="student retention"
						icon="repeat"
						color="#3B82F6"
						trend={{ value: 3, isPositive: true }}
					/>
					<StatCard
						title="Avg. Rating"
						value={data.avgRating}
						subtitle="out of 5.0"
						icon="star"
						color="#8B5CF6"
					/>
				</View>

				{/* Student Progress Summary */}
				<DashboardCard
					title="Student Progress Summary"
					icon="people-outline"
					color="#EC4899"
				>
					<View style={styles.progressDetails}>
						<ProgressBar
							value={88}
							label="Overall Student Satisfaction"
							color="#EC4899"
							showPercentage={true}
						/>
						<ProgressBar
							value={76}
							label="Average Goal Achievement"
							color="#10B981"
							showPercentage={true}
						/>
						<ProgressBar
							value={data.retention}
							label="Student Retention"
							color="#3B82F6"
							showPercentage={true}
						/>
					</View>
				</DashboardCard>

				{/* Top Performing Students */}
				<DashboardCard
					title="Top Performing Students"
					subtitle="This month's champions"
					icon="trophy-outline"
					color="#F59E0B"
				>
					<View style={styles.topStudents}>
						<View style={styles.studentRank}>
							<Text style={styles.rankNumber}>1</Text>
							<View style={styles.studentInfo}>
								<Text style={styles.studentName}>Sarah Johnson</Text>
								<Text style={styles.studentProgress}>95% workout completion</Text>
							</View>
						</View>
						<View style={styles.studentRank}>
							<Text style={styles.rankNumber}>2</Text>
							<View style={styles.studentInfo}>
								<Text style={styles.studentName}>Mike Davis</Text>
								<Text style={styles.studentProgress}>92% workout completion</Text>
							</View>
						</View>
						<View style={styles.studentRank}>
							<Text style={styles.rankNumber}>3</Text>
							<View style={styles.studentInfo}>
								<Text style={styles.studentName}>Emma Wilson</Text>
								<Text style={styles.studentProgress}>89% workout completion</Text>
							</View>
						</View>
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
	periodSelector: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 4,
		marginBottom: 24,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	periodButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	periodButtonActive: {
		backgroundColor: '#3B82F6',
	},
	periodButtonText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#6B7280',
	},
	periodButtonTextActive: {
		color: '#FFFFFF',
	},
	statsGrid: {
		flexDirection: 'row',
		marginBottom: 16,
		marginHorizontal: -4,
	},
	progressDetails: {
		marginTop: 16,
	},
	achievements: {
		marginTop: 16,
	},
	achievement: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	achievementIcon: {
		fontSize: 32,
		marginRight: 16,
	},
	achievementText: {
		flex: 1,
	},
	achievementTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 2,
	},
	achievementDesc: {
		fontSize: 14,
		color: '#6B7280',
	},
	topStudents: {
		marginTop: 16,
	},
	studentRank: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	rankNumber: {
		fontSize: 18,
		fontWeight: '700',
		color: '#F59E0B',
		width: 32,
		textAlign: 'center',
		marginRight: 16,
	},
	studentInfo: {
		flex: 1,
	},
	studentName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 2,
	},
	studentProgress: {
		fontSize: 14,
		color: '#6B7280',
	},
	bottomSpacing: {
		height: 20,
	},
});