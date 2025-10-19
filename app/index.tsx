import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from './hooks/useAuth';

export default function Index() {
	const { isAuthenticated, isLoading, role, token } = useAuth();

	// Debug logging only on mount to avoid infinite loops during logout
	useEffect(() => {
		console.log('=== INDEX ROUTE MOUNTED ===');
		console.log('Initial auth state:', { isLoading, isAuthenticated, role, token: token ? '***' : null });
		console.log('===========================');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	// Show loading spinner while checking authentication
	if (isLoading) {
		console.log('⏳ Showing loading screen...');
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
				<ActivityIndicator size="large" color="#3B82F6" />
			</View>
		);
	}

	// Only redirect to private area if user has all required auth data
	if (isAuthenticated && role && token) {
		console.log('🚀 Redirecting to dashboard with role:', role);
		return <Redirect href="/(private)/(tabs)" />;
	}

	// Default to login screen for unauthenticated users
	console.log('🔒 Redirecting to login screen');
	return <Redirect href="/(auth)/sign-in" />;
}
