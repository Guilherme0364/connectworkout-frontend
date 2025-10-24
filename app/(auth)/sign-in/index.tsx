import { View, TextInput, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Title from '../../components/title';
import Button from '../../components/button';
import { Link, useRouter } from 'expo-router';
import { useAuthContext } from '../../contexts/AuthContext';
import { styles } from './style';
import { useState } from 'react';

const schema = yup.object().shape({
    email: yup.string().email('Digite um e-mail válido').required('E-mail obrigatório'),
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
});

type FormData = {
    email: string;
    password: string;
}

const SignInScreen = () => {
    const { login } = useAuthContext();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            // Usar a API real através do AuthContext
            await login({
                email: data.email,
                password: data.password
            });

            // Navigation will be handled by the index.tsx middleware
            router.replace('/');
        } catch (error: any) {
            console.error('Login failed:', error);
            const message = error?.message || 'Falha no login. Verifique suas credenciais.';
            setErrorMessage(message);
            alert(message);
        } finally {
            setIsLoading(false);
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

                {/* Error Message */}
                {errorMessage && (
                    <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginVertical: 16 }}>
                        <Text style={{ fontSize: 12, color: '#991B1B', textAlign: 'center' }}>
                            {errorMessage}
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

                {isLoading ? (
                    <ActivityIndicator size="large" color="#BBF246" style={{ marginTop: 20 }} />
                ) : (
                    <Button
                        text="Entrar"
                        color="#BBF246"
                        marginTop={20}
                        onPress={handleSubmit(onSubmit)}
                    />
                )}

                <View style={styles.linkContainer}>
                    <Text>Não tem uma conta? </Text>
                    <Link href="/(auth)/sign-up" style={styles.link}>
                        Registre-se
                    </Link>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default SignInScreen;