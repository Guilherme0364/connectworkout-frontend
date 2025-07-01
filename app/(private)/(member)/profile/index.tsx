import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Button } from '../../../components/button';
import { Title } from '../../../components/title';
import styles from './style';

type FormData = {
    name: string;
    email: string;
};

export default function ProfileScreen() {
    // Obtém os dados do usuário do Redux, "!" é usado para garantir que o valor não seja nulo
    const name = useSelector((state: RootState) => state.auth.name)!;
    const email = useSelector((state: RootState) => state.auth.email)!;

    const {
        control,
        handleSubmit,
        formState: { isDirty }, // Verifica se algum campo foi alterado
    } = useForm<FormData>({
        defaultValues: {
            name,
            email,
        },
    });

    const onSubmit = (data: FormData) => {
        console.log('Atualizando dados:', data);
        // Aqui vai lógica real pra API futuramente
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <Title text="Perfil" fontSize={24} marginBottom={16} />

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Nome completo"
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />

                <Button
                    text="Salvar alterações"
                    onPress={handleSubmit(onSubmit)}
                    color={isDirty ? '#3DAD3D' : '#666'} // Verde se alterado, cinza escuro se intacto
                    marginTop={24}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
