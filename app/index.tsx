import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from './hooks/useAuth';

export default function Index() {
	const { isAuthenticated, isLoading, role } = useAuth();

	useEffect(() => {
		if (!isLoading && isAuthenticated && role) {
			console.log('User authenticated with role:', role);
		}
	}, [isLoading, isAuthenticated, role]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (isAuthenticated && role) {
		if (role === 'student') {
			return <Redirect href="/(private)/(member)/dashboard" />;
		} else if (role === 'instructor') {
			return <Redirect href="/(private)/(coach)/dashboard/dashboard" />;
		}
	}

	return <Redirect href="/(auth)/sign-in" />;
}
