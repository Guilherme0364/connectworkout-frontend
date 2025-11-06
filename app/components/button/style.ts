import { StyleSheet } from "react-native";
import { Theme } from "../../styles/theme";

const styles = StyleSheet.create({
	button: {
		width: "50%",
        alignSelf: 'center',
		backgroundColor: Theme.screen.primaryColor,		
		padding: 20,
		alignItems: "center",
		borderRadius: 10,
        marginVertical: 50,

        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
	},
	buttonText: {
		color: Theme.screen.buttonTextColor,
		fontWeight: '600',
		fontSize: 16,
	},
})

export default styles ;