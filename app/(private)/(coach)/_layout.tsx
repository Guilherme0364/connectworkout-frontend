/**
 * Coach Layout
 *
 * Protects all coach routes and provides navigation context
 */

import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function CoachLayout() {
  const { role } = useAuth();

  // If no role (user logged out), return null and let globalLogout handle navigation
  // This prevents competing navigation calls that cause infinite loops
  if (!role) {
    return null;
  }

  // Only allow instructors/coaches to access this section
  if (role !== 'instructor') {
    return <Redirect href="/(private)/(student)/(tabs)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
