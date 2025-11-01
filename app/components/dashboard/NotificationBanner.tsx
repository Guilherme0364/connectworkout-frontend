import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

interface NotificationBannerProps {
  type?: NotificationType;
  title: string;
  message?: string;
  onPress?: () => void;
  onDismiss?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const typeConfig = {
  info: {
    bgColor: '#dbeafe',
    textColor: '#1e40af',
    iconColor: '#3b82f6',
    icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
  },
  warning: {
    bgColor: '#fef3c7',
    textColor: '#92400e',
    iconColor: '#f59e0b',
    icon: 'warning' as keyof typeof Ionicons.glyphMap,
  },
  success: {
    bgColor: '#d1fae5',
    textColor: '#065f46',
    iconColor: '#10b981',
    icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
  },
  error: {
    bgColor: '#fee2e2',
    textColor: '#991b1b',
    iconColor: '#ef4444',
    icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
  },
};

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type = 'info',
  title,
  message,
  onPress,
  onDismiss,
  icon,
}) => {
  const config = typeConfig[type];
  const displayIcon = icon || config.icon;

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, { backgroundColor: config.bgColor }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Ionicons name={displayIcon} size={24} color={config.iconColor} style={styles.icon} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: config.textColor }]}>{title}</Text>
        {message && <Text style={[styles.message, { color: config.textColor }]}>{message}</Text>}
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={20} color={config.iconColor} />
        </TouchableOpacity>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  dismissButton: {
    marginLeft: 8,
    marginTop: 2,
  },
});
