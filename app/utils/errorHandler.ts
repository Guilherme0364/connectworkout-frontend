/**
 * Error Handler Utility
 *
 * Centralized error handling for API calls
 * NOTE: These functions return error details that should be used with AlertDialog component
 */

import type { ApiError } from '../types/api.types';
import type { AlertType } from '../components/AlertDialog';

export interface ErrorAlertData {
  type: AlertType;
  title: string;
  message: string;
}

/**
 * Get alert data for API errors
 * @param error - The error object from the API call
 * @param fallbackMessage - Optional custom message to show
 * @returns Alert data to be used with AlertDialog
 */
export const getApiErrorAlert = (error: any, fallbackMessage?: string): ErrorAlertData => {
  console.error('API Error:', error);

  // If it's an ApiError from our client
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
 * Get success alert data
 * @param title - The title of the alert
 * @param message - The message to show
 * @returns Alert data to be used with AlertDialog
 */
export const getSuccessAlert = (title: string, message: string): ErrorAlertData => {
  return { type: 'success', title, message };
};
