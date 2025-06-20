import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';

export const styles = StyleSheet.create({
	container: {
		padding: 20,
		flex: 1,
		justifyContent: 'center',
		backgroundColor: Theme.screen.backgroundColor,
	},

	logo: {
		width: 100,
		height: 100,
		alignSelf: 'center',
		marginBottom: 20,
	},

	input: {
		backgroundColor: Theme.components.inputBackground,
		padding: 12,
		borderRadius: 8,
		marginBottom: 4,
		borderWidth: 1,
		borderColor: Theme.components.inputBorder,
	},

	inputError: {
		borderColor: Theme.components.inputError,
	},

	errorText: {
		color: Theme.components.inputError,
		marginBottom: 8,
	},

	picker: {
		height: 40,
		width: '100%',
		backgroundColor: Theme.components.inputBackground,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Theme.components.inputBorder,
		marginBottom: 8,
		paddingHorizontal: 12,
	},

	linkText: {
		textAlign: 'center',
		marginTop: 16,
	},

	linkHighlight: {
		color: Theme.screen.primaryColor,
	},
});
