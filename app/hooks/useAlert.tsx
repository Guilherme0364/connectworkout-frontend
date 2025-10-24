/**
 * useAlert Hook
 *
 * Hook to manage AlertDialog and ConfirmDialog state
 */

import { useState, useCallback } from 'react';
import type { AlertType } from '../components/AlertDialog';

interface AlertState {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  buttonText?: string;
}

interface ConfirmState {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  icon?: any;
  iconColor?: string;
  onConfirm?: () => void;
}

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = useCallback(
    (type: AlertType, title: string, message: string, buttonText?: string) => {
      setAlertState({
        visible: true,
        type,
        title,
        message,
        buttonText,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  }, []);

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      options?: {
        confirmText?: string;
        cancelText?: string;
        confirmColor?: string;
        icon?: any;
        iconColor?: string;
      }
    ) => {
      setConfirmState({
        visible: true,
        title,
        message,
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
        confirmColor: options?.confirmColor,
        icon: options?.icon,
        iconColor: options?.iconColor,
        onConfirm,
      });
    },
    []
  );

  const hideConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    confirmState.onConfirm?.();
    hideConfirm();
  }, [confirmState.onConfirm, hideConfirm]);

  return {
    // Alert
    alertState,
    showAlert,
    hideAlert,

    // Confirm
    confirmState,
    showConfirm,
    hideConfirm,
    handleConfirm,
  };
};
