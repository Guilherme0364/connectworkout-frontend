/**
 * Error Handler Utility
 *
 * Centralized error handling for API calls and user notifications
 */

import { Alert, Platform } from 'react-native';
import type { ApiError } from '../types/api.types';

/**
 * Handle API errors with user-friendly messages
 * Shows native alerts on mobile and browser alerts on web
 *
 * @param error - The error object from the API call
 * @param fallbackMessage - Optional custom message to show
 */
export const handleApiError = (error: any, fallbackMessage?: string): void => {
  console.error('API Error:', error);

  // Don't show alert for 401 errors - auth context handles logout automatically
  if (error?.status === 401) {
    console.log('⚠️ 401 error - Auth context will handle logout');
    return;
  }

  // Get user-friendly error message
  const status = error?.status;
  const apiMessage = error?.message;
  let title = 'Erro';
  let message = fallbackMessage || apiMessage || 'Erro desconhecido';

  switch (status) {
    case 400:
      title = 'Dados inválidos';
      // Include validation errors if available
      if (error?.errors && typeof error.errors === 'object') {
        const errorDetails = Object.entries(error.errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        message = `${apiMessage || 'Verifique os dados e tente novamente'}\n\nDetalhes:\n${errorDetails}`;
      } else {
        message = apiMessage || 'Verifique os dados e tente novamente';
      }
      break;
    case 403:
      title = 'Acesso negado';
      message = 'Você não tem permissão para realizar esta ação';
      break;
    case 404:
      title = 'Não encontrado';
      message = apiMessage || 'O recurso solicitado não foi encontrado';
      break;
    case 500:
    case 502:
    case 503:
      title = 'Erro no servidor';
      message = 'Tente novamente mais tarde';
      break;
    default:
      // Network errors or unknown errors
      if (!status) {
        title = 'Erro de conexão';
        message = 'Verifique sua conexão com a internet';
      }
      break;
  }

  // Show alert based on platform
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }
};

/**
 * Show a success message to the user
 *
 * @param title - The title of the success message
 * @param message - The success message text
 */
export const showSuccess = (title: string, message: string): void => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }
};

/**
 * Show a confirmation dialog to the user
 * Returns a Promise that resolves to true if confirmed, false if cancelled
 *
 * @param title - The title of the confirmation dialog
 * @param message - The confirmation message text
 * @param confirmText - Text for the confirm button (default: 'Confirmar')
 * @param cancelText - Text for the cancel button (default: 'Cancelar')
 * @returns Promise<boolean> - true if confirmed, false if cancelled
 */
export const showConfirmation = (
  title: string,
  message: string,
  confirmText: string = 'Confirmar',
  cancelText: string = 'Cancelar'
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      const result = window.confirm(`${title}\n\n${message}`);
      resolve(result);
    } else {
      Alert.alert(
        title,
        message,
        [
          {
            text: cancelText,
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: confirmText,
            style: 'default',
            onPress: () => resolve(true),
          },
        ],
        { cancelable: false }
      );
    }
  });
};

/**
 * Show an informational message to the user
 *
 * @param title - The title of the info message
 * @param message - The info message text
 */
export const showInfo = (title: string, message: string): void => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }
};

// ============================================================================
// Legacy exports for AlertDialog component (if used)
// ============================================================================

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface ErrorAlertData {
  type: AlertType;
  title: string;
  message: string;
}

/**
 * Get alert data for API errors (for use with AlertDialog component)
 * @deprecated Use handleApiError() instead
 */
export const getApiErrorAlert = (error: any, fallbackMessage?: string): ErrorAlertData => {
  const status = error?.status;
  const message = error?.message || fallbackMessage || 'Erro desconhecido';

  switch (status) {
    case 400:
      return { type: 'error', title: 'Dados inválidos', message };
    case 401:
      return { type: 'warning', title: 'Sessão expirada', message: 'Faça login novamente' };
    case 403:
      return { type: 'error', title: 'Acesso negado', message: 'Você não tem permissão para realizar esta ação' };
    case 404:
      return { type: 'info', title: 'Não encontrado', message };
    case 500:
      return { type: 'error', title: 'Erro no servidor', message: 'Tente novamente mais tarde' };
    default:
      return { type: 'error', title: 'Erro', message };
  }
};

/**
 * Get success alert data (for use with AlertDialog component)
 * @deprecated Use showSuccess() instead
 */
export const getSuccessAlert = (title: string, message: string): ErrorAlertData => {
  return { type: 'success', title, message };
};
