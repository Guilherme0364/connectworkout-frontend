import { Slot } from 'expo-router';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';

export default function RootLayout() {
	return (
		<AuthProvider>
			<AlertProvider>
				<Slot />
			</AlertProvider>
		</AuthProvider>
	);
}
