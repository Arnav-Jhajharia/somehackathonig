import { Rings } from '@/components/Rings';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LocalPlace = {
  id: string;
  name: string;
  area: string;
  emoji: string;
  gradient: [string, string];
  missions: number;
  isWildcard?: boolean;
};

type RecentReward = {
  id: string;
  missionName: string;
  amount: number;
  date: Date;
  type: 'USDC' | 'APY_BOOST';
  apyBoost?: number;
};

// Current location: Singapore
// Shows 3 local places + 1 nearby international wildcard
// Using subtle colors: Slate, Charcoal, Gold
const LOCAL_PLACES: LocalPlace[] = [
  { id: 'marina-bay', name: 'Marina Bay', area: 'Central', emoji: '🏙️', gradient: ['#475569', '#334155'], missions: 8 },
  { id: 'orchard', name: 'Orchard Road', area: 'Shopping District', emoji: '🛍️', gradient: ['#1E293B', '#0F172A'], missions: 5 },
  { id: 'sentosa', name: 'Sentosa', area: 'Island Resort', emoji: '🏖️', gradient: ['#64748B', '#475569'], missions: 6 },
  { id: 'bali-wildcard', name: 'Bali', area: 'Indonesia 🌟', emoji: '🌴', gradient: ['#B89A5C', '#9A7D3F'], missions: 12, isWildcard: true },
];

