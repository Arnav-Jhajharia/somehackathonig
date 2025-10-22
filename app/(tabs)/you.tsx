import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';

type CountryVisit = {
  id: string;
  name: string;
  flag: string;
  missionsCompleted: number;
  totalRewards: number;
  position: { x: number; y: number }; // Position on the map (relative to viewBox)
  visited: number; // Visit order
};

type CompletedMission = {
  id: string;
  name: string;
  country: string;
  reward: number;
  completedDate: Date;
  type: 'global' | 'local';
};

// Affluent traveler Bob has been to many places!
const COUNTRIES_VISITED: CountryVisit[] = [
  { id: 'sg', name: 'Singapore', flag: '🇸🇬', missionsCompleted: 12, totalRewards: 3240, position: { x: 710, y: 280 }, visited: 1 },
  { id: 'jp', name: 'Japan', flag: '🇯🇵', missionsCompleted: 15, totalRewards: 4650, position: { x: 770, y: 190 }, visited: 2 },
  { id: 'hk', name: 'Hong Kong', flag: '🇭🇰', missionsCompleted: 8, totalRewards: 2420, position: { x: 700, y: 250 }, visited: 3 },
  { id: 'th', name: 'Thailand', flag: '🇹🇭', missionsCompleted: 10, totalRewards: 2100, position: { x: 650, y: 260 }, visited: 4 },
  { id: 'ae', name: 'UAE (Dubai)', flag: '🇦🇪', missionsCompleted: 9, totalRewards: 5200, position: { x: 520, y: 250 }, visited: 5 },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', missionsCompleted: 18, totalRewards: 6850, position: { x: 420, y: 140 }, visited: 6 },
  { id: 'fr', name: 'France', flag: '🇫🇷', missionsCompleted: 14, totalRewards: 7200, position: { x: 440, y: 160 }, visited: 7 },
  { id: 'it', name: 'Italy', flag: '🇮🇹', missionsCompleted: 11, totalRewards: 4300, position: { x: 470, y: 180 }, visited: 8 },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭', missionsCompleted: 7, totalRewards: 5400, position: { x: 455, y: 165 }, visited: 9 },
  { id: 'us-nyc', name: 'USA (NYC)', flag: '🗽', missionsCompleted: 22, totalRewards: 8920, position: { x: 240, y: 180 }, visited: 10 },
  { id: 'us-la', name: 'USA (LA)', flag: '🌴', missionsCompleted: 16, totalRewards: 5600, position: { x: 120, y: 200 }, visited: 11 },
  { id: 'us-sf', name: 'USA (SF)', flag: '🌉', missionsCompleted: 12, totalRewards: 4800, position: { x: 110, y: 185 }, visited: 12 },
  { id: 'au', name: 'Australia', flag: '🇦🇺', missionsCompleted: 13, totalRewards: 3900, position: { x: 780, y: 360 }, visited: 13 },
  { id: 'nz', name: 'New Zealand', flag: '🇳🇿', missionsCompleted: 9, totalRewards: 2800, position: { x: 850, y: 385 }, visited: 14 },
];

