import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ActivityCard from '../../components/dashboard/ActivityCard';

export default function Schedule() {
	const { role } = useAuth();
	const [selectedDate, setSelectedDate] = useState(new Date());

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const getWeekDates = () => {
		const startOfWeek = new Date(selectedDate);
		const day = startOfWeek.getDay();
		const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
		startOfWeek.setDate(diff);

		const weekDates = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);
			weekDates.push(date);
		}
		return weekDates;
	};

	const navigateWeek = (direction: 'prev' | 'next') => {
		const newDate = new Date(selectedDate);
		newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
		setSelectedDate(newDate);
	};

	if (role === 'student') {
		return <StudentSchedule
			selectedDate={selectedDate}
			setSelectedDate={setSelectedDate}
			formatDate={formatDate}
			getWeekDates={getWeekDates}
			navigateWeek={navigateWeek}
		/>;
	}

	return <CoachSchedule
		selectedDate={selectedDate}
		setSelectedDate={setSelectedDate}
		formatDate={formatDate}
		getWeekDates={getWeekDates}
		navigateWeek={navigateWeek}
	/>;
}

interface ScheduleProps {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
	formatDate: (date: Date) => string;
	getWeekDates: () => Date[];
	navigateWeek: (direction: 'prev' | 'next') => void;
}

function StudentSchedule({
	selectedDate,
	setSelectedDate,
	formatDate,
	getWeekDates,
	navigateWeek,
}: ScheduleProps) {
	const mockSchedule = {
		'2024-01-15': [
			{
				id: 1,
				title: 'Upper Body Strength',
				subtitle: 'with Coach Sarah',
				time: '9:00 AM - 10:00 AM',
				status: 'pending' as const,
				icon: 'fitness-outline' as const,
			},
		],
		'2024-01-16': [
			{
				id: 2,
				title: 'HIIT Cardio',
				subtitle: 'with Coach Mike',
				time: '2:00 PM - 3:00 PM',
				status: 'pending' as const,
				icon: 'heart-outline' as const,
			},
		],
		'2024-01-17': [
			{
				id: 3,
				title: 'Yoga & Flexibility',
				subtitle: 'with Coach Emma',
				time: '6:00 PM - 7:00 PM',
				status: 'pending' as const,
				icon: 'leaf-outline' as const,
			},
		],
		'2024-01-18': [
			{
				id: 4,
				title: 'Lower Body Focus',
				subtitle: 'with Coach Sarah',
				time: '10:00 AM - 11:00 AM',
				status: 'completed' as const,
				icon: 'fitness-outline' as const,
			},
		],
	};

	const selectedDateString = selectedDate.toISOString().split('T')[0];
	const todaysSchedule = mockSchedule[selectedDateString] || [];
	const weekDates = getWeekDates();

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.title}>My Schedule</Text>
					<Text style={styles.subtitle}>Manage your workout sessions</Text>
				</View>

				{/* Week Navigator */}
				<View style={styles.weekNavigator}>
					<Pressable onPress={() => navigateWeek('prev')} style={styles.navButton}>
						<Ionicons name="chevron-back" size={24} color="#3B82F6" />
					</Pressable>
					<Text style={styles.weekText}>Week View</Text>
					<Pressable onPress={() => navigateWeek('next')} style={styles.navButton}>
						<Ionicons name="chevron-forward" size={24} color="#3B82F6" />
					</Pressable>
				</View>

				{/* Week Calendar */}
				<View style={styles.weekCalendar}>
					{weekDates.map((date, index) => {
						const isSelected = date.toDateString() === selectedDate.toDateString();
						const isToday = date.toDateString() === new Date().toDateString();
						const hasSession = mockSchedule[date.toISOString().split('T')[0]]?.length > 0;

						return (
							<Pressable
								key={index}
								style={[
									styles.dayButton,
									isSelected && styles.dayButtonSelected,
									isToday && styles.dayButtonToday,
								]}
								onPress={() => setSelectedDate(date)}
							>
								<Text
									style={[
										styles.dayName,
										isSelected && styles.dayNameSelected,
									]}
								>
									{date.toLocaleDateString('en-US', { weekday: 'short' })}
								</Text>
								<Text
									style={[
										styles.dayNumber,
										isSelected && styles.dayNumberSelected,
									]}
								>
									{date.getDate()}
								</Text>
								{hasSession && (
									<View
										style={[
											styles.sessionDot,
											isSelected && styles.sessionDotSelected,
										]}
									/>
								)}
							</Pressable>
						);
					})}
				</View>

				{/* Selected Date Sessions */}
				<DashboardCard
					title={formatDate(selectedDate)}
					subtitle={`${todaysSchedule.length} session${todaysSchedule.length !== 1 ? 's' : ''} scheduled`}
					icon="calendar-outline"
					color="#3B82F6"
				/>

				{/* Sessions List */}
				<View style={styles.sessionsList}>
					{todaysSchedule.length === 0 ? (
						<View style={styles.noSessions}>
							<Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
							<Text style={styles.noSessionsText}>No sessions scheduled</Text>
							<Text style={styles.noSessionsSubtext}>
								Book a session with your coach
							</Text>
						</View>
					) : (
						todaysSchedule.map((session) => (
							<ActivityCard
								key={session.id}
								title={session.title}
								subtitle={session.subtitle}
								time={session.time}
								status={session.status}
								icon={session.icon}
								onPress={() => console.log('Session pressed:', session.title)}
							/>
						))
					)}
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
								<Ionicons name="add" size={24} color="#3B82F6" />
							</View>
							<Text style={styles.actionText}>Book Session</Text>
						</Pressable>
						<Pressable style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#10B98115' }]}>
								<Ionicons name="repeat" size={24} color="#10B981" />
							</View>
							<Text style={styles.actionText}>Reschedule</Text>
						</Pressable>
						<Pressable style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#F59E0B15' }]}>
								<Ionicons name="chatbubble" size={24} color="#F59E0B" />
							</View>
							<Text style={styles.actionText}>Message Coach</Text>
						</Pressable>
					</View>
				</DashboardCard>

				<View style={styles.bottomSpacing} />
			</ScrollView>
		</SafeAreaView>
	);
}

