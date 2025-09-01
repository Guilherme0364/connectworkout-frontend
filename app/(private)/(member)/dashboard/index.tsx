import { Text, View } from "react-native";
import { useAuth } from "../../../hooks/useAuth";

export default function Index() {
    const { role } = useAuth();

    if (role !== "student") {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Acesso negado. Você não é um aluno.</Text>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Seja bem-vindo, {name}!</Text>
        </View>
    );
}