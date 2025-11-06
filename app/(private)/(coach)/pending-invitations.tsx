/**
 * Pending Invitations Screen (Coach)
 *
 * Displays all invitations sent by the coach/instructor
 * Shows pending, accepted, and rejected invitations with filtering options
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InstructorService } from '../../services';
import { InstructorInvitationDto } from '../../types/api.types';
import EmptyState from '../../components/EmptyState';
import InvitationCard from '../../components/InvitationCard';

export default function PendingInvitationsScreen() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<InstructorInvitationDto[]>([]);
  const [filteredInvitations, setFilteredInvitations] = useState<InstructorInvitationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    loadInvitations();
  }, []);

  useEffect(() => {
    filterInvitations();
  }, [invitations, selectedFilter]);

  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      const data = await InstructorService.getInvitations();
      setInvitations(data);
    } catch (error: any) {
      console.error('Failed to load invitations:', error);
      Alert.alert('Erro', 'Não foi possível carregar os convites');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInvitations();
    setRefreshing(false);
  };

  const filterInvitations = () => {
    if (selectedFilter === 'all') {
      setFilteredInvitations(invitations);
    } else {
      // Map filter string to status number: pending=0, accepted=1, rejected=2
      const statusMap = { pending: 0, accepted: 1, rejected: 2 };
      const statusValue = statusMap[selectedFilter];
      setFilteredInvitations(
        invitations.filter((inv) => inv.status === statusValue)
      );
    }
  };

  const handleCancelInvitation = async (invitationId: number, studentName: string) => {
    Alert.alert(
      'Cancelar Convite',
      `Tem certeza que deseja cancelar o convite para ${studentName}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await InstructorService.cancelInvitation(invitationId);
              Alert.alert('Sucesso', 'Convite cancelado com sucesso');
              await loadInvitations();
            } catch (error: any) {
              console.error('Failed to cancel invitation:', error);
              Alert.alert('Erro', 'Não foi possível cancelar o convite');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(private)/(coach)/(tabs)/dashboard');
    }
  };

  const getFilterCount = (filter: 'all' | 'pending' | 'accepted' | 'rejected') => {
    if (filter === 'all') return invitations.length;
    // Map filter string to status number: pending=0, accepted=1, rejected=2
    const statusMap = { pending: 0, accepted: 1, rejected: 2 };
    const statusValue = statusMap[filter];
    return invitations.filter((inv) => inv.status === statusValue).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Convites Enviados</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.filterTabTextActive]}>
              Todos ({getFilterCount('all')})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'pending' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'pending' && styles.filterTabTextActive]}>
              Pendentes ({getFilterCount('pending')})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'accepted' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('accepted')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'accepted' && styles.filterTabTextActive]}>
              Aceitos ({getFilterCount('accepted')})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'rejected' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('rejected')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'rejected' && styles.filterTabTextActive]}>
              Rejeitados ({getFilterCount('rejected')})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#BBF246" />
            <Text style={styles.loadingText}>Carregando convites...</Text>
          </View>
        ) : filteredInvitations.length === 0 ? (
          <EmptyState
            icon="mail-outline"
            title={
              selectedFilter === 'all'
                ? 'Nenhum convite enviado'
                : selectedFilter === 'pending'
                ? 'Nenhum convite pendente'
                : selectedFilter === 'accepted'
                ? 'Nenhum convite aceito'
                : 'Nenhum convite rejeitado'
            }
            description={
              selectedFilter === 'all'
                ? 'Você ainda não enviou convites para alunos'
                : `Não há convites ${
                    selectedFilter === 'pending'
                      ? 'aguardando resposta'
                      : selectedFilter === 'accepted'
                      ? 'aceitos'
                      : 'rejeitados'
                  } no momento`
            }
            iconColor="#9CA3AF"
          />
        ) : (
          filteredInvitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              name={invitation.student.name}
              email={invitation.student.email}
              status={invitation.statusName.toLowerCase() as 'pending' | 'accepted' | 'rejected'}
              invitedAt={invitation.invitedAt}
              showCancelButton={true}
              onCancel={
                invitation.status === 0 // 0 = Pending
                  ? () => handleCancelInvitation(invitation.id, invitation.student.name)
                  : undefined
              }
            />
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#BBF246',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 24,
  },
});
