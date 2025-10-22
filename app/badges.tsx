import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GlobalBadge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredCountries: number;
  reward: string;
  progress: number;
  countries: string[];
};

// Mock data - in real app this would come from API
const GLOBAL_BADGES: GlobalBadge[] = [
  { 
    id: 'globe-trotter', 
    name: 'Globe Trotter', 
    icon: '🌍', 
    description: 'Complete missions in 3 countries', 
    requiredCountries: 3, 
    reward: '+1% permanent APY',
    progress: 1,
    countries: ['Singapore'],
  },
  { 
    id: 'world-explorer', 
    name: 'World Explorer', 
    icon: '✈️', 
    description: 'Complete missions in 5 countries', 
    requiredCountries: 5, 
    reward: '+2% permanent APY',
    progress: 1,
    countries: ['Singapore'],
  },
  { 
    id: 'cultural-curator', 
    name: 'Cultural Curator', 
    icon: '🎭', 
    description: 'Complete missions in 10 countries', 
    requiredCountries: 10, 
    reward: '+5% permanent APY + $500 bonus',
    progress: 1,
    countries: ['Singapore'],
  },
  { 
    id: 'michelin-master', 
    name: 'Michelin Master', 
    icon: '⭐', 
    description: 'Complete Michelin Madness in 3 countries', 
    requiredCountries: 3, 
    reward: '+3% permanent APY',
    progress: 0,
    countries: [],
  },
  {
    id: 'urban-explorer',
    name: 'Urban Explorer',
    icon: '🏙️',
    description: 'Complete 20 city missions worldwide',
    requiredCountries: 0,
    reward: '+1.5% permanent APY',
    progress: 5,
    countries: [],
  },
  {
    id: 'adventure-seeker',
    name: 'Adventure Seeker',
    icon: '🏔️',
    description: 'Complete 15 nature missions',
    requiredCountries: 0,
    reward: '+2% permanent APY',
    progress: 2,
    countries: [],
  },
];

export default function BadgesScreen() {
  const insets = useSafeAreaInsets();

  const activeBadges = GLOBAL_BADGES.filter(b => b.progress > 0);
  const lockedBadges = GLOBAL_BADGES.filter(b => b.progress === 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#0B0F14" />
          </Pressable>
        </View>

        <Text style={styles.pageTitle}>Global Badges</Text>
        <Text style={styles.pageSubtitle}>
          Earn permanent APY boosts and rewards by completing missions across the world
        </Text>

        {/* Active/In Progress Badges */}
        <Text style={styles.sectionTitle}>In Progress</Text>
        {activeBadges.map((badge) => {
          const progressPercent = badge.requiredCountries > 0 
            ? (badge.progress / badge.requiredCountries) * 100 
            : (badge.progress / 20) * 100;
          
          return (
            <View key={badge.id} style={styles.badgeCard}>
              <View style={styles.badgeHeader}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <View style={styles.badgeInfo}>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {badge.progress} / {badge.requiredCountries || 20} {badge.requiredCountries > 0 ? 'countries' : 'missions'}
              </Text>

              {badge.countries.length > 0 && (
                <View style={styles.countriesContainer}>
                  <Text style={styles.countriesLabel}>Countries visited:</Text>
                  <View style={styles.countriesList}>
                    {badge.countries.map((country, idx) => (
                      <View key={idx} style={styles.countryTag}>
                        <Text style={styles.countryText}>{country}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.badgeReward}>
                <Text style={styles.badgeRewardLabel}>Reward:</Text>
                <Text style={styles.badgeRewardValue}>{badge.reward}</Text>
              </View>
            </View>
          );
        })}

        {/* Locked Badges */}
        <Text style={styles.sectionTitle}>Locked</Text>
        {lockedBadges.map((badge) => (
          <View key={badge.id} style={[styles.badgeCard, styles.lockedCard]}>
            <View style={styles.badgeHeader}>
              <Text style={styles.badgeIconLocked}>{badge.icon}</Text>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeNameLocked}>{badge.name}</Text>
                <Text style={styles.badgeDescriptionLocked}>{badge.description}</Text>
              </View>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFillLocked, { width: '0%' }]} />
            </View>
            <Text style={styles.progressTextLocked}>
              0 / {badge.requiredCountries || 20} {badge.requiredCountries > 0 ? 'countries' : 'missions'}
            </Text>

            <View style={styles.badgeRewardLocked}>
              <Text style={styles.badgeRewardLabelLocked}>Reward:</Text>
              <Text style={styles.badgeRewardValueLocked}>{badge.reward}</Text>
            </View>
          </View>
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
    marginBottom: 32,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 16,
    marginTop: 8,
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  lockedCard: {
    opacity: 0.6,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  badgeIcon: {
    fontSize: 48,
  },
  badgeIconLocked: {
    fontSize: 48,
    opacity: 0.5,
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
  badgeNameLocked: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9CA3AF',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  badgeDescriptionLocked: {
    fontSize: 14,
    color: '#9CA3AF',
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
  progressFillLocked: {
    height: '100%',
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 12,
  },
  progressTextLocked: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'system font',
    marginBottom: 12,
  },
  countriesContainer: {
    marginBottom: 12,
  },
  countriesLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 8,
  },
  countriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  countryTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  countryText: {
    fontSize: 12,
    color: '#4F46E5',
    fontFamily: 'system font',
    fontWeight: '600',
  },
  badgeReward: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  badgeRewardLocked: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeRewardLabel: {
    fontSize: 12,
    color: '#92400E',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  badgeRewardLabelLocked: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  badgeRewardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    fontFamily: 'system font',
  },
  badgeRewardValueLocked: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
    fontFamily: 'system font',
  },
});

