import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthLayout() {
	const router = useRouter();
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			// If user is authenticated, redirect to main route which will handle role-based routing
			router.replace('/');
		}
	}, [isLoading, isAuthenticated, router]);

	return <Slot />;
}
