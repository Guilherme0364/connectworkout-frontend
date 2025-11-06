/**
 * Invitation Card Component
 *
 * Reusable card for displaying invitation details with actions
 * Used by both instructors (to show sent invitations) and students (to show received invitations)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InvitationStatusBadge from './InvitationStatusBadge';

interface InvitationCardProps {
  name: string;
  email: string;
  description?: string;
  studentCount?: number;
  status: 'pending' | 'accepted' | 'rejected';
  invitedAt: string;
  onPress?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function InvitationCard({
  name,
  email,
  description,
  studentCount,
  status,
  invitedAt,
  onPress,
  onCancel,
  showCancelButton = false,
}: InvitationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const CardContent = (
    <>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={24} color="#6B7280" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
          {studentCount !== undefined && (
            <Text style={styles.studentCount}>
              {studentCount} {studentCount === 1 ? 'aluno' : 'alunos'}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <InvitationStatusBadge status={status} size="small" />
          <Text style={styles.date}>Convidado em {formatDate(invitedAt)}</Text>
        </View>

        {showCancelButton && status === 'pending' && onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{CardContent}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 18,
  },
  studentCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metaInfo: {
    flex: 1,
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
  },
});
