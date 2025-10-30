import { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import { setRouter } from './utils/globalLogout';

export default function Index() {
	const { isAuthenticated, isLoading, role, token } = useAuth();
	const router = useRouter();
	const routerSetRef = useRef(false);

	// Set router instance for global logout only once
	useEffect(() => {
		if (!routerSetRef.current) {
			setRouter(router);
			routerSetRef.current = true;
		}
	}, [router]);

	// Debug logging only on mount
	useEffect(() => {
		console.log('=== INDEX ROUTE MOUNTED ===');
		console.log('Initial auth state:', { isLoading, isAuthenticated, role, token: token ? '***' : null });
		console.log('===========================');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	// Show loading spinner while checking authentication
	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
				<ActivityIndicator size="large" color="#BBF246" />
			</View>
		);
	}

	// Redirect based on auth state
	if (isAuthenticated && role && token) {
		return <Redirect href="/(private)/(tabs)" />;
	}

	return <Redirect href="/(auth)/sign-in" />;
}
