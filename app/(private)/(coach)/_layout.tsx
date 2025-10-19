/**
 * Coach Layout
 * 
 * Protects all coach routes and provides navigation context
 */

import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function CoachLayout() {
  const { role } = useAuth();

  // If no role (user logged out), let root routing handle redirect to login
  if (!role) {
    return <Redirect href="/" />;
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
