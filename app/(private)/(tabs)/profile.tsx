import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Pressable,
	Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import DashboardCard from '../../components/dashboard/DashboardCard';

export default function Profile() {
	const { role, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const mockProfile = {
		name: role === 'student' ? 'John Student' : 'Sarah Coach',
		email: role === 'student' ? 'john@example.com' : 'sarah@example.com',
		joinDate: '2024-01-01',
		avatar: role === 'student' ? '👨‍💼' : '👩‍💼',
		stats: role === 'student' 
			? {
				workoutsCompleted: 45,
				streak: 12,
				totalHours: 67,
			}
			: {
				studentsCoached: 23,
				sessionsCompleted: 156,
				rating: 4.8,
			},
	};

	const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
		<DashboardCard title={title} icon="settings-outline" color="#6B7280">
			{children}
		</DashboardCard>
	);

	const ProfileItem = ({ 
		icon, 
		title, 
		subtitle, 
		onPress, 
		showArrow = true,
		rightComponent 
	}: {
		icon: keyof typeof Ionicons.glyphMap;
		title: string;
		subtitle?: string;
		onPress?: () => void;
		showArrow?: boolean;
		rightComponent?: React.ReactNode;
	}) => (
		<Pressable style={styles.profileItem} onPress={onPress} disabled={!onPress}>
			<View style={styles.profileItemLeft}>
				<View style={styles.profileItemIcon}>
					<Ionicons name={icon} size={20} color="#6B7280" />
				</View>
				<View style={styles.profileItemText}>
					<Text style={styles.profileItemTitle}>{title}</Text>
					{subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
				</View>
			</View>
			<View style={styles.profileItemRight}>
				{rightComponent}
				{showArrow && onPress && (
					<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
				)}
			</View>
		</Pressable>
	);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.title}>Profile</Text>
					<Text style={styles.subtitle}>Manage your account settings</Text>
				</View>

				{/* Profile Header */}
				<DashboardCard title="" color="#3B82F6">
					<View style={styles.profileHeader}>
						<View style={styles.avatarContainer}>
							<Text style={styles.avatarText}>{mockProfile.avatar}</Text>
						</View>
						<View style={styles.profileInfo}>
							<Text style={styles.profileName}>{mockProfile.name}</Text>
							<Text style={styles.profileEmail}>{mockProfile.email}</Text>
							<View style={styles.roleBadge}>
								<Text style={styles.roleText}>
									{role === 'student' ? 'Student' : 'Coach'}
								</Text>
							</View>
						</View>
						<Pressable style={styles.editButton}>
							<Ionicons name="pencil" size={20} color="#3B82F6" />
						</Pressable>
					</View>
				</DashboardCard>

				{/* Stats Overview */}
				<DashboardCard
					title={role === 'student' ? 'Your Stats' : 'Coaching Stats'}
					icon="bar-chart-outline"
					color="#10B981"
				>
					<View style={styles.statsContainer}>
						{role === 'student' ? (
							<>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>{mockProfile.stats.workoutsCompleted}</Text>
									<Text style={styles.statLabel}>Workouts Completed</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>{mockProfile.stats.streak}</Text>
									<Text style={styles.statLabel}>Day Streak</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>{mockProfile.stats.totalHours}h</Text>
									<Text style={styles.statLabel}>Total Hours</Text>
								</View>
							</>
						) : (
							<>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>{mockProfile.stats.studentsCoached}</Text>
									<Text style={styles.statLabel}>Students Coached</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>{mockProfile.stats.sessionsCompleted}</Text>
									<Text style={styles.statLabel}>Sessions Completed</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>⭐ {mockProfile.stats.rating}</Text>
									<Text style={styles.statLabel}>Average Rating</Text>
								</View>
							</>
						)}
					</View>
				</DashboardCard>

				{/* Account Settings */}
				<ProfileSection title="Account">
					<View style={styles.profileItems}>
						<ProfileItem
							icon="person-outline"
							title="Personal Information"
							subtitle="Name, email, phone"
							onPress={() => console.log('Edit personal info')}
						/>
						<ProfileItem
							icon="lock-closed-outline"
							title="Security"
							subtitle="Password, two-factor auth"
							onPress={() => console.log('Security settings')}
						/>
						<ProfileItem
							icon="card-outline"
							title="Billing & Payments"
							subtitle="Subscription, payment methods"
							onPress={() => console.log('Billing settings')}
						/>
					</View>
				</ProfileSection>

				{/* App Settings */}
				<ProfileSection title="App Settings">
					<View style={styles.profileItems}>
						<ProfileItem
							icon="notifications-outline"
							title="Notifications"
							subtitle="Push notifications, reminders"
							rightComponent={<Switch value={true} onValueChange={() => {}} />}
							showArrow={false}
						/>
						<ProfileItem
							icon="moon-outline"
							title="Dark Mode"
							subtitle="App appearance"
							rightComponent={<Switch value={false} onValueChange={() => {}} />}
							showArrow={false}
						/>
						<ProfileItem
							icon="globe-outline"
							title="Language"
							subtitle="English"
							onPress={() => console.log('Language settings')}
						/>
						<ProfileItem
							icon="download-outline"
							title="Data & Storage"
							subtitle="Download data, manage storage"
							onPress={() => console.log('Data settings')}
						/>
					</View>
				</ProfileSection>

				{/* Fitness Settings (Student only) */}
				{role === 'student' && (
					<ProfileSection title="Fitness Preferences">
						<View style={styles.profileItems}>
							<ProfileItem
								icon="fitness-outline"
								title="Goals & Preferences"
								subtitle="Fitness goals, workout preferences"
								onPress={() => console.log('Fitness goals')}
							/>
							<ProfileItem
								icon="heart-outline"
								title="Health Metrics"
								subtitle="Weight, measurements, health data"
								onPress={() => console.log('Health metrics')}
							/>
							<ProfileItem
								icon="calendar-outline"
								title="Workout Schedule"
								subtitle="Preferred times, availability"
								onPress={() => console.log('Workout schedule')}
							/>
						</View>
					</ProfileSection>
				)}

				{/* Coach Settings (Coach only) */}
				{role === 'instructor' && (
					<ProfileSection title="Coaching Settings">
						<View style={styles.profileItems}>
							<ProfileItem
								icon="school-outline"
								title="Certifications"
								subtitle="Manage certifications and credentials"
								onPress={() => console.log('Certifications')}
							/>
							<ProfileItem
								icon="time-outline"
								title="Availability"
								subtitle="Set available hours and days"
								onPress={() => console.log('Availability')}
							/>
							<ProfileItem
								icon="cash-outline"
								title="Rates & Services"
								subtitle="Session rates, service offerings"
								onPress={() => console.log('Rates')}
							/>
						</View>
					</ProfileSection>
				)}

				{/* Support & About */}
				<ProfileSection title="Support & About">
					<View style={styles.profileItems}>
						<ProfileItem
							icon="help-circle-outline"
							title="Help Center"
							subtitle="FAQs, guides, tutorials"
							onPress={() => console.log('Help center')}
						/>
						<ProfileItem
							icon="chatbubble-outline"
							title="Contact Support"
							subtitle="Get help from our team"
							onPress={() => console.log('Contact support')}
						/>
						<ProfileItem
							icon="document-text-outline"
							title="Terms & Privacy"
							subtitle="Legal information"
							onPress={() => console.log('Terms & Privacy')}
						/>
						<ProfileItem
							icon="information-circle-outline"
							title="About"
							subtitle="Version 1.0.0"
							onPress={() => console.log('About')}
						/>
					</View>
				</ProfileSection>

				{/* Logout */}
				<DashboardCard title="" color="#EF4444">
					<Pressable style={styles.logoutButton} onPress={handleLogout}>
						<Ionicons name="log-out-outline" size={20} color="#EF4444" />
						<Text style={styles.logoutText}>Sign Out</Text>
					</Pressable>
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
	profileHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 0,
	},
	avatarContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#F3F4F6',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	avatarText: {
		fontSize: 32,
	},
	profileInfo: {
		flex: 1,
	},
	profileName: {
		fontSize: 20,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 4,
	},
	profileEmail: {
		fontSize: 14,
		color: '#6B7280',
		marginBottom: 8,
	},
	roleBadge: {
		backgroundColor: '#3B82F615',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		alignSelf: 'flex-start',
	},
	roleText: {
		fontSize: 12,
		color: '#3B82F6',
		fontWeight: '600',
	},
	editButton: {
		padding: 8,
		backgroundColor: '#F3F4F6',
		borderRadius: 8,
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 16,
	},
	statItem: {
		alignItems: 'center',
	},
	statValue: {
		fontSize: 20,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: '#6B7280',
		textAlign: 'center',
	},
	profileItems: {
		marginTop: 16,
	},
	profileItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F3F4F6',
	},
	profileItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	profileItemIcon: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: '#F9FAFB',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	profileItemText: {
		flex: 1,
	},
	profileItemTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: '#111827',
		marginBottom: 2,
	},
	profileItemSubtitle: {
		fontSize: 14,
		color: '#6B7280',
	},
	profileItemRight: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
	},
	logoutText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#EF4444',
		marginLeft: 8,
	},
	bottomSpacing: {
		height: 20,
	},
});