import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MemberLayout() {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarActiveTintColor: '#BBF246', // Cor ativa
				tabBarInactiveTintColor: '#999',
				tabBarStyle: {
					backgroundColor: '#fff',
					borderTopWidth: 0.5,
					borderTopColor: '#ccc',
					height: 60,
				},
				tabBarIcon: ({ color, size }) => {
					let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

					if (route.name === 'dashboard') iconName = 'home-outline';
					if (route.name === 'profile') iconName = 'person-outline';

					return <Ionicons name={iconName} size={size} color={color} />;
				},
			})}
		>
			<Tabs.Screen
				name="dashboard"
				options={{
					title: 'Início',
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Perfil',
				}}
			/>
		</Tabs>
	);
}
