import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MissionStep = {
  id: string;
  title: string;
  description: string;
  location: string;
  reward: number;
  benefit: string;
  completed: boolean;
};

type MissionDetails = {
  id: string;
  name: string;
  tagline: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'global' | 'local';
  country: string;
  totalReward: number;
  totalBenefit: string;
  timeEstimate: string;
  steps: MissionStep[];
  globalBadge?: string;
};

type GlobalBadge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredCountries: number;
  reward: string;
};

// Global Badges System
const GLOBAL_BADGES: GlobalBadge[] = [
  { id: 'globe-trotter', name: 'Globe Trotter', icon: '🌍', description: 'Complete missions in 3 countries', requiredCountries: 3, reward: '+1% permanent APY' },
  { id: 'world-explorer', name: 'World Explorer', icon: '✈️', description: 'Complete missions in 5 countries', requiredCountries: 5, reward: '+2% permanent APY' },
  { id: 'cultural-curator', name: 'Cultural Curator', icon: '🎭', description: 'Complete missions in 10 countries', requiredCountries: 10, reward: '+5% permanent APY + $500 bonus' },
  { id: 'michelin-master', name: 'Michelin Master', icon: '⭐', description: 'Complete Michelin Madness in 3 countries', requiredCountries: 3, reward: '+3% permanent APY' },
];

// Mock mission data - in a real app this would come from API
const MISSION_DATA: Record<string, MissionDetails> = {
  'michelin-madness': {
    id: 'michelin-madness',
    name: 'Michelin Madness',
    tagline: 'A culinary journey through Singapore\'s finest',
    rarity: 'legendary',
    type: 'global',
    country: 'Singapore',
    totalReward: 750,
    totalBenefit: '2.5% APY boost',
    timeEstimate: '6-8 hours',
    globalBadge: 'michelin-master',
    steps: [
      {
        id: 'step-1',
        title: 'Les Amis',
        description: 'Dine at this 3-Michelin star French restaurant',
        location: 'Shaw Centre, Orchard',
        reward: 200,
        benefit: '0.5% APY boost',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Odette',
        description: 'Experience modern French cuisine at 3-Michelin star Odette',
        location: 'National Gallery Singapore',
        reward: 250,
        benefit: '0.8% APY boost',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Burnt Ends',
        description: 'Savor wood-fired BBQ at this 1-Michelin star gem',
        location: 'Dempsey Hill',
        reward: 150,
        benefit: '0.5% APY boost',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Zen',
        description: 'Complete your journey at this 3-Michelin star Nordic restaurant',
        location: 'Bukit Pasoh Road',
        reward: 150,
        benefit: '0.7% APY boost',
        completed: false,
      },
    ],
  },
  'grassway-escape': {
    id: 'grassway-escape',
    name: 'On a Grassway',
    tagline: 'Nature\'s serenity awaits your discovery',
    rarity: 'rare',
    type: 'local',
    country: 'Singapore',
    totalReward: 230,
    totalBenefit: '1.2% APY boost',
    timeEstimate: '4-5 hours',
    steps: [
      {
        id: 'step-1',
        title: 'Singapore Botanic Gardens',
        description: 'Explore the UNESCO World Heritage Site',
        location: 'Cluny Road',
        reward: 80,
        benefit: '0.4% APY boost',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'National Orchid Garden',
        description: 'Discover over 1,000 species of orchids',
        location: 'Within Botanic Gardens',
        reward: 70,
        benefit: '0.3% APY boost',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Swan Lake',
        description: 'Relax by the tranquil waters',
        location: 'Within Botanic Gardens',
        reward: 40,
        benefit: '0.2% APY boost',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Heritage Museum',
        description: 'Learn about Singapore\'s botanical history',
        location: 'Within Botanic Gardens',
        reward: 40,
        benefit: '0.3% APY boost',
        completed: false,
      },
    ],
  },
};

const RARITY_COLORS: Record<string, string> = {
  common: '#6B7280',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
};

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  
  const mission = MISSION_DATA[id] || MISSION_DATA['michelin-madness'];
  const rarityColor = RARITY_COLORS[mission.rarity];
  const relatedBadge = mission.globalBadge ? GLOBAL_BADGES.find(b => b.id === mission.globalBadge) : null;
  const isGlobal = mission.type === 'global';

  const handleStartMission = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Show success feedback - in real app this would call the API
      // For now, just navigate back to explore page
      router.push('/(tabs)/explore');
    } catch (error) {
      console.error('Error starting mission:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#0B0F14" />
          </Pressable>
        </View>

        {/* Mission Title */}
        <View style={styles.titleSection}>
          <View style={styles.badgeRow}>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
              <Text style={styles.rarityText}>{mission.rarity.toUpperCase()}</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: isGlobal ? '#8B5CF6' : '#10B981' }]}>
              <Text style={styles.typeText}>{isGlobal ? '🌍 GLOBAL' : '📍 LOCAL'}</Text>
            </View>
          </View>
          <Text style={styles.missionName}>{mission.name}</Text>
          <Text style={styles.tagline}>{mission.tagline}</Text>
          <Text style={styles.countryLabel}>📍 {mission.country}</Text>
        </View>

        {/* Mission Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>${mission.totalReward}</Text>
            <Text style={styles.statLabel}>Total Reward</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{mission.totalBenefit}</Text>
            <Text style={styles.statLabel}>APY Boost</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{mission.timeEstimate}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>

        {/* Mission Steps */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>Mission Steps</Text>
          
          {mission.steps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              {/* Vertical Line */}
              <View style={styles.lineContainer}>
                <View style={[styles.stepDot, step.completed && styles.stepDotCompleted]} />
                {index < mission.steps.length - 1 && (
                  <View style={styles.verticalLine} />
                )}
              </View>

              {/* Step Content */}
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepNumber}>Step {index + 1}</Text>
                  {step.completed && (
                    <View style={styles.completedBadge}>
                      <IconSymbol name="checkmark.circle.fill" size={16} color="#16A34A" />
                      <Text style={styles.completedText}>Done</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
                
                <View style={styles.stepLocation}>
                  <IconSymbol name="location.fill" size={14} color="#6B7280" />
                  <Text style={styles.locationText}>{step.location}</Text>
                </View>

                <View style={styles.stepRewards}>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardValue}>+${step.reward}</Text>
                    <Text style={styles.rewardLabel}>USDC</Text>
                  </View>
                  <View style={styles.rewardItem}>
                    <Text style={styles.benefitValue}>{step.benefit}</Text>
                    <Text style={styles.rewardLabel}>APY Boost</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Global Badge Progress (only for global missions) */}
        {isGlobal && relatedBadge && (
          <View style={styles.globalBadgeSection}>
            <Text style={styles.sectionTitle}>Global Badge Progress</Text>
            <View style={styles.badgeCard}>
              <View style={styles.badgeHeader}>
                <Text style={styles.badgeIcon}>{relatedBadge.icon}</Text>
                <View style={styles.badgeInfo}>
                  <Text style={styles.badgeName}>{relatedBadge.name}</Text>
                  <Text style={styles.badgeDescription}>{relatedBadge.description}</Text>
                </View>
              </View>
              
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '33%' }]} />
              </View>
              <Text style={styles.progressText}>1 / {relatedBadge.requiredCountries} countries completed</Text>
              
              <View style={styles.badgeReward}>
                <Text style={styles.badgeRewardLabel}>Badge Reward:</Text>
                <Text style={styles.badgeRewardValue}>{relatedBadge.reward}</Text>
              </View>
            </View>

            {/* All Global Badges */}
            <View style={styles.allBadgesHeader}>
              <Text style={styles.subSectionTitle}>All Global Badges</Text>
              <Pressable 
                onPress={() => router.push('/badges')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <IconSymbol name="chevron.right" size={16} color="#8B5CF6" />
              </Pressable>
            </View>
            <View style={styles.allBadgesGrid}>
              {GLOBAL_BADGES.slice(0, 4).map(badge => (
                <View key={badge.id} style={styles.badgeTile}>
                  <Text style={styles.badgeTileIcon}>{badge.icon}</Text>
                  <Text style={styles.badgeTileName}>{badge.name}</Text>
                  <Text style={styles.badgeTileProgress}>0/{badge.requiredCountries}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Total Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Complete all steps to unlock</Text>
          <View style={styles.summaryRewards}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>${mission.totalReward} USDC</Text>
              <Text style={styles.summaryLabel}>Total Reward</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{mission.totalBenefit}</Text>
              <Text style={styles.summaryLabel}>Permanent APY Boost</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Start Mission Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          onPress={handleStartMission}
          style={({ pressed }) => [styles.startButton, { opacity: pressed ? 0.9 : 1 }]}
        >
          <Text style={styles.startButtonText}>Start Mission</Text>
          <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7E2DC',
  },
  titleSection: {
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rarityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    fontFamily: 'system font',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    fontFamily: 'system font',
  },
  countryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'system font',
    marginTop: 4,
  },
  missionName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'Kugile',
    marginBottom: 8,
    lineHeight: 42,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'system font',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
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
  stepsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  lineContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  stepDotCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E7E2DC',
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'system font',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
    fontFamily: 'system font',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'system font',
    lineHeight: 20,
    marginBottom: 8,
  },
  stepLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  stepRewards: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardItem: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
    fontFamily: 'system font',
    marginBottom: 2,
  },
  benefitValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
    fontFamily: 'system font',
    marginBottom: 2,
  },
  rewardLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'system font',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  globalBadgeSection: {
    marginBottom: 32,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  allBadgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    fontFamily: 'system font',
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  badgeIcon: {
    fontSize: 48,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 16,
  },
  badgeReward: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  badgeRewardLabel: {
    fontSize: 12,
    color: '#92400E',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  badgeRewardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    fontFamily: 'system font',
  },
  allBadgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    alignItems: 'center',
  },
  badgeTileIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeTileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeTileProgress: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  summaryBox: {
    backgroundColor: '#0E1B2A',
    borderRadius: 20,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    fontFamily: 'system font',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRewards: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    fontFamily: 'system font',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FAFAF8',
    borderTopWidth: 1,
    borderTopColor: '#E7E2DC',
  },
  startButton: {
    backgroundColor: '#0E1B2A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'system font',
  },
});

