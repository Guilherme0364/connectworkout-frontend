import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function TabsLayout() {
	const { role } = useAuth();

	const getTabBarIcon = (routeName: string, color: string, size: number) => {
		let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

		switch (routeName) {
			case 'index':
				iconName = role === 'student' ? 'home-outline' : 'grid-outline';
				break;
			case 'progress':
				iconName = role === 'student' ? 'trending-up-outline' : 'analytics-outline';
				break;
			case 'schedule':
				iconName = 'calendar-outline';
				break;
			case 'students':
				iconName = 'people-outline';
				break;
			case 'profile':
				iconName = 'person-outline';
				break;
			default:
				iconName = 'home-outline';
		}

		return <Ionicons name={iconName} size={size} color={color} />;
	};

	const getTabTitle = (routeName: string) => {
		switch (routeName) {
			case 'index':
				return role === 'student' ? 'Home' : 'Dashboard';
			case 'progress':
				return role === 'student' ? 'Progress' : 'Analytics';
			case 'schedule':
				return 'Schedule';
			case 'students':
				return 'Students';
			case 'profile':
				return 'Profile';
			default:
				return 'Home';
		}
	};

	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarActiveTintColor: '#3B82F6',
				tabBarInactiveTintColor: '#9CA3AF',
				tabBarStyle: {
					backgroundColor: '#FFFFFF',
					borderTopWidth: 1,
					borderTopColor: '#E5E7EB',
					height: 60,
					paddingBottom: 8,
					paddingTop: 8,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
				},
				tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
			})}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: getTabTitle('index'),
				}}
			/>
			<Tabs.Screen
				name="progress"
				options={{
					title: getTabTitle('progress'),
				}}
			/>
			<Tabs.Screen
				name="schedule"
				options={{
					title: getTabTitle('schedule'),
				}}
			/>
			{role === 'instructor' && (
				<Tabs.Screen
					name="students"
					options={{
						title: getTabTitle('students'),
					}}
				/>
			)}
			<Tabs.Screen
				name="profile"
				options={{
					title: getTabTitle('profile'),
				}}
			/>
		</Tabs>
	);
}