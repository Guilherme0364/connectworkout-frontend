import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export default function Index() {
    const { role } = useSelector((state: RootState) => state.auth);
    const { name, email } = useSelector((state: RootState) => state.auth);

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