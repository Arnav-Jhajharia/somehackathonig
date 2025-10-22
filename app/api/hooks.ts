import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Mission, ProgressSummary, RewardEntry, User, Vault } from '../types';
import { api } from './client';

export const useMe = () =>
  useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/me')).data.data,
  });

export const useMissions = (geo?: { lat: number; lng: number; radius: number }) =>
  useQuery<Mission[]>({
    queryKey: ['missions', geo],
    queryFn: async () => (await api.get('/missions', { params: geo })).data.data,
  });

export const useMission = (id: string) =>
  useQuery<Mission>({
    queryKey: ['mission', id],
    queryFn: async () => (await api.get(`/missions/${id}`)).data.data,
    enabled: !!id,
  });

export const useStartMission = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.post(`/missions/${id}/start`)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['mission', id] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};

export const useProgress = () =>
  useQuery<ProgressSummary[]>({
    queryKey: ['progress'],
    queryFn: async () => (await api.get('/missions/progress')).data.data,
  });

export const useVault = () =>
  useQuery<Vault>({
    queryKey: ['vault'],
    queryFn: async () => (await api.get('/vault')).data.data,
  });

export const useRewards = (cursor?: string) =>
  useQuery<RewardEntry[]>({
    queryKey: ['rewards', cursor],
    queryFn: async () => (await api.get('/rewards/ledger', { params: { cursor, limit: 50 } })).data.data,
  });

export const useMissionsBBox = (bbox?: { north: number; south: number; east: number; west: number }) =>
  useQuery<Mission[]>({
    queryKey: ['missions-bbox', bbox],
    queryFn: async () => (await api.get('/missions', { params: bbox })).data.data,
  });

export const usePlanTrip = () => {
  return async (destination: string, start: string, end: string) => {
    return [
      { title: `${destination || 'City'} Coffee Crawl`, summary: 'Visit 5 premium cafés', projectedReward: 120, apyImpact: 0.2 },
      { title: 'Culinary Trail', summary: 'Dine at 3 partner restaurants', projectedReward: 250, apyImpact: 0.35 },
      { title: 'Museum Day', summary: 'Spend across 2 cultural spots', projectedReward: 80, apyImpact: 0.1 },
    ];
  };
};