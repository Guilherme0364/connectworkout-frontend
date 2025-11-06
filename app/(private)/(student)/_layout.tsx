/**
 * Student Layout
 *
 * Protects all student routes and provides navigation context
 */

import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function StudentLayout() {
  const { role } = useAuth();

  // If no role (user logged out), return null and let globalLogout handle navigation
  // This prevents competing navigation calls that cause infinite loops
  if (!role) {
    return null;
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