const COMPLETED_MISSIONS: CompletedMission[] = [
  { id: '1', name: 'Gardens by the Bay Explorer', country: 'Singapore', reward: 120, completedDate: new Date(Date.now() - 86400000 * 2), type: 'local' },
  { id: '2', name: 'Marina Bay Sands Skyline', country: 'Singapore', reward: 250, completedDate: new Date(Date.now() - 86400000 * 5), type: 'local' },
  { id: '3', name: 'Michelin Madness', country: 'Singapore', reward: 750, completedDate: new Date(Date.now() - 86400000 * 7), type: 'global' },
  { id: '4', name: 'Shibuya Crossing Quest', country: 'Japan', reward: 500, completedDate: new Date(Date.now() - 86400000 * 15), type: 'local' },
  { id: '5', name: 'Broadway Show Experience', country: 'USA (NYC)', reward: 450, completedDate: new Date(Date.now() - 86400000 * 30), type: 'local' },
  { id: '6', name: 'Eiffel Tower Fine Dining', country: 'France', reward: 1200, completedDate: new Date(Date.now() - 86400000 * 45), type: 'global' },
  { id: '7', name: 'Sydney Opera House Tour', country: 'Australia', reward: 380, completedDate: new Date(Date.now() - 86400000 * 60), type: 'local' },
  { id: '8', name: 'Dubai Desert Safari Luxury', country: 'UAE (Dubai)', reward: 920, completedDate: new Date(Date.now() - 86400000 * 75), type: 'local' },
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
          <Svg width="100%" height={280} viewBox="0 0 1000 500" style={styles.worldMap}>
            {/* Simplified world map continents (light gray background) */}
            
            {/* North America */}
            <Path
              d="M 80 120 Q 100 100, 140 100 L 220 110 Q 240 120, 250 150 L 260 200 Q 250 230, 230 240 L 180 250 Q 150 240, 130 220 L 90 200 Q 75 170, 80 120 Z"
              fill="#E5E7EB"
              opacity={0.3}
            />
            
            {/* Europe */}
            <Path
              d="M 400 100 Q 420 90, 450 95 L 490 110 Q 500 130, 495 150 L 480 180 Q 465 185, 450 180 L 415 160 Q 400 140, 400 100 Z"
              fill="#E5E7EB"
              opacity={0.3}
            />
            
            {/* Asia */}
            <Path
              d="M 500 100 Q 550 90, 650 110 L 780 130 Q 820 150, 830 190 L 820 260 Q 800 280, 760 290 L 680 300 Q 620 280, 580 250 L 520 200 Q 500 150, 500 100 Z"
              fill="#E5E7EB"
              opacity={0.3}
            />
            
            {/* Australia */}
            <Ellipse
              cx="790"
              cy="370"
              rx="80"
              ry="50"
              fill="#E5E7EB"
              opacity={0.3}
            />
            
            {/* Africa/Middle East */}
            <Path
              d="M 450 200 Q 470 190, 500 200 L 540 240 Q 545 280, 535 330 L 510 360 Q 480 365, 460 350 L 440 310 Q 435 260, 450 200 Z"
              fill="#E5E7EB"
              opacity={0.3}
            />
            
            {/* Draw curved lines connecting countries in travel order */}
            {COUNTRIES_VISITED.sort((a, b) => a.visited - b.visited).map((country, index) => {
              if (index < COUNTRIES_VISITED.length - 1) {
                const nextCountry = COUNTRIES_VISITED.find(c => c.visited === country.visited + 1);
                if (nextCountry) {
                  // Calculate control point for curve (makes arc)
                  const midX = (country.position.x + nextCountry.position.x) / 2;
                  const midY = (country.position.y + nextCountry.position.y) / 2 - 30;
                  
                  return (
                    <Path
                      key={`path-${country.id}`}
                      d={`M ${country.position.x} ${country.position.y} Q ${midX} ${midY}, ${nextCountry.position.x} ${nextCountry.position.y}`}
                      stroke="#B89A5C"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="6,4"
                      opacity={0.7}
                    />
                  );
                }
              }
              return null;
            })}
            
            {/* Draw country dots with glow effect */}
            {COUNTRIES_VISITED.map((country) => (
              <Circle
                key={`dot-${country.id}`}
                cx={country.position.x}
                cy={country.position.y}
                r="10"
                fill="#B89A5C"
                stroke="#FFFFFF"
                strokeWidth="3"
                opacity={0.95}
              />
            ))}
          </Svg>
          
          {/* Country flag labels positioned absolutely */}
          {COUNTRIES_VISITED.map((country) => (
            <View
              key={`label-${country.id}`}
              style={[
                styles.countryLabel,
                {
                  left: `${(country.position.x / 1000) * 100}%`,
                  top: `${(country.position.y / 500) * 100}%`,
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
    height: 280,
    overflow: 'hidden',
  },
  worldMap: {
    backgroundColor: '#FAFAFA',
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

