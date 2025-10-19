/**
 * Student Layout
 * 
 * Protects all student routes and provides navigation context
 */

import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function StudentLayout() {
  const { role } = useAuth();

  // If no role (user logged out), let root routing handle redirect to login
  if (!role) {
    return <Redirect href="/" />;
  }

  // Only allow students to access this section
  if (role !== 'student') {
    return <Redirect href="/(private)/(coach)/(tabs)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
