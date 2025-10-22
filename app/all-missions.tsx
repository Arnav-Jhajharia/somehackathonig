import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// All missions data - synced with explore
const ALL_MISSIONS_DATA: Record<string, any[]> = {
  singapore: [
    {
      id: 'michelin-madness',
      title: 'Michelin Madness',
      reward: 750,
      summary: 'A culinary journey through Singapore\'s finest Michelin-starred restaurants',
      rarity: 'legendary' as const,
      type: 'global' as const,
      category: 'Dining',
      distance: '8.5 km',
      timeEstimate: '6-8 hours',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    },
    {
      id: 'sg-1',
      title: 'Gardens by the Bay Explorer',
      reward: 120,
      summary: 'Visit both Cloud Forest & Flower Dome, plus Supertree Grove',
      rarity: 'rare' as const,
      type: 'local' as const,
      category: 'Nature',
      distance: '2.5 km',
      timeEstimate: '2-3 hours',
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    },
    {
      id: 'sg-2',
      title: 'Marina Bay Sands Skyline',
      reward: 250,
      summary: 'Visit SkyPark Observation Deck and dine at celebrity chef restaurant',
      rarity: 'epic' as const,
      type: 'local' as const,
      category: 'Dining',
      distance: '2.1 km',
      timeEstimate: '2-3 hours',
      imageUrl: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
    },
  ],
  tokyo: [
    {
      id: 'michelin-madness',
      title: 'Michelin Madness',
      reward: 750,
      summary: 'A culinary journey through Tokyo\'s finest Michelin-starred restaurants',
      rarity: 'legendary' as const,
      type: 'global' as const,
      category: 'Dining',
      distance: '12.5 km',
      timeEstimate: '6-8 hours',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    },
    {
      id: 'tokyo-1',
      title: 'Shibuya Crossing Quest',
      reward: 500,
      summary: 'Visit iconic Shibuya Crossing and 4 nearby premium shops',
      rarity: 'legendary' as const,
      type: 'local' as const,
      category: 'Culture',
      distance: '2.3 km',
      timeEstimate: '2-3 hours',
      imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800',
    },
  ],
  nyc: [
    {
      id: 'michelin-madness',
      title: 'Michelin Madness',
      reward: 750,
      summary: 'A culinary journey through NYC\'s finest Michelin-starred restaurants',
      rarity: 'legendary' as const,
      type: 'global' as const,
      category: 'Dining',
      distance: '15.2 km',
      timeEstimate: '6-8 hours',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    },
    {
      id: 'nyc-1',
      title: 'Statue of Liberty & Ellis Island',
      reward: 350,
      summary: 'Take ferry tour and visit both monuments',
      rarity: 'legendary' as const,
      type: 'local' as const,
      category: 'Culture',
      distance: '8.2 km',
      timeEstimate: '4-5 hours',
      imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800',
    },
  ],
  la: [
    {
      id: 'michelin-madness',
      title: 'Michelin Madness',
      reward: 750,
      summary: 'A culinary journey through LA\'s finest Michelin-starred restaurants',
      rarity: 'legendary' as const,
      type: 'global' as const,
      category: 'Dining',
      distance: '18.5 km',
      timeEstimate: '6-8 hours',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    },
    {
      id: 'la-1',
      title: 'Hollywood Sign Hike',
      reward: 220,
      summary: 'Hike to the Hollywood Sign and back',
      rarity: 'epic' as const,
      type: 'local' as const,
      category: 'Nature',
      distance: '12.1 km',
      timeEstimate: '2-3 hours',
      imageUrl: 'https://images.unsplash.com/photo-1518416177092-ec985e4d6c14?w=800',
    },
  ],
};

const CITY_NAMES: Record<string, string> = {
  singapore: 'Singapore',
  tokyo: 'Tokyo',
  nyc: 'New York',
  la: 'Los Angeles',
};

const RARITY_COLORS = {
  common: '#6B7280',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
};

export default function AllMissionsScreen() {
  const insets = useSafeAreaInsets();
  const missions = ALL_MISSIONS.singapore;

  const handleMissionPress = (missionId: string) => {
    Haptics.selectionAsync();
    router.push(`/mission/${missionId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.down" size={24} color="#0B0F14" />
          </Pressable>
        </View>

        <Text style={styles.pageTitle}>All Missions</Text>
        <Text style={styles.pageSubtitle}>
          {missions.length} missions available in Singapore
        </Text>

        {/* Mission Cards */}
        {missions.map((mission) => (
          <Pressable
            key={mission.id}
            onPress={() => handleMissionPress(mission.id)}
            style={({ pressed }) => [
              styles.missionCard,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            {/* Mission Image */}
            <Image source={{ uri: mission.imageUrl }} style={styles.missionImage} />
            
            {/* Badges */}
            <View style={styles.badgesOverlay}>
              <View style={[styles.rarityBadge, { backgroundColor: RARITY_COLORS[mission.rarity] }]}>
                <Text style={styles.rarityText}>{mission.rarity.toUpperCase()}</Text>
              </View>
              {mission.type && (
                <View style={[styles.typeBadge, { backgroundColor: mission.type === 'global' ? '#8B5CF6' : '#10B981' }]}>
                  <Text style={styles.typeText}>{mission.type === 'global' ? '🌍' : '📍'}</Text>
                </View>
              )}
            </View>

            {/* Mission Info */}
            <View style={styles.missionInfo}>
              <Text style={styles.missionTitle}>{mission.title}</Text>
              <Text style={styles.missionSummary}>{mission.summary}</Text>
              
              <View style={styles.missionMeta}>
                <View style={styles.metaItem}>
                  <IconSymbol name="location.fill" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{mission.distance}</Text>
                </View>
                <View style={styles.metaItem}>
                  <IconSymbol name="clock.fill" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{mission.timeEstimate}</Text>
                </View>
                <View style={styles.metaItem}>
                  <IconSymbol name="tag.fill" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{mission.category}</Text>
                </View>
              </View>

              <View style={styles.rewardContainer}>
                <Text style={styles.rewardLabel}>Reward:</Text>
                <Text style={styles.rewardValue}>+${mission.reward} USDC</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7E2DC',
    alignSelf: 'flex-start',
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'Kugile',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 24,
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  missionImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  badgesOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
  },
  typeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 16,
  },
  missionInfo: {
    padding: 20,
  },
  missionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 8,
  },
  missionSummary: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'system font',
    lineHeight: 22,
    marginBottom: 16,
  },
  missionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  rewardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    fontFamily: 'system font',
  },
  rewardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16A34A',
    fontFamily: 'system font',
  },
});

