import { StyleSheet } from 'react-native';
import { Theme } from '../../../styles/theme';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Theme.screen.backgroundColor,
  },

  input: {
    backgroundColor: Theme.components.inputBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.components.inputBorder,
  },

  linkText: {
    textAlign: 'center',
    marginTop: 16,
  },

  linkHighlight: {
    color: Theme.screen.primaryColor,
  },
});

export default styles;