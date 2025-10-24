/**
 * AlertDialog Component
 *
 * Web-style alert modal for all alert types (success, error, info, warning)
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../styles/theme';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertDialogProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  type,
  title,
  message,
  buttonText = 'OK',
  onClose,
}) => {
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          name: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          color: Theme.colors.success,
        };
      case 'error':
        return {
          name: 'close-circle' as keyof typeof Ionicons.glyphMap,
          color: Theme.colors.error,
        };
      case 'warning':
        return {
          name: 'warning' as keyof typeof Ionicons.glyphMap,
          color: Theme.colors.warning,
        };
      case 'info':
        return {
          name: 'information-circle' as keyof typeof Ionicons.glyphMap,
          color: Theme.colors.info,
        };
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return Theme.colors.success;
      case 'error':
        return Theme.colors.error;
      case 'warning':
        return Theme.colors.warning;
      case 'info':
        return Theme.colors.info;
      default:
        return Theme.colors.primary;
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <View style={styles.iconContainer}>
                <Ionicons name={iconConfig.name} size={56} color={iconConfig.color} />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <Pressable
                style={[styles.button, { backgroundColor: getButtonColor() }]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>{buttonText}</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialog: {
    backgroundColor: Theme.colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.white,
  },
});

export default AlertDialog;
