import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Dashboard() {
	const { role } = useAuth();

	// Redirect to role-specific dashboard
	if (role === 'student') {
		return <Redirect href="/(private)/(student)/(tabs)/dashboard" />;
	}

	return <Redirect href="/(private)/(coach)/(tabs)/dashboard" />;
}
