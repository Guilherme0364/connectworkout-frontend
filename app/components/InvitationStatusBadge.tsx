/**
 * Invitation Status Badge Component
 *
 * Displays a color-coded badge showing the status of an invitation
 * (pending, accepted, rejected)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InvitationStatusBadgeProps {
  status: 'pending' | 'accepted' | 'rejected';
  size?: 'small' | 'medium';
}

export default function InvitationStatusBadge({ status, size = 'medium' }: InvitationStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendente',
          backgroundColor: '#FEF3C7',
          textColor: '#92400E',
        };
      case 'accepted':
        return {
          label: 'Aceito',
          backgroundColor: '#BBF246', // App primary color
          textColor: '#1F2937', // Dark text for contrast
        };
      case 'rejected':
        return {
          label: 'Rejeitado',
          backgroundColor: '#FEE2E2',
          textColor: '#991B1B',
        };
    }
  };

  const config = getStatusConfig();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        isSmall && styles.badgeSmall,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: config.textColor },
          isSmall && styles.badgeTextSmall,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgeTextSmall: {
    fontSize: 11,
    fontWeight: '500',
  },
});
