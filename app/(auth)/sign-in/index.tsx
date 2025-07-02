import { View, TextInput, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Title } from '../../components/title';
import { Button } from '../../components/button';
import { Link } from 'expo-router';
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
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        console.log('Login:', data);
        // Aqui você chama a função de login do contexto ou Redux
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default SignInScreen;