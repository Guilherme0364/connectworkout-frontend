import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Pressable,
	TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardCard from '../../components/dashboard/DashboardCard';
import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';

export default function Students() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'new'>('all');

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
		{ key: 'all' as const, label: 'All', count: mockStudents.length },
		{ key: 'active' as const, label: 'Active', count: mockStudents.filter(s => s.status === 'active').length },
		{ key: 'inactive' as const, label: 'Inactive', count: mockStudents.filter(s => s.status === 'inactive').length },
		{ key: 'new' as const, label: 'New', count: mockStudents.filter(s => s.status === 'new').length },
	];

	const filteredStudents = mockStudents.filter(student => {
		const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			student.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || student.status === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return '#10B981';
			case 'inactive':
				return '#EF4444';
			case 'new':
				return '#3B82F6';
			default:
				return '#6B7280';
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.title}>My Students</Text>
					<Text style={styles.subtitle}>Manage and track student progress</Text>
				</View>

				{/* Student Stats Overview */}
				<View style={styles.statsRow}>
					<StatCard
						title="Total Students"
						value={mockStudents.length}
						subtitle="this month"
						icon="people"
						color="#3B82F6"
					/>
					<StatCard
						title="Active Students"
						value={mockStudents.filter(s => s.status === 'active').length}
						subtitle="currently training"
						icon="fitness"
						color="#10B981"
						trend={{ value: 12, isPositive: true }}
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
				<View style={styles.studentsList}>
					{filteredStudents.map((student) => (
						<DashboardCard
							key={student.id}
							title=""
							onPress={() => console.log('Student pressed:', student.name)}
						>
							<View style={styles.studentCard}>
								<View style={styles.studentHeader}>
									<View style={styles.studentAvatar}>
										<Text style={styles.avatarText}>{student.avatar}</Text>
									</View>
									<View style={styles.studentInfo}>
										<Text style={styles.studentName}>{student.name}</Text>
										<Text style={styles.studentEmail}>{student.email}</Text>
										<View style={styles.studentMeta}>
											<View
												style={[
													styles.statusBadge,
													{ backgroundColor: `${getStatusColor(student.status)}15` },
												]}
											>
												<Text
													style={[
														styles.statusText,
														{ color: getStatusColor(student.status) },
													]}
												>
													{student.status.charAt(0).toUpperCase() + student.status.slice(1)}
												</Text>
											</View>
											<Text style={styles.joinDate}>
												Joined {new Date(student.joinDate).toLocaleDateString()}
											</Text>
										</View>
									</View>
									<Pressable style={styles.moreButton}>
										<Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
									</Pressable>
								</View>

								<View style={styles.studentStats}>
									<View style={styles.stat}>
										<Text style={styles.statValue}>{student.workoutsCompleted}</Text>
										<Text style={styles.statLabel}>Workouts</Text>
									</View>
									<View style={styles.stat}>
										<Text style={styles.statValue}>{student.progress}%</Text>
										<Text style={styles.statLabel}>Progress</Text>
									</View>
									<View style={styles.stat}>
										<Text style={styles.statValue}>
											{student.nextSession ? 'Scheduled' : 'None'}
										</Text>
										<Text style={styles.statLabel}>Next Session</Text>
									</View>
								</View>

								<ProgressBar
									value={student.progress}
									label="Overall Progress"
									color={getStatusColor(student.status)}
									showPercentage={true}
								/>

								<View style={styles.goals}>
									<Text style={styles.goalsLabel}>Goals:</Text>
									<View style={styles.goalsContainer}>
										{student.goals.map((goal, index) => (
											<View key={index} style={styles.goalTag}>
												<Text style={styles.goalText}>{goal}</Text>
											</View>
										))}
									</View>
								</View>

								{student.nextSession && (
									<View style={styles.nextSession}>
										<Ionicons name="calendar-outline" size={16} color="#6B7280" />
										<Text style={styles.nextSessionText}>
											Next: {new Date(student.nextSession).toLocaleString()}
										</Text>
									</View>
								)}
							</View>
						</DashboardCard>
					))}
				</View>

				{/* Quick Actions */}
				<DashboardCard
					title="Quick Actions"
					icon="flash-outline"
					color="#8B5CF6"
				>
					<View style={styles.quickActions}>
						<Pressable style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#3B82F615' }]}>
								<Ionicons name="person-add" size={24} color="#3B82F6" />
							</View>
							<Text style={styles.actionText}>Add Student</Text>
						</Pressable>
						<Pressable style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#10B98115' }]}>
								<Ionicons name="create" size={24} color="#10B981" />
							</View>
							<Text style={styles.actionText}>Create Workout</Text>
						</Pressable>
						<Pressable style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#F59E0B15' }]}>
								<Ionicons name="mail" size={24} color="#F59E0B" />
							</View>
							<Text style={styles.actionText}>Send Message</Text>
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
		backgroundColor: '#3B82F6',
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
		backgroundColor: '#3B82F615',
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
});