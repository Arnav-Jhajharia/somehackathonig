import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MissionStep = {
  id: string;
  title: string;
  description: string;
  location: string;
  completed: boolean;
  reward: number;
  apyBenefit: number;
};

type ActiveMission = {
  id: string;
  name: string;
  country: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'global' | 'local';
  imageUrl: string;
  progress: number; // 0-100
  totalReward: number;
  earnedReward: number;
  totalAPYBoost: number;
  earnedAPYBoost: number;
  steps: MissionStep[];
  canClaim: boolean;
};

const RARITY_COLORS: Record<string, string> = {
  common: '#6B7280',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
};

// Mock active missions
const ACTIVE_MISSIONS: ActiveMission[] = [
  {
    id: 'michelin-madness',
    name: 'Michelin Madness',
    country: 'Singapore',
    rarity: 'legendary',
    type: 'global',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    progress: 50,
    totalReward: 750,
    earnedReward: 200,
    totalAPYBoost: 2.5,
    earnedAPYBoost: 0.5,
    steps: [
      {
        id: 'step-1',
        title: 'Les Amis',
        description: 'Dine at this 3-Michelin star French restaurant',
        location: 'Shaw Centre, Orchard',
        completed: true,
        reward: 200,
        apyBenefit: 0.5,
      },
      {
        id: 'step-2',
        title: 'Odette',
        description: 'Modern French cuisine at National Gallery',
        location: 'National Gallery',
        completed: false,
        reward: 250,
        apyBenefit: 0.8,
      },
      {
        id: 'step-3',
        title: 'Burnt Ends',
        description: 'Experience wood-fired BBQ excellence',
        location: 'Dempsey Hill',
        completed: false,
        reward: 150,
        apyBenefit: 0.5,
      },
      {
        id: 'step-4',
        title: 'Zen',
        description: 'Nordic-inspired fine dining',
        location: 'Bukit Pasoh Road',
        completed: false,
        reward: 150,
        apyBenefit: 0.7,
      },
    ],
    canClaim: true,
  },
  {
    id: 'sg-1',
    name: 'Gardens by the Bay Explorer',
    country: 'Singapore',
    rarity: 'rare',
    type: 'local',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    progress: 100,
    totalReward: 120,
    earnedReward: 120,
    totalAPYBoost: 1.0,
    earnedAPYBoost: 1.0,
    steps: [
      {
        id: 'step-a',
        title: 'Cloud Forest',
        description: 'Explore the misty mountain ecosystem',
        location: 'Gardens by the Bay',
        completed: true,
        reward: 40,
        apyBenefit: 0.3,
      },
      {
        id: 'step-b',
        title: 'Flower Dome',
        description: 'Visit the world\'s largest glass greenhouse',
        location: 'Gardens by the Bay',
        completed: true,
        reward: 40,
        apyBenefit: 0.3,
      },
      {
        id: 'step-c',
        title: 'Supertree Grove',
        description: 'Walk the OCBC Skyway at sunset',
        location: 'Gardens by the Bay',
        completed: true,
        reward: 40,
        apyBenefit: 0.4,
      },
    ],
    canClaim: true,
  },
  {
    id: 'sg-2',
    name: 'Marina Bay Sands Skyline',
    country: 'Singapore',
    rarity: 'epic',
    type: 'local',
    imageUrl: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
    progress: 33,
    totalReward: 250,
    earnedReward: 0,
    totalAPYBoost: 1.5,
    earnedAPYBoost: 0,
    steps: [
      {
        id: 'step-x',
        title: 'SkyPark Observation Deck',
        description: 'Visit the iconic rooftop observation deck',
        location: 'Marina Bay Sands',
        completed: false,
        reward: 100,
        apyBenefit: 0.5,
      },
      {
        id: 'step-y',
        title: 'Celebrity Chef Restaurant',
        description: 'Dine at a Michelin-starred restaurant',
        location: 'Marina Bay Sands',
        completed: false,
        reward: 150,
        apyBenefit: 1.0,
      },
    ],
    canClaim: false,
  },
];

export default function MyMissionsScreen() {
  const insets = useSafeAreaInsets();
  const [missions, setMissions] = useState(ACTIVE_MISSIONS);

  const handleClaimRewards = (mission: ActiveMission) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert(
      'Claim Rewards',
      `You will receive:\n\n💰 $${mission.earnedReward} USDC\n📈 +${mission.earnedAPYBoost}% APY Boost\n\nRewards will be instantly transferred to your wallet.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim Now',
          style: 'default',
          onPress: () => {
            // Simulate claim
            Alert.alert(
              '✅ Rewards Claimed!',
              `$${mission.earnedReward} USDC has been added to your wallet!\n\nYour new APY: ${(8.5 + mission.earnedAPYBoost).toFixed(1)}%`,
              [{ text: 'Great!', onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) }]
            );
            
            // Update mission to mark as claimed
            setMissions(prevMissions =>
              prevMissions.map(m =>
                m.id === mission.id ? { ...m, canClaim: false, earnedReward: 0 } : m
              )
            );
          },
        },
      ]
    );
  };

  const completedSteps = (mission: ActiveMission) => mission.steps.filter(s => s.completed).length;
  const totalSteps = (mission: ActiveMission) => mission.steps.length;

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#0B0F14" />
        </Pressable>
      </View>

      <Text style={styles.pageTitle}>My Missions</Text>
      <Text style={styles.pageSubtitle}>Track your progress and claim rewards</Text>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{missions.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{missions.filter(m => m.progress === 100).length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${missions.reduce((sum, m) => sum + m.earnedReward, 0)}</Text>
          <Text style={styles.statLabel}>To Claim</Text>
        </View>
      </View>

      {/* Active Missions */}
      {missions.map((mission) => (
        <View key={mission.id} style={styles.missionCard}>
          {/* Mission Header */}
          <View style={styles.missionHeader}>
            <Image source={{ uri: mission.imageUrl }} style={styles.missionImage} />
            <View style={styles.missionHeaderOverlay}>
              <View style={[styles.rarityBadge, { backgroundColor: RARITY_COLORS[mission.rarity] }]}>
                <Text style={styles.rarityText}>{mission.rarity.toUpperCase()}</Text>
              </View>
              {mission.type && (
                <View style={[styles.typeBadge, { backgroundColor: mission.type === 'global' ? '#8B5CF6' : '#10B981' }]}>
                  <Text style={styles.typeText}>{mission.type === 'global' ? '🌍 GLOBAL' : '📍 LOCAL'}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Mission Info */}
          <View style={styles.missionInfo}>
            <Text style={styles.missionName}>{mission.name}</Text>
            <Text style={styles.missionCountry}>📍 {mission.country}</Text>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  {completedSteps(mission)}/{totalSteps(mission)} steps completed
                </Text>
                <Text style={styles.progressPercent}>{mission.progress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${mission.progress}%`, backgroundColor: RARITY_COLORS[mission.rarity] }]} />
              </View>
            </View>

            {/* Steps List */}
            <View style={styles.stepsList}>
              {mission.steps.map((step, index) => (
                <View key={step.id} style={styles.stepItem}>
                  <View style={styles.stepIndicator}>
                    {step.completed ? (
                      <View style={styles.stepDotCompleted}>
                        <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={styles.stepDot} />
                    )}
                    {index < mission.steps.length - 1 && (
                      <View style={[styles.stepLine, step.completed && styles.stepLineCompleted]} />
                    )}
                  </View>
                  <View style={[styles.stepContent, !step.completed && styles.stepContentIncomplete]}>
                    <Text style={[styles.stepTitle, !step.completed && styles.stepTitleIncomplete]}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                    <Text style={styles.stepLocation}>📍 {step.location}</Text>
                    <View style={styles.stepRewards}>
                      <Text style={[styles.stepReward, !step.completed && styles.stepRewardIncomplete]}>
                        +${step.reward}
                      </Text>
                      <Text style={[styles.stepBenefit, !step.completed && styles.stepBenefitIncomplete]}>
                        +{step.apyBenefit}% APY
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Rewards Summary */}
            <View style={styles.rewardsSummary}>
              <View style={styles.rewardsSummaryHeader}>
                <Text style={styles.rewardsSummaryTitle}>Your Earnings</Text>
              </View>
              <View style={styles.rewardsSummaryRow}>
                <View style={styles.rewardsSummaryItem}>
                  <Text style={styles.rewardsSummaryValue}>${mission.earnedReward}</Text>
                  <Text style={styles.rewardsSummaryLabel}>Earned / ${mission.totalReward} Total</Text>
                </View>
                <View style={styles.rewardsSummaryDivider} />
                <View style={styles.rewardsSummaryItem}>
                  <Text style={styles.rewardsSummaryValue}>+{mission.earnedAPYBoost}%</Text>
                  <Text style={styles.rewardsSummaryLabel}>Earned / +{mission.totalAPYBoost}% Total</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {mission.canClaim && mission.earnedReward > 0 && (
                <Pressable
                  onPress={() => handleClaimRewards(mission)}
                  style={({ pressed }) => [
                    styles.claimButton,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <IconSymbol name="bolt.fill" size={18} color="#FFFFFF" />
                  <Text style={styles.claimButtonText}>Claim ${mission.earnedReward} Now</Text>
                </Pressable>
              )}
              {mission.progress < 100 && (
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push(`/mission/${mission.id}`);
                  }}
                  style={({ pressed }) => [
                    styles.continueButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={styles.continueButtonText}>Continue Mission</Text>
                  <IconSymbol name="arrow.right" size={16} color="#0B0F14" />
                </Pressable>
              )}
              {mission.progress === 100 && !mission.canClaim && (
                <View style={styles.completedBanner}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#16A34A" />
                  <Text style={styles.completedText}>Mission Completed & Claimed!</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#FAFAF8',
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  missionHeader: {
    position: 'relative',
    height: 160,
  },
  missionImage: {
    width: '100%',
    height: '100%',
  },
  missionHeaderOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
  },
  missionInfo: {
    padding: 20,
  },
  missionName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  missionCountry: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 20,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    fontFamily: 'system font',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepsList: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIndicator: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  stepDotCompleted: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  stepLineCompleted: {
    backgroundColor: '#16A34A',
  },
  stepContent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E7E2DC',
  },
  stepContentIncomplete: {
    opacity: 0.7,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  stepTitleIncomplete: {
    color: '#6B7280',
  },
  stepDescription: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 6,
  },
  stepLocation: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'system font',
    marginBottom: 8,
  },
  stepRewards: {
    flexDirection: 'row',
    gap: 12,
  },
  stepReward: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
    fontFamily: 'system font',
  },
  stepRewardIncomplete: {
    color: '#9CA3AF',
  },
  stepBenefit: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B82F6',
    fontFamily: 'system font',
  },
  stepBenefitIncomplete: {
    color: '#9CA3AF',
  },
  rewardsSummary: {
    backgroundColor: '#0E1B2A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rewardsSummaryHeader: {
    marginBottom: 12,
  },
  rewardsSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    fontFamily: 'system font',
  },
  rewardsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardsSummaryItem: {
    flex: 1,
  },
  rewardsSummaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  rewardsSummaryLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.7,
    fontFamily: 'system font',
  },
  rewardsSummaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
    marginHorizontal: 16,
  },
  actionButtons: {
    gap: 12,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B89A5C',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#B89A5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E2DC',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16A34A',
    fontFamily: 'system font',
  },
});