const RECENT_REWARDS: RecentReward[] = [
  { id: '1', missionName: 'Gardens by the Bay Explorer', amount: 120, date: new Date(Date.now() - 3600000), type: 'USDC' },
  { id: '2', missionName: 'Marina Bay Sands Skyline', amount: 250, date: new Date(Date.now() - 86400000), type: 'USDC', apyBoost: 0.5 },
  { id: '3', missionName: 'Hawker Heritage Trail', amount: 80, date: new Date(Date.now() - 172800000), type: 'USDC' },
  { id: '4', missionName: 'Sentosa Beach Day', amount: 150, date: new Date(Date.now() - 259200000), type: 'USDC', apyBoost: 0.3 },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Home</Text>
        <Pressable 
          onPress={() => router.push('/(tabs)/card')}
          style={styles.cardIconButton}
        >
          <IconSymbol name="creditcard.fill" size={24} color="#0B0F14" />
        </Pressable>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.balance}>$127,450.82</Text>
        <Text style={styles.balanceLabel}>Total Vault Balance</Text>
        <View style={styles.ringsContainer}>
          <InteractiveRings />
        </View>
      </View>

      {/* Where do you wanna go today? */}
      <Text style={styles.sectionTitle}>Where do you wanna go today?</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.destinationsScroll}
      >
        {LOCAL_PLACES.map((place) => (
          <Pressable 
            key={place.id}
            onPress={() => router.push('/(tabs)/explore')}
            style={[
              styles.destinationCard, 
              { backgroundColor: place.gradient[0] },
              place.isWildcard && styles.wildcardCard
            ]}
          >
            {place.isWildcard && (
              <View style={styles.wildcardBadge}>
                <Text style={styles.wildcardText}>✨ Wildcard</Text>
              </View>
            )}
            <Text style={styles.destinationEmoji}>{place.emoji}</Text>
            <Text style={styles.destinationName}>{place.name}</Text>
            <Text style={styles.destinationCountry}>{place.area}</Text>
            <Text style={styles.destinationMissions}>{place.missions} missions</Text>
          </Pressable>
        ))}
        <Pressable 
          onPress={() => router.push('/(tabs)/explore')}
          style={styles.exploreCard}
        >
          <IconSymbol name="globe" size={32} color="#0B0F14" />
          <Text style={styles.exploreText}>Explore</Text>
          <Text style={styles.exploreSubtext}>All Missions</Text>
        </Pressable>
      </ScrollView>

      {/* Recent Rewards */}
      <Text style={styles.sectionTitle}>Your Recent Rewards</Text>
      <View style={styles.rewardsContainer}>
        {RECENT_REWARDS.map((reward) => (
          <View key={reward.id} style={styles.rewardCard}>
            <View style={styles.rewardLeft}>
              <View style={styles.rewardIconContainer}>
                <Text style={styles.rewardIcon}>💰</Text>
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardMission}>{reward.missionName}</Text>
                <Text style={styles.rewardTime}>{formatTimeAgo(reward.date)}</Text>
              </View>
            </View>
            <View style={styles.rewardRight}>
              <Text style={styles.rewardAmount}>+${reward.amount}</Text>
              {reward.apyBoost && (
                <Text style={styles.rewardBoost}>+{reward.apyBoost}% APY</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.badgesHeader}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <Pressable 
          onPress={() => router.push('/badges')}
          style={styles.viewAllBadgesButton}
        >
          <Text style={styles.viewAllBadgesText}>View All</Text>
          <IconSymbol name="chevron.right" size={16} color="#8B5CF6" />
        </Pressable>
      </View>
      <View style={styles.badgesRow}>
        <Pressable onPress={() => router.push('/badges')} style={styles.badgeTile}>
          <Text style={styles.badgeEmoji}>🌍</Text>
          <Text style={styles.badgeLabel}>Globe Trotter</Text>
          <Text style={styles.badgeProgress}>1/3</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/badges')} style={styles.badgeTile}>
          <Text style={styles.badgeEmoji}>✈️</Text>
          <Text style={styles.badgeLabel}>Explorer</Text>
          <Text style={styles.badgeProgress}>1/5</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/badges')} style={styles.badgeTile}>
          <Text style={styles.badgeEmoji}>⭐</Text>
          <Text style={styles.badgeLabel}>Michelin Master</Text>
          <Text style={styles.badgeProgress}>0/3</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function InteractiveRings() {
  const [active, setActive] = React.useState<0 | 1 | 2>(0);
  const rings = [
    { progress: 0.85, colors: ['#2563EB', '#60A5FA'] as [string, string], label: 'APY', valueText: '8.5%' },
    { progress: 0.7, colors: ['#16A34A', '#86EFAC'] as [string, string], label: 'Missions', valueText: '70%' },
    { progress: 0.35, colors: ['#F59E0B', '#FBBF24'] as [string, string], label: 'Countries', valueText: '12' },
  ];
  return <Rings size={300} rings={rings as any} activeIndex={active} onActiveChange={setActive} gap={12} dimOpacity={0.15} />;
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 16, backgroundColor: '#FAFAF8', paddingBottom: 16 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'Kugile',
  },
  cardIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  statsContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  balance: { 
    fontSize: 40, 
    fontWeight: '700', 
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  balanceLabel: { 
    fontSize: 14, 
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 20,
  },
  ringsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#0B0F14', fontFamily: 'system font', marginBottom: 16 },
  destinationsScroll: {
    paddingRight: 16,
    gap: 12,
    marginBottom: 24,
  },
  destinationCard: {
    width: 180,
    height: 180,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  wildcardCard: {
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  wildcardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  wildcardText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B89A5C',
    fontFamily: 'system font',
  },
  destinationEmoji: {
    fontSize: 48,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  destinationCountry: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    fontFamily: 'system font',
    marginBottom: 8,
  },
  destinationMissions: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.85,
    fontFamily: 'system font',
    fontWeight: '600',
  },
  exploreCard: {
    width: 180,
    height: 180,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E7E2DC',
    borderStyle: 'dashed',
  },
  exploreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginTop: 12,
  },
  exploreSubtext: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'system font',
    marginTop: 4,
  },
  rewardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  rewardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rewardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIcon: {
    fontSize: 24,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardMission: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 2,
  },
  rewardTime: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  rewardRight: {
    alignItems: 'flex-end',
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
    fontFamily: 'system font',
  },
  rewardBoost: {
    fontSize: 12,
    color: '#3B82F6',
    fontFamily: 'system font',
    fontWeight: '600',
    marginTop: 2,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllBadgesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllBadgesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    fontFamily: 'system font',
  },
  horizontal: { flexDirection: 'row', gap: 12 },
  missionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOpacity: 0.04,
    shadowRadius: 18,
  },
  missionTitle: { fontSize: 16, fontWeight: '700', color: '#0B0F14', fontFamily: 'system font' },
  missionMeta: { fontSize: 13, color: '#6B7280', marginTop: 4, fontFamily: 'system font' },
  missionReward: { fontSize: 14, color: '#16A34A', marginTop: 8, fontWeight: '600', fontFamily: 'system font' },
  badgesRow: { flexDirection: 'row', gap: 12 },
  badgeTile: { 
    flex: 1,
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    paddingVertical: 16, 
    paddingHorizontal: 12, 
    borderWidth: 1, 
    borderColor: '#E7E2DC', 
    shadowColor: '#0B0F14', 
    shadowOpacity: 0.04, 
    shadowRadius: 12 
  },
  badgeEmoji: { 
    fontSize: 36,
    marginBottom: 8,
  },
  badgeLabel: { 
    color: '#0B0F14', 
    fontSize: 12, 
    fontWeight: '600', 
    fontFamily: 'system font',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeProgress: {
    fontSize: 11,
    color: '#8B5CF6',
    fontFamily: 'system font',
    fontWeight: '600',
  },
});
