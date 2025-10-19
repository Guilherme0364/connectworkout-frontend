/**
 * Error Handler Utility
 *
 * Centralized error handling for API calls
 */

import { Alert } from 'react-native';
import type { ApiError } from '../types/api.types';

/**
 * Handle API errors with user-friendly messages
 * @param error - The error object from the API call
 * @param fallbackMessage - Optional custom message to show
 */
export const handleApiError = (error: any, fallbackMessage?: string): void => {
  console.error('API Error:', error);

  // If it's an ApiError from our client
  const status = error?.status;
  const message = error?.message || fallbackMessage || 'Erro desconhecido';

  switch (status) {
    case 400:
      Alert.alert('Dados inválidos', message);
      break;
    case 401:
      Alert.alert('Sessão expirada', 'Faça login novamente');
      break;
    case 403:
      Alert.alert('Acesso negado', 'Você não tem permissão para realizar esta ação');
      break;
    case 404:
      Alert.alert('Não encontrado', message);
      break;
    case 500:
      Alert.alert('Erro no servidor', 'Tente novamente mais tarde');
      break;
    default:
      Alert.alert('Erro', message);
  }
};

/**
 * Show a success message
 * @param title - The title of the alert
 * @param message - The message to show
 */
export const showSuccess = (title: string, message: string): void => {
  Alert.alert(title, message);
};

/**
 * Show a confirmation dialog
 * @param title - The title of the alert
 * @param message - The message to show
 * @param onConfirm - Callback when user confirms
 * @param onCancel - Optional callback when user cancels
 */
export const showConfirmation = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirmar',
        onPress: onConfirm,
      },
    ],
    { cancelable: true }
  );
};
