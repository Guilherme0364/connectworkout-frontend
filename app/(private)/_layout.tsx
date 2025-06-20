import { Slot, Redirect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setRole, setIsLoading } from '../store/slices/authSlice';
import { RootState } from '../store';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { token, role, isLoading } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		const loadSession = async () => {
			try {
				const storedToken = await AsyncStorage.getItem('@token');
				const storedRole = await AsyncStorage.getItem('@role');

				if (storedToken) dispatch(setToken(storedToken));
				if (storedRole === 'student' || storedRole === 'instructor') dispatch(setRole(storedRole as 'student' | 'instructor'));
			} catch (error) {
				console.error('Erro ao carregar sessão:', error);
			} finally {
				dispatch(setIsLoading(false));
			}
		};

		loadSession();
	}, []);

	useEffect(() => {
		if (!isLoading && token && role) {
			if (role === 'student') {
				router.replace('/(private)/(member)/dashboard');
			} else if (role === 'instructor') {
				router.replace('/(private)/(coach)/dashboard');
			}
		}
	}, [isLoading, token, role]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (!token) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	return <Slot />;
}
