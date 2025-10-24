/**
 * Alert Context
 *
 * Global context for managing AlertDialog and ConfirmDialog throughout the app
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AlertDialog, { AlertType } from '../components/AlertDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { Theme } from '../styles/theme';

interface AlertContextType {
  showAlert: (type: AlertType, title: string, message: string, buttonText?: string, onClose?: () => void) => void;
  showConfirm: (
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
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertState {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  buttonText?: string;
  onClose?: () => void;
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

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
    (type: AlertType, title: string, message: string, buttonText?: string, onClose?: () => void) => {
      setAlertState({
        visible: true,
        type,
        title,
        message,
        buttonText,
        onClose,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    const callback = alertState.onClose;
    setAlertState((prev) => ({ ...prev, visible: false }));
    // Call onClose callback after a small delay to allow animation to complete
    if (callback) {
      setTimeout(callback, 100);
    }
  }, [alertState.onClose]);

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

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      <AlertDialog
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        buttonText={alertState.buttonText}
        onClose={hideAlert}
      />

      <ConfirmDialog
        visible={confirmState.visible}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        confirmColor={confirmState.confirmColor}
        icon={confirmState.icon}
        iconColor={confirmState.iconColor}
        onConfirm={handleConfirm}
        onCancel={hideConfirm}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
