import { TextInput, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/button';
import { Title } from '../../components/title';
import { useRouter } from 'expo-router';
import { styles } from './style';

const schema = Yup.object({
    name: Yup.string().required('Digite seu nome'),
    email: Yup.string().email('Email inválido').required('Digite seu e-mail'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Digite sua senha'),
    role: Yup.string().oneOf(['student', 'instructor']).required(),
});

type FormData = {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'instructor';
};

export default function SignUpScreen() {
    const { login } = useAuth();
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'student',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const receivedToken = 'TOKEN_EXEMPLO';
            
            await login(receivedToken, data.role);
            
            // Navigation will be handled automatically by the index.tsx middleware
            router.replace('/');
        } catch (error) {
            console.error('Erro ao registrar:', error);
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
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Title text="CONNECT WORKOUT" fontSize={18} marginBottom={8} />
                <Title text="Registre-se" fontSize={24} marginBottom={16} />

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Digite seu nome"
                            style={[
                                styles.input,
                                errors.email && styles.inputError,
                            ]}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="default"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Digite o email"
                            style={[
                                styles.input,
                                errors.email && styles.inputError,
                            ]}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Digite a senha"
                            style={[
                                styles.input,
                                errors.password && styles.inputError,
                            ]}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <Controller
                    control={control}
                    name="role"
                    render={({ field: { onChange, value } }) => (
                        <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                            <Picker.Item label="Aluno" value="student" />
                            <Picker.Item label="Instrutor" value="instructor" />
                        </Picker>
                    )}
                />
                {errors.role && <Text style={styles.errorText}>{errors.role.message}</Text>}

                <Button text="Registre-se" marginTop={16} onPress={handleSubmit(onSubmit)} />

                <Text style={styles.linkText}>
                    Já tem uma conta? <Text style={styles.linkHighlight}>Entrar</Text>
                </Text>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
