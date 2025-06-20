import { StyleSheet } from "react-native";
import { Theme } from "../../styles/theme";

const styles = StyleSheet.create({
	text: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Theme.screen.titleColor,
		textAlign: 'center',
		marginVertical: 10,
	},
});

export { styles };