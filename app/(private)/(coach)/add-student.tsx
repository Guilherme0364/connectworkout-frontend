import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { InstructorService } from '../../services';

export default function AddStudent() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);

	const handleBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace('/(private)/(coach)/(tabs)/students');
		}
	};

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Cross-platform alert helper
	const showAlert = (title: string, message: string, onOk?: () => void) => {
		if (Platform.OS === 'web') {
			window.alert(`${title}\n\n${message}`);
			onOk?.();
		} else {
			Alert.alert(title, message, [
				{
					text: 'OK',
					onPress: onOk,
				},
			]);
		}
	};

	const handleConnect = async () => {
		// Validation
		if (!email.trim()) {
			showAlert('Campo obrigatório', 'Por favor, digite o email do aluno.');
			return;
		}

		if (!validateEmail(email.trim())) {
			showAlert('Email inválido', 'Por favor, digite um email válido.');
			return;
		}

		try {
			setLoading(true);

			// Call API
			await InstructorService.connectWithStudent({
				email: email.trim().toLowerCase(),
			});

			// Success
			showAlert(
				'Aluno conectado!',
				'Agora você pode criar treinos para este aluno.',
				() => {
					router.back(); // Go back to students list
				}
			);
		} catch (error: any) {
			console.error('Error connecting with student:', error);

			// Handle specific error cases
			if (error.response) {
				const status = error.response.status;

				switch (status) {
					case 400:
						showAlert(
							'Erro',
							'O usuário não é um aluno ou já está conectado com você.'
						);
						break;
					case 404:
						showAlert(
							'Aluno não encontrado',
							'Nenhum aluno encontrado com este email.\n\nVerifique se:\n• O email está correto\n• O aluno já criou uma conta no app'
						);
						break;
					case 401:
						showAlert('Sessão expirada', 'Faça login novamente.');
						// Could navigate to login here
						break;
					default:
						showAlert('Erro', 'Não foi possível conectar com o aluno.');
				}
			} else {
				showAlert(
					'Erro de conexão',
					'Verifique sua internet e tente novamente.'
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.keyboardAvoid}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					{/* Header */}
					<View style={styles.header}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={handleBack}
							disabled={loading}
						>
							<Ionicons name="arrow-back" size={24} color="#111827" />
						</TouchableOpacity>
						<Text style={styles.title}>Adicionar Aluno</Text>
					</View>

					<View style={styles.content}>
						{/* Subtitle */}
						<Text style={styles.subtitle}>
							Digite o email que o aluno usou para criar a conta no aplicativo.
						</Text>

						{/* Email Input */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Email do Aluno</Text>
							<View style={styles.inputWrapper}>
								<Ionicons
									name="mail-outline"
									size={20}
									color="#9CA3AF"
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="exemplo@email.com"
									placeholderTextColor="#9CA3AF"
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									autoCorrect={false}
									autoComplete="email"
									editable={!loading}
									returnKeyType="done"
									onSubmitEditing={handleConnect}
								/>
							</View>
						</View>

						{/* Connect Button */}
						<TouchableOpacity
							style={[styles.button, loading && styles.buttonDisabled]}
							onPress={handleConnect}
							disabled={loading}
							activeOpacity={0.8}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<>
									<Ionicons name="person-add" size={20} color="#fff" style={styles.buttonIcon} />
									<Text style={styles.buttonText}>Conectar Aluno</Text>
								</>
							)}
						</TouchableOpacity>

						{/* Info Box */}
						<View style={styles.infoBox}>
							<Ionicons name="information-circle" size={24} color="#3B82F6" />
							<View style={styles.infoTextContainer}>
								<Text style={styles.infoTitle}>Dica</Text>
								<Text style={styles.infoText}>
									Peça ao seu aluno para compartilhar o email que ele usou no cadastro.
									O aluno precisa ter criado uma conta antes de você poder conectá-lo.
								</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F9FAFB',
	},
	keyboardAvoid: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 24,
		backgroundColor: '#F9FAFB',
	},
	backButton: {
		marginRight: 12,
		padding: 4,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: '#111827',
	},
	content: {
		paddingHorizontal: 16,
	},
	subtitle: {
		fontSize: 15,
		color: '#6B7280',
		marginBottom: 32,
		lineHeight: 22,
	},
	inputContainer: {
		marginBottom: 24,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 8,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 12,
		paddingHorizontal: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		paddingVertical: 16,
		fontSize: 16,
		color: '#111827',
	},
	button: {
		backgroundColor: '#3B82F6',
		padding: 18,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 56,
		flexDirection: 'row',
		shadowColor: '#3B82F6',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonIcon: {
		marginRight: 8,
	},
	buttonText: {
		color: '#fff',
		fontSize: 17,
		fontWeight: '600',
	},
	infoBox: {
		marginTop: 32,
		padding: 16,
		backgroundColor: '#EFF6FF',
		borderRadius: 12,
		borderLeftWidth: 4,
		borderLeftColor: '#3B82F6',
		flexDirection: 'row',
	},
	infoTextContainer: {
		flex: 1,
		marginLeft: 12,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 6,
	},
	infoText: {
		fontSize: 14,
		color: '#6B7280',
		lineHeight: 20,
	},
});
