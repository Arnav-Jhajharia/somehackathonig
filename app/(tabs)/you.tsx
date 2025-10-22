import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';

type CountryVisit = {
  id: string;
  name: string;
  flag: string;
  missionsCompleted: number;
  totalRewards: number;
  position: { x: number; y: number }; // Position on the map
};

type CompletedMission = {
  id: string;
  name: string;
  country: string;
  reward: number;
  completedDate: Date;
  type: 'global' | 'local';
};

const COUNTRIES_VISITED: CountryVisit[] = [
  { id: 'sg', name: 'Singapore', flag: '🇸🇬', missionsCompleted: 8, totalRewards: 1240, position: { x: 220, y: 140 } },
  { id: 'jp', name: 'Japan', flag: '🇯🇵', missionsCompleted: 3, totalRewards: 650, position: { x: 260, y: 80 } },
  { id: 'us-nyc', name: 'USA (NYC)', flag: '🗽', missionsCompleted: 2, totalRewards: 420, position: { x: 60, y: 70 } },
];

const COMPLETED_MISSIONS: CompletedMission[] = [
  { id: '1', name: 'Gardens by the Bay Explorer', country: 'Singapore', reward: 120, completedDate: new Date(Date.now() - 86400000 * 2), type: 'local' },
  { id: '2', name: 'Marina Bay Sands Skyline', country: 'Singapore', reward: 250, completedDate: new Date(Date.now() - 86400000 * 5), type: 'local' },
  { id: '3', name: 'Michelin Madness', country: 'Singapore', reward: 750, completedDate: new Date(Date.now() - 86400000 * 7), type: 'global' },
  { id: '4', name: 'Shibuya Crossing Quest', country: 'Japan', reward: 500, completedDate: new Date(Date.now() - 86400000 * 15), type: 'local' },
  { id: '5', name: 'Broadway Show Experience', country: 'USA', reward: 450, completedDate: new Date(Date.now() - 86400000 * 30), type: 'local' },
];

export default function YouScreen() {
  const insets = useSafeAreaInsets();

  const totalRewards = COUNTRIES_VISITED.reduce((sum, country) => sum + country.totalRewards, 0);
  const totalMissions = COUNTRIES_VISITED.reduce((sum, country) => sum + country.missionsCompleted, 0);
  const totalCountries = COUNTRIES_VISITED.length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>You</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/settings')}
          style={styles.settingsButton}
        >
          <IconSymbol name="gearshape.fill" size={24} color="#0B0F14" />
        </Pressable>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalCountries}</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalMissions}</Text>
          <Text style={styles.statLabel}>Missions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${totalRewards.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
      </View>

      {/* Travel Map */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Travel Journey</Text>
        <View style={styles.mapContainer}>
          <Svg width="100%" height={200} viewBox="0 0 300 200">
            {/* Draw lines connecting countries */}
            {COUNTRIES_VISITED.map((country, index) => {
              if (index < COUNTRIES_VISITED.length - 1) {
                const nextCountry = COUNTRIES_VISITED[index + 1];
                return (
                  <Line
                    key={`line-${country.id}`}
                    x1={country.position.x}
                    y1={country.position.y}
                    x2={nextCountry.position.x}
                    y2={nextCountry.position.y}
                    stroke="#B89A5C"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity={0.6}
                  />
                );
              }
              return null;
            })}
            
            {/* Draw country dots */}
            {COUNTRIES_VISITED.map((country, index) => (
              <Circle
                key={country.id}
                cx={country.position.x}
                cy={country.position.y}
                r="8"
                fill="#B89A5C"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            ))}
          </Svg>
          
          {/* Country labels */}
          {COUNTRIES_VISITED.map((country) => (
            <View
              key={`label-${country.id}`}
              style={[
                styles.countryLabel,
                {
                  left: (country.position.x / 300) * 100 + '%',
                  top: (country.position.y / 200) * 100 + '%',
                },
              ]}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Countries Visited */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Countries Visited</Text>
        {COUNTRIES_VISITED.map((country) => (
          <View key={country.id} style={styles.countryCard}>
            <View style={styles.countryLeft}>
              <Text style={styles.countryFlagLarge}>{country.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryStats}>
                  {country.missionsCompleted} missions • ${country.totalRewards.toLocaleString()} earned
                </Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
          </View>
        ))}
      </View>

      {/* Active Missions Link */}
      <Pressable 
        onPress={() => router.push('/my-missions')}
        style={styles.activeMissionsCard}
      >
        <View style={styles.activeMissionsLeft}>
          <View style={styles.activeMissionsIcon}>
            <IconSymbol name="flag.fill" size={24} color="#B89A5C" />
          </View>
          <View>
            <Text style={styles.activeMissionsTitle}>My Active Missions</Text>
            <Text style={styles.activeMissionsSubtitle}>Track progress & claim rewards</Text>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Completed Missions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mission History</Text>
        {COMPLETED_MISSIONS.map((mission) => (
          <View key={mission.id} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <View style={styles.missionLeft}>
                <View style={[styles.missionTypeBadge, { backgroundColor: mission.type === 'global' ? '#EDE9FE' : '#D1FAE5' }]}>
                  <Text style={[styles.missionTypeText, { color: mission.type === 'global' ? '#8B5CF6' : '#10B981' }]}>
                    {mission.type === 'global' ? '🌍 Global' : '📍 Local'}
                  </Text>
                </View>
              </View>
              <Text style={styles.missionDate}>{formatDate(mission.completedDate)}</Text>
            </View>
            <Text style={styles.missionName}>{mission.name}</Text>
            <Text style={styles.missionCountry}>{mission.country}</Text>
            <View style={styles.missionRewardContainer}>
              <Text style={styles.missionReward}>+${mission.reward} USDC</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <View style={styles.achievementsHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Pressable onPress={() => router.push('/badges')}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
        <View style={styles.achievementsRow}>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementIcon}>🌍</Text>
            <Text style={styles.achievementName}>Globe Trotter</Text>
            <Text style={styles.achievementProgress}>1/3</Text>
          </View>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementIcon}>⭐</Text>
            <Text style={styles.achievementName}>Michelin Master</Text>
            <Text style={styles.achievementProgress}>1/3</Text>
          </View>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementIcon}>✈️</Text>
            <Text style={styles.achievementName}>World Explorer</Text>
            <Text style={styles.achievementProgress}>1/5</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#FAFAF8',
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'Kugile',
  },
  settingsButton: {
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 16,
  },
  mapContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    position: 'relative',
    height: 200,
  },
  countryLabel: {
    position: 'absolute',
    transform: [{ translateX: -15 }, { translateY: -35 }],
  },
  countryFlag: {
    fontSize: 24,
  },
  countryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  countryFlagLarge: {
    fontSize: 32,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  countryStats: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  activeMissionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FCD34D',
    shadowColor: '#B89A5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  activeMissionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  activeMissionsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeMissionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  activeMissionsSubtitle: {
    fontSize: 14,
    color: '#B45309',
    fontFamily: 'system font',
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionLeft: {
    flex: 1,
  },
  missionTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  missionTypeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'system font',
  },
  missionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'system font',
  },
  missionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  missionCountry: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 12,
  },
  missionRewardContainer: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  missionReward: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
    fontFamily: 'system font',
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    fontFamily: 'system font',
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementBadge: {
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
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementProgress: {
    fontSize: 11,
    color: '#8B5CF6',
    fontFamily: 'system font',
    fontWeight: '600',
  },
});

