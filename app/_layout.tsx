import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<AlertProvider>
					<Slot />
				</AlertProvider>
			</AuthProvider>
		</SafeAreaProvider>
	);
}