function CoachSchedule({
	selectedDate,
	setSelectedDate,
	formatDate,
	getWeekDates,
	navigateWeek,
}: ScheduleProps) {
	const mockSchedule = {
		'2024-01-15': [
			{
				id: 1,
				title: 'Sarah Johnson - Upper Body',
				subtitle: '9:00 AM - 10:00 AM',
				time: 'Room A',
				status: 'pending' as const,
				icon: 'person-outline' as const,
			},
			{
				id: 2,
				title: 'Mike Davis - Cardio',
				subtitle: '11:00 AM - 12:00 PM',
				time: 'Room B',
				status: 'pending' as const,
				icon: 'person-outline' as const,
			},
		],
		'2024-01-16': [
			{
				id: 3,
				title: 'Emma Wilson - Yoga',
				subtitle: '2:00 PM - 3:00 PM',
				time: 'Studio 1',
				status: 'pending' as const,
				icon: 'person-outline' as const,
			},
			{
				id: 4,
				title: 'John Smith - Strength',
				subtitle: '4:00 PM - 5:00 PM',
				time: 'Room A',
				status: 'pending' as const,
				icon: 'person-outline' as const,
			},
		],
		'2024-01-17': [
			{
				id: 5,
				title: 'Lisa Brown - HIIT',
				subtitle: '6:00 PM - 7:00 PM',
				time: 'Room B',
				status: 'completed' as const,
				icon: 'person-outline' as const,
			},
		],
	};

	const selectedDateString = selectedDate.toISOString().split('T')[0];
	const todaysSchedule = mockSchedule[selectedDateString] || [];
	const weekDates = getWeekDates();

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.title}>My Schedule</Text>
					<Text style={styles.subtitle}>Manage your coaching sessions</Text>
				</View>

				{/* Week Navigator */}
				<View style={styles.weekNavigator}>
					<Pressable onPress={() => navigateWeek('prev')} style={styles.navButton}>
						<Ionicons name="chevron-back" size={24} color="#3B82F6" />
					</Pressable>
					<Text style={styles.weekText}>Week View</Text>
					<Pressable onPress={() => navigateWeek('next')} style={styles.navButton}>
						<Ionicons name="chevron-forward" size={24} color="#3B82F6" />
					</Pressable>
				</View>

				{/* Week Calendar */}
				<View style={styles.weekCalendar}>
					{weekDates.map((date, index) => {
						const isSelected = date.toDateString() === selectedDate.toDateString();
						const isToday = date.toDateString() === new Date().toDateString();
						const sessionsCount = mockSchedule[date.toISOString().split('T')[0]]?.length || 0;

						return (
							<Pressable
								key={index}
								style={[
									styles.dayButton,
									isSelected && styles.dayButtonSelected,
									isToday && styles.dayButtonToday,
								]}
								onPress={() => setSelectedDate(date)}
							>
								<Text
									style={[
										styles.dayName,
										isSelected && styles.dayNameSelected,
									]}
								>
									{date.toLocaleDateString('en-US', { weekday: 'short' })}
								</Text>
								<Text
									style={[
										styles.dayNumber,
										isSelected && styles.dayNumberSelected,
									]}
								>
									{date.getDate()}
								</Text>
								{sessionsCount > 0 && (
									<View style={[styles.sessionsBadge, isSelected && styles.sessionsBadgeSelected]}>
										<Text style={[styles.sessionsCount, isSelected && styles.sessionsCountSelected]}>
											{sessionsCount}
										</Text>
									</View>
								)}
							</Pressable>
						);
					})}
				</View>

				{/* Selected Date Sessions */}
				<DashboardCard
					title={formatDate(selectedDate)}
					subtitle={`${todaysSchedule.length} session${todaysSchedule.length !== 1 ? 's' : ''} scheduled`}
					icon="calendar-outline"
					color="#3B82F6"
				/>

				{/* Sessions List */}
				<View style={styles.sessionsList}>
					{todaysSchedule.length === 0 ? (
						<View style={styles.noSessions}>
							<Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
							<Text style={styles.noSessionsText}>No sessions scheduled</Text>
							<Text style={styles.noSessionsSubtext}>
								Your schedule is free for this day
							</Text>
						</View>
					) : (
						todaysSchedule.map((session) => (
							<ActivityCard
								key={session.id}
								title={session.title}
								subtitle={session.subtitle}
								time={session.time}
								status={session.status}
								icon={session.icon}
								onPress={() => console.log('Session pressed:', session.title)}
							/>
						))
					)}
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
								<Ionicons name="add" size={24} color="#3B82F6" />
							</View>
							<Text style={styles.actionText}>Add Session</Text>
						</Pressable>
						<Pressable style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#10B98115' }]}>
								<Ionicons name="time" size={24} color="#10B981" />
							</View>
							<Text style={styles.actionText}>Set Availability</Text>
						</Pressable>
						<Pressable style={styles.actionButton}>
							<View style={[styles.actionIcon, { backgroundColor: '#F59E0B15' }]}>
								<Ionicons name="calendar" size={24} color="#F59E0B" />
							</View>
							<Text style={styles.actionText}>View Month</Text>
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
	weekNavigator: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	navButton: {
		padding: 8,
	},
	weekText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
	},
	weekCalendar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 8,
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
	dayButton: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 12,
		borderRadius: 8,
		marginHorizontal: 2,
	},
	dayButtonSelected: {
		backgroundColor: '#3B82F6',
	},
	dayButtonToday: {
		backgroundColor: '#F3F4F6',
	},
	dayName: {
		fontSize: 12,
		fontWeight: '500',
		color: '#6B7280',
		marginBottom: 4,
	},
	dayNameSelected: {
		color: '#FFFFFF',
	},
	dayNumber: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 4,
	},
	dayNumberSelected: {
		color: '#FFFFFF',
	},
	sessionDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: '#3B82F6',
	},
	sessionDotSelected: {
		backgroundColor: '#FFFFFF',
	},
	sessionsBadge: {
		backgroundColor: '#3B82F6',
		borderRadius: 10,
		minWidth: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 6,
	},
	sessionsBadgeSelected: {
		backgroundColor: '#FFFFFF',
	},
	sessionsCount: {
		fontSize: 11,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	sessionsCountSelected: {
		color: '#3B82F6',
	},
	sessionsList: {
		marginBottom: 24,
	},
	noSessions: {
		alignItems: 'center',
		paddingVertical: 40,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
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
	noSessionsText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#374151',
		marginTop: 16,
	},
	noSessionsSubtext: {
		fontSize: 14,
		color: '#6B7280',
		marginTop: 4,
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