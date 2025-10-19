/**
 * Main Tabs Layout (Simplified)
 *
 * Only shows Home tab that redirects to role-specific section
 * and a shared Profile tab
 */

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function TabsLayout() {
	const { role } = useAuth();

	return (
		<Tabs
			screenOptions={{
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
			}}
		>
			{/* Home - Redirects to role-specific dashboard */}
			<Tabs.Screen
				name="index"
				options={{
					title: role === 'student' ? 'Home' : 'Dashboard',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name={role === 'student' ? 'home-outline' : 'grid-outline'}
							size={size}
							color={color}
						/>
					),
				}}
			/>

			{/* Profile - Shared */}
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Perfil',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
