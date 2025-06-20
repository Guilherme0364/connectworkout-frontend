import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme'; // ajusta se o caminho for diferente

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.screen.backgroundColor,
    padding: 24,
    justifyContent: 'center',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.screen.textColor,
    marginBottom: 4,
    marginTop: 12,
  },

  input: {
    backgroundColor: Theme.screen.inputBackgroundColor,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginBottom: -4,
  },

  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  link: {
    color: Theme.screen.primaryColor,
    fontWeight: 'bold',
  },
});

export default styles;