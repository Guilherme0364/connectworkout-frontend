import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { Platform } from 'react-native';
import { useEffect } from 'react';

export default function RootLayout() {
	// UTF-8 encoding configuration
	useEffect(() => {
		// React Native uses UTF-8 by default for all text rendering
		// Web: Configured in app.json (charset: utf-8, lang: pt-BR)
		// Native: UTF-8 is the default encoding for iOS and Android
		// This supports all Portuguese special characters: á, à, ã, â, é, ê, í, ó, õ, ô, ú, ç
		if (Platform.OS === 'web') {
			// Ensure document charset is UTF-8
			const meta = document.querySelector('meta[charset]');
			if (!meta) {
				const metaTag = document.createElement('meta');
				metaTag.setAttribute('charset', 'UTF-8');
				document.head.insertBefore(metaTag, document.head.firstChild);
			}
		}
	}, []);

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
