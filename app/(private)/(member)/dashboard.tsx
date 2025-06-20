import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function Index() {

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Tela do usuário aluno</Text>
        </View>
    );
}