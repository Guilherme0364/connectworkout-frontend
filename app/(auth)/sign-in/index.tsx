import { View, TextInput, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Title from '../../components/title';
import Button from '../../components/button';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { styles } from './style';

const schema = yup.object().shape({
    email: yup.string().email('Digite um e-mail válido').required('E-mail obrigatório'),
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
});

type FormData = {
    email: string;
    password: string;
}

const SignInScreen = () => {
    const { login, clearDevStorage } = useAuth();
    const router = useRouter();
    
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            // TODO: Replace with actual API call
            // Example: const response = await authService.login(data.email, data.password);
            
            // For now, validate credentials and reject invalid attempts
            if (!data.email || !data.password) {
                throw new Error('Email and password are required');
            }
            
            // Mock validation - in development, require specific credentials
            if (data.email === 'student@test.com' && data.password === 'password123') {
                await login('valid_token_student', 'student');
            } else if (data.email === 'instructor@test.com' && data.password === 'password123') {
                await login('valid_token_instructor', 'instructor');
            } else {
                throw new Error('Invalid email or password');
            }
            
            // Navigation will be handled by the index.tsx middleware
            router.replace('/');
        } catch (error) {
            console.error('Login failed:', error);
            // TODO: Show error message to user
            alert(error instanceof Error ? error.message : 'Login failed');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <Image
                    source={require('../../../assets/images/connect-workout-logo.png')}
                    style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 20 }}
                    resizeMode="contain"
                />

                <Title text="CONNECT WORKOUT" fontSize={12} />

                <Title text="Entrar" fontSize={20} />

                {/* Development Info */}
                {__DEV__ && (
                    <View style={{ backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, marginVertical: 16 }}>
                        <Text style={{ fontSize: 12, color: '#92400E', textAlign: 'center', marginBottom: 4 }}>
                            Credenciais de teste:
                        </Text>
                        <Text style={{ fontSize: 10, color: '#92400E', textAlign: 'center' }}>
                            Aluno: student@test.com / password123
                        </Text>
                        <Text style={{ fontSize: 10, color: '#92400E', textAlign: 'center' }}>
                            Instrutor: instructor@test.com / password123
                        </Text>
                    </View>
                )}

                <Text style={styles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                <Text style={styles.label}>Senha</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a senha"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                <Button
                    text="Entrar"
                    color="#A9F13C"
                    marginTop={20}
                    onPress={handleSubmit(onSubmit)}
                />

                <View style={styles.linkContainer}>
                    <Text>Não tem uma conta? </Text>
                    <Link href="/(auth)/sign-up" style={styles.link}>
                        Registre-se
                    </Link>
                </View>

                {/* Development Debug Button */}
                {__DEV__ && (
                    <Button
                        text="Clear Storage (Dev)"
                        color="#EF4444"
                        marginTop={20}
                        onPress={clearDevStorage}
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default SignInScreen;