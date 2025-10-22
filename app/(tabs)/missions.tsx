import { useStartMission } from '@/app/api/hooks';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useRef, useState } from 'react';
import {
    Animated,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MissionRarity = 'common' | 'rare' | 'epic' | 'legendary';

type Mission = {
  id: string;
  title: string;
  reward: number;
  summary: string;
  coordinate: { latitude: number; longitude: number };
  rarity: MissionRarity;
  type?: 'global' | 'local';
  category: string;
  distance?: string;
  imageUrl?: string;
  timeEstimate?: string;
  completions?: number;
};

type MissionRoute = {
  id: string;
  name: string;
  missions: string[];
  totalReward: number;
  distance: string;
  emoji: string;
};

type MissionPath = {
  missionIds: string[];
  color: string;
  name: string;
};

const RARITY_CONFIG: Record<MissionRarity, { color: string; gradient: [string, string]; label: string; glow: string }> = {
  common: { color: '#6B7280', gradient: ['#9CA3AF', '#6B7280'], label: 'Common', glow: '#9CA3AF40' },
  rare: { color: '#3B82F6', gradient: ['#60A5FA', '#3B82F6'], label: 'Rare', glow: '#3B82F640' },
  epic: { color: '#A855F7', gradient: ['#C084FC', '#A855F7'], label: 'Epic', glow: '#A855F740' },
  legendary: { color: '#F59E0B', gradient: ['#FBBF24', '#F59E0B'], label: 'Legendary', glow: '#F59E0B40' },
};

// All missions by city
const ALL_MISSIONS: Record<string, Mission[]> = {
  singapore: [
  {
    id: 'michelin-madness',
    title: 'Michelin Madness',
    reward: 750,
    summary: 'A culinary journey through Singapore\'s finest Michelin-starred restaurants',
    coordinate: { latitude: 1.2944, longitude: 103.8558 },
    rarity: 'legendary',
    type: 'global',
    category: 'Dining',
    distance: '8.5 km',
    timeEstimate: '6-8 hours',
    completions: 892,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  },
  {
    id: 'sg-1',
    title: 'Gardens by the Bay Explorer',
    reward: 120,
    summary: 'Visit both Cloud Forest & Flower Dome, plus Supertree Grove',
    coordinate: { latitude: 1.2816, longitude: 103.8636 },
    rarity: 'rare',
    type: 'local',
    category: 'Nature',
    distance: '2.5 km',
    timeEstimate: '2-3 hours',
    completions: 5234,
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
  },
  {
    id: 'sg-2',
    title: 'Marina Bay Sands Skyline',
    reward: 250,
    summary: 'Visit SkyPark Observation Deck and dine at celebrity chef restaurant',
    coordinate: { latitude: 1.2834, longitude: 103.8607 },
    rarity: 'epic',
    category: 'Dining',
    distance: '2.1 km',
    timeEstimate: '2-3 hours',
    completions: 3892,
    imageUrl: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
  },
  {
    id: 'sg-3',
    title: 'Hawker Heritage Trail',
    reward: 80,
    summary: 'Try 5 dishes across Maxwell Food Centre',
    coordinate: { latitude: 1.2808, longitude: 103.8440 },
    rarity: 'common',
    category: 'Dining',
    distance: '1.8 km',
    timeEstimate: '1.5 hours',
    completions: 8234,
    imageUrl: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800',
  },
  {
    id: 'sg-4',
    title: 'Sentosa Island Escape',
    reward: 350,
    summary: 'Visit 3 attractions: USS, S.E.A Aquarium, and beach club',
    coordinate: { latitude: 1.2494, longitude: 103.8303 },
    rarity: 'legendary',
    category: 'Entertainment',
    distance: '6.2 km',
    timeEstimate: '5-6 hours',
    completions: 2145,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  },
  {
    id: 'sg-5',
    title: 'Orchard Road Shopping Spree',
    reward: 180,
    summary: 'Shop at 4 premium malls along Orchard Road',
    coordinate: { latitude: 1.3048, longitude: 103.8318 },
    rarity: 'rare',
    category: 'Shopping',
    distance: '3.4 km',
    timeEstimate: '3-4 hours',
    completions: 4521,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  },
  {
    id: 'sg-6',
    title: 'Chinatown Culture Quest',
    reward: 95,
    summary: 'Visit Buddha Tooth Relic Temple and 2 traditional shops',
    coordinate: { latitude: 1.2826, longitude: 103.8443 },
    rarity: 'common',
    category: 'Culture',
    distance: '1.6 km',
    timeEstimate: '1.5 hours',
    completions: 6234,
    imageUrl: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800',
  },
  {
    id: 'sg-7',
    title: 'Clarke Quay Night Experience',
    reward: 200,
    summary: 'Dine at riverside restaurant and visit 2 rooftop bars',
    coordinate: { latitude: 1.2885, longitude: 103.8465 },
    rarity: 'epic',
    category: 'Dining',
    distance: '2.3 km',
    timeEstimate: '3-4 hours',
    completions: 3421,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  },
  {
    id: 'sg-8',
    title: 'Little India Spice Trail',
    reward: 70,
    summary: 'Explore Sri Veeramakaliamman Temple and shop at Mustafa Centre',
    coordinate: { latitude: 1.3067, longitude: 103.8521 },
    rarity: 'common',
    category: 'Culture',
    distance: '3.1 km',
    timeEstimate: '2 hours',
    completions: 5892,
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
  },
  {
    id: 'sg-9',
    title: 'Singapore Botanic Gardens',
    reward: 110,
    summary: 'Visit National Orchid Garden and Heritage Museum',
    coordinate: { latitude: 1.3138, longitude: 103.8159 },
    rarity: 'rare',
    category: 'Nature',
    distance: '4.2 km',
    timeEstimate: '2-3 hours',
    completions: 4234,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  },
  {
    id: 'sg-10',
    title: 'Haji Lane Art & Cafe Hop',
    reward: 140,
    summary: 'Visit 3 indie cafes and street art spots in Kampong Glam',
    coordinate: { latitude: 1.3006, longitude: 103.8593 },
    rarity: 'rare',
    category: 'Shopping',
    distance: '2.7 km',
    timeEstimate: '2 hours',
    completions: 3654,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  },
  {
    id: 'sg-11',
    title: 'East Coast Park Sunset Ride',
    reward: 90,
    summary: 'Rent a bike and cycle 10km along the coast, grab seafood dinner',
    coordinate: { latitude: 1.3010, longitude: 103.9123 },
    rarity: 'common',
    category: 'Nature',
    distance: '8.1 km',
    timeEstimate: '2-3 hours',
    completions: 2834,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    id: 'sg-12',
    title: 'Night Safari Adventure',
    reward: 280,
    summary: 'Complete the Night Safari tram tour and walking trails',
    coordinate: { latitude: 1.4043, longitude: 103.7898 },
    rarity: 'legendary',
    category: 'Entertainment',
    distance: '11.5 km',
    timeEstimate: '3-4 hours',
    completions: 4521,
    imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
  },
],
  tokyo: [
    {
      id: 'michelin-madness',
      title: 'Michelin Madness',
      reward: 750,
      summary: 'A culinary journey through Tokyo\'s finest Michelin-starred restaurants',
      coordinate: { latitude: 35.6654, longitude: 139.7706 },
      rarity: 'legendary',
      type: 'global',
      category: 'Dining',
      distance: '12.5 km',
      timeEstimate: '6-8 hours',
      completions: 1230,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    },
    {
      id: 'tokyo-1',
      title: 'Shibuya Crossing Quest',
      reward: 500,
      summary: 'Visit iconic Shibuya Crossing and 4 nearby premium shops',
      coordinate: { latitude: 35.6595, longitude: 139.7004 },
      rarity: 'legendary',
      type: 'local',
      category: 'Culture',
      distance: '2.3 km',
      timeEstimate: '2-3 hours',
      completions: 12470,
      imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800',
    },
    {
      id: 'tokyo-2',
      title: 'Harajuku Fashion Trail',
      reward: 200,
      summary: 'Shop at 3 Harajuku boutiques',
      coordinate: { latitude: 35.6702, longitude: 139.7026 },
      rarity: 'rare',
      category: 'Shopping',
      distance: '1.5 km',
      timeEstimate: '1-2 hours',
      completions: 8920,
      imageUrl: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800',
    },
    {
      id: 'tokyo-3',
      title: 'Tsukiji Market Experience',
      reward: 350,
      summary: 'Taste 5 different sushi vendors',
      coordinate: { latitude: 35.6654, longitude: 139.7707 },
      rarity: 'epic',
      category: 'Dining',
      distance: '3.1 km',
      timeEstimate: '2 hours',
      completions: 23410,
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    },
    {
      id: 'tokyo-4',
      title: 'Senso-ji Temple Visit',
      reward: 180,
      summary: 'Visit Tokyo\'s oldest temple and Nakamise shopping street',
      coordinate: { latitude: 35.7148, longitude: 139.7967 },
      rarity: 'rare',
      category: 'Culture',
      distance: '4.2 km',
      timeEstimate: '1.5 hours',
      completions: 15234,
      imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
    },
    {
      id: 'tokyo-5',
      title: 'Tokyo Skytree Ascent',
      reward: 280,
      summary: 'Visit observation deck and dine at 450m high',
      coordinate: { latitude: 35.7101, longitude: 139.8107 },
      rarity: 'epic',
      category: 'Entertainment',
      distance: '5.1 km',
      timeEstimate: '2-3 hours',
      completions: 18920,
      imageUrl: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=800',
    },
    {
      id: 'tokyo-6',
      title: 'Akihabara Electronics Hunt',
      reward: 220,
      summary: 'Visit 5 electronics stores and a maid cafe',
      coordinate: { latitude: 35.6984, longitude: 139.7731 },
      rarity: 'rare',
      category: 'Shopping',
      distance: '3.8 km',
      timeEstimate: '2-3 hours',
      completions: 11234,
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    },
    {
      id: 'tokyo-7',
      title: 'Ginza Luxury Shopping',
      reward: 450,
      summary: 'Shop at 4 luxury brand flagship stores',
      coordinate: { latitude: 35.6717, longitude: 139.7650 },
      rarity: 'legendary',
      category: 'Shopping',
      distance: '2.9 km',
      timeEstimate: '3-4 hours',
      completions: 6234,
      imageUrl: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800',
    },
    {
      id: 'tokyo-8',
      title: 'Shinjuku Nightlife',
      reward: 320,
      summary: 'Visit Golden Gai, Robot Restaurant, and rooftop bar',
      coordinate: { latitude: 35.6938, longitude: 139.7034 },
      rarity: 'epic',
      category: 'Entertainment',
      distance: '2.1 km',
      timeEstimate: '4-5 hours',
      completions: 9821,
      imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800',
    },
  ],
  nyc: [
    {
      id: 'michelin-madness',
      title: 'Michelin Madness',
      reward: 750,
      summary: 'A culinary journey through NYC\'s finest Michelin-starred restaurants',
      coordinate: { latitude: 40.7589, longitude: -73.9851 },
      rarity: 'legendary',
      type: 'global',
      category: 'Dining',
      distance: '15.2 km',
      timeEstimate: '6-8 hours',
      completions: 2340,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    },
    {
      id: 'nyc-1',
      title: 'Statue of Liberty & Ellis Island',
      reward: 350,
      summary: 'Take ferry tour and visit both monuments',
      coordinate: { latitude: 40.6892, longitude: -74.0445 },
      rarity: 'legendary',
      type: 'local',
      category: 'Culture',
      distance: '8.2 km',
      timeEstimate: '4-5 hours',
      completions: 18920,
      imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800',
    },
    {
      id: 'nyc-2',
      title: 'Broadway Show Experience',
      reward: 450,
      summary: 'Attend a Broadway show and dine in Theater District',
      coordinate: { latitude: 40.7580, longitude: -73.9855 },
      rarity: 'legendary',
      category: 'Entertainment',
      distance: '3.1 km',
      timeEstimate: '4-5 hours',
      completions: 8920,
      imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
    },
    {
      id: 'nyc-3',
      title: 'Central Park Traverse',
      reward: 150,
      summary: 'Walk from south to north, visit 5 landmarks',
      coordinate: { latitude: 40.7829, longitude: -73.9654 },
      rarity: 'common',
      category: 'Nature',
      distance: '4.2 km',
      timeEstimate: '2-3 hours',
      completions: 25340,
      imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800',
    },
    {
      id: 'nyc-4',
      title: 'Metropolitan Museum Marathon',
      reward: 200,
      summary: 'See 15 masterpieces across 3 different wings',
      coordinate: { latitude: 40.7794, longitude: -73.9632 },
      rarity: 'rare',
      category: 'Culture',
      distance: '3.8 km',
      timeEstimate: '2-3 hours',
      completions: 15234,
      imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800',
    },
    {
      id: 'nyc-5',
      title: 'Brooklyn Bridge Walk',
      reward: 180,
      summary: 'Walk the bridge and visit DUMBO neighborhood',
      coordinate: { latitude: 40.7061, longitude: -73.9969 },
      rarity: 'rare',
      category: 'Culture',
      distance: '5.2 km',
      timeEstimate: '1.5-2 hours',
      completions: 19820,
      imageUrl: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=800',
    },
    {
      id: 'nyc-6',
      title: 'SoHo Shopping Spree',
      reward: 280,
      summary: 'Shop at 5 boutiques and vintage stores',
      coordinate: { latitude: 40.7233, longitude: -74.0030 },
      rarity: 'epic',
      category: 'Shopping',
      distance: '2.8 km',
      timeEstimate: '2-3 hours',
      completions: 11234,
      imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
    },
  ],
  la: [
    {
      id: 'michelin-madness',
      title: 'Michelin Madness',
      reward: 750,
      summary: 'A culinary journey through LA\'s finest Michelin-starred restaurants',
      coordinate: { latitude: 34.0522, longitude: -118.2437 },
      rarity: 'legendary',
      type: 'global',
      category: 'Dining',
      distance: '18.5 km',
      timeEstimate: '6-8 hours',
      completions: 1560,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    },
    {
      id: 'la-1',
      title: 'Hollywood Sign Hike',
      reward: 220,
      summary: 'Hike to the Hollywood Sign and back',
      coordinate: { latitude: 34.1341, longitude: -118.3215 },
      rarity: 'epic',
      type: 'local',
      category: 'Nature',
      distance: '12.1 km',
      timeEstimate: '2-3 hours',
      completions: 14920,
      imageUrl: 'https://images.unsplash.com/photo-1518416177092-ec985e4d6c14?w=800',
    },
    {
      id: 'la-2',
      title: 'Santa Monica Pier & Beach',
      reward: 180,
      summary: 'Visit pier attractions and bike along beach',
      coordinate: { latitude: 34.0094, longitude: -118.4973 },
      rarity: 'rare',
      category: 'Entertainment',
      distance: '8.3 km',
      timeEstimate: '2-3 hours',
      completions: 18234,
      imageUrl: 'https://images.unsplash.com/photo-1573655349936-de6bed86f839?w=800',
    },
    {
      id: 'la-3',
      title: 'Rodeo Drive Luxury Tour',
      reward: 350,
      summary: 'Visit 5 luxury boutiques on Rodeo Drive',
      coordinate: { latitude: 34.0674, longitude: -118.4006 },
      rarity: 'legendary',
      category: 'Shopping',
      distance: '6.2 km',
      timeEstimate: '2-3 hours',
      completions: 7234,
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    },
    {
      id: 'la-4',
      title: 'Getty Center Art Experience',
      reward: 200,
      summary: 'Visit museum and gardens',
      coordinate: { latitude: 34.0780, longitude: -118.4741 },
      rarity: 'rare',
      category: 'Culture',
      distance: '7.8 km',
      timeEstimate: '2-3 hours',
      completions: 12340,
      imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800',
    },
    {
      id: 'la-5',
      title: 'Venice Beach Boardwalk',
      reward: 150,
      summary: 'Explore Muscle Beach, street performers, and canals',
      coordinate: { latitude: 33.9850, longitude: -118.4695 },
      rarity: 'common',
      category: 'Culture',
      distance: '9.1 km',
      timeEstimate: '2 hours',
      completions: 21234,
      imageUrl: 'https://images.unsplash.com/photo-1583954049321-95c9a7c0d029?w=800',
    },
  ],
};

const ROUTES: MissionRoute[] = [
  { id: 'sg-foodie', name: 'Singapore Foodie Paradise', missions: ['sg-3', 'sg-7'], totalReward: 280, distance: '4.1 km', emoji: '🍜' },
  { id: 'sg-culture', name: 'Cultural Heritage Walk', missions: ['sg-6', 'sg-8'], totalReward: 165, distance: '4.7 km', emoji: '🏛️' },
  { id: 'sg-nature', name: 'Green Singapore Tour', missions: ['sg-1', 'sg-9'], totalReward: 230, distance: '6.7 km', emoji: '🌿' },
  { id: 'sg-luxury', name: 'Luxury Experience', missions: ['sg-2', 'sg-5'], totalReward: 430, distance: '5.5 km', emoji: '💎' },
  { id: 'sg-adventure', name: 'Adventure Seeker', missions: ['sg-4', 'sg-12'], totalReward: 630, distance: '17.7 km', emoji: '🎢' },
];

const CATEGORIES = ['All', 'Culture', 'Dining', 'Shopping', 'Entertainment', 'Nature'];
const RARITIES: MissionRarity[] = ['common', 'rare', 'epic', 'legendary'];

type Destination = {
  id: string;
  name: string;
  country: string;
  emoji: string;
  coordinate: { latitude: number; longitude: number };
  missionCount: number;
};

type Airline = {
  id: string;
  name: string;
  logo: string;
  color: string;
};

const DESTINATIONS: Destination[] = [
  { id: 'singapore', name: 'Singapore', country: 'Singapore', emoji: '🇸🇬', coordinate: { latitude: 1.3521, longitude: 103.8198 }, missionCount: 12 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', emoji: '🇯🇵', coordinate: { latitude: 35.6762, longitude: 139.6503 }, missionCount: 8 },
  { id: 'nyc', name: 'New York', country: 'USA', emoji: '🇺🇸', coordinate: { latitude: 40.7128, longitude: -74.0060 }, missionCount: 6 },
  { id: 'la', name: 'Los Angeles', country: 'USA', emoji: '🇺🇸', coordinate: { latitude: 34.0522, longitude: -118.2437 }, missionCount: 5 },
];

const AIRLINES: Airline[] = [
  { id: 'fly-on-vibes', name: 'Fly on Vibes', logo: '✈️', color: '#3B82F6' },
  { id: 'vibing', name: 'Vibing!', logo: '🛫', color: '#A855F7' },
];

// Mission paths showing connected journeys
const MISSION_PATHS: Record<string, MissionPath[]> = {
  singapore: [
    { missionIds: ['sg-1', 'sg-2', 'sg-7'], color: '#3B82F6', name: 'Marina Bay Circuit' }, // Blue
    { missionIds: ['sg-3', 'sg-6', 'sg-8'], color: '#EC4899', name: 'Cultural Heritage Trail' }, // Pink
    { missionIds: ['sg-5', 'sg-10', 'sg-9'], color: '#10B981', name: 'Urban Explorer Route' }, // Green
  ],
  tokyo: [
    { missionIds: ['tokyo-1', 'tokyo-2', 'tokyo-7'], color: '#EF4444', name: 'Shibuya to Ginza' }, // Red
    { missionIds: ['tokyo-3', 'tokyo-4', 'tokyo-5'], color: '#8B5CF6', name: 'East Tokyo Trail' }, // Purple
    { missionIds: ['tokyo-6', 'tokyo-8'], color: '#F59E0B', name: 'Nightlife Circuit' }, // Amber
  ],
  nyc: [
    { missionIds: ['nyc-3', 'nyc-4', 'nyc-5'], color: '#06B6D4', name: 'Manhattan Museums Route' }, // Cyan
    { missionIds: ['nyc-2', 'nyc-6'], color: '#D946EF', name: 'Entertainment District' }, // Fuchsia
  ],
  la: [
    { missionIds: ['la-1', 'la-3', 'la-4'], color: '#F97316', name: 'Hollywood Hills Journey' }, // Orange
    { missionIds: ['la-2', 'la-5'], color: '#14B8A6', name: 'Beach Circuit' }, // Teal
  ],
};

export default function MissionsListScreen() {
  const insets = useSafeAreaInsets();
  const [currentCity, setCurrentCity] = useState<string>('singapore');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarities, setSelectedRarities] = useState<MissionRarity[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  const travelModalAnim = useRef(new Animated.Value(0)).current;
  const startMutation = useStartMission(selectedMission?.id ?? '');

  const currentMissions = ALL_MISSIONS[currentCity] || ALL_MISSIONS.singapore;
  const currentCityInfo = DESTINATIONS.find(d => d.id === currentCity) || { name: 'Singapore', coordinate: { latitude: 1.3521, longitude: 103.8198 } };

  const filteredMissions = currentMissions.filter((m) => {
    const categoryMatch = selectedCategory === 'All' || m.category === selectedCategory;
    const rarityMatch = selectedRarities.length === 0 || selectedRarities.includes(m.rarity);
    return categoryMatch && rarityMatch;
  });

  const handleMarkerPress = (mission: Mission) => {
    Haptics.selectionAsync();
    setSelectedMission(mission);
    Animated.spring(bottomSheetAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const handleCloseSheet = () => {
    Animated.timing(bottomSheetAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedMission(null));
  };

  const handleStartMission = () => {
    if (selectedMission) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      startMutation.mutate();
      handleCloseSheet();
    }
  };

  const toggleRarity = (rarity: MissionRarity) => {
    Haptics.selectionAsync();
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    );
  };

  const handleOpenTravelModal = () => {
    Haptics.selectionAsync();
    setShowTravelModal(true);
    Animated.spring(travelModalAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const handleCloseTravelModal = () => {
    Animated.timing(travelModalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowTravelModal(false);
      setSelectedDestination(null);
    });
  };

  const handleSelectDestination = (destination: Destination) => {
    Haptics.selectionAsync();
    setSelectedDestination(destination);
  };

  const handleBookFlight = (airline: Airline, destination: Destination) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Switch to the destination city
    setCurrentCity(destination.id);
    // Reset filters
    setSelectedCategory('All');
    setSelectedRarities([]);
    handleCloseTravelModal();
  };

  const markers = filteredMissions.map((mission) => ({
    id: mission.id,
    coordinates: mission.coordinate,
    title: mission.title,
    tintColor: RARITY_CONFIG[mission.rarity].color,
  }));

  // Generate polylines for mission paths
  const currentPaths = MISSION_PATHS[currentCity] || [];
  const polylines = currentPaths.map((path, index) => {
    const coordinates = path.missionIds
      .map((missionId) => currentMissions.find((m) => m.id === missionId))
      .filter((m): m is Mission => m !== undefined)
      .map((m) => m.coordinate);
    
    return {
      id: `${path.name}-${index}`,
      coordinates,
      color: path.color, // Changed from strokeColor to color
      strokeWidth: 4, // Made thicker for better visibility
      lineDashPattern: [10, 10], // Dotted line pattern
    };
  });

  return (
    <View style={styles.container}>
      {/* Map - Centered on current city */}
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          key={currentCity} // Force remount when city changes
          style={StyleSheet.absoluteFill}
          cameraPosition={{
            coordinates: currentCityInfo.coordinate,
            zoom: 11, // City-level zoom
          }}
          markers={markers}
          polylines={polylines}
          onMarkerClick={(event) => {
            const mission = filteredMissions.find((m) => m.id === event.id);
            if (mission) handleMarkerPress(mission);
          }}
        />
      ) : (
        <GoogleMaps.View
          key={currentCity} // Force remount when city changes
          style={StyleSheet.absoluteFill}
          cameraPosition={{
            coordinates: currentCityInfo.coordinate,
            zoom: 11, // City-level zoom
          }}
          markers={markers}
          polylines={polylines}
          onMarkerClick={(event) => {
            const mission = filteredMissions.find((m) => m.id === event.id);
            if (mission) handleMarkerPress(mission);
          }}
        />
      )}

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.pageTitle}>Missions</Text>
          <Text style={styles.cityIndicator}>📍 {currentCityInfo.name}</Text>
        </View>
        <View style={styles.topBarActions}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setShowRoutes(!showRoutes);
              setShowFilters(false);
            }}
            style={[styles.iconButton, showRoutes && styles.iconButtonActive]}
          >
            <IconSymbol name="map" size={20} color={showRoutes ? '#FFFFFF' : '#0B0F14'} />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setShowFilters(!showFilters);
              setShowRoutes(false);
            }}
            style={[styles.iconButton, showFilters && styles.iconButtonActive]}
          >
            <IconSymbol name="line.3.horizontal.decrease.circle" size={20} color={showFilters ? '#FFFFFF' : '#0B0F14'} />
          </Pressable>
        </View>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={[styles.filtersPanel, { top: insets.top + 80 }]}>
          <Text style={styles.filterSectionTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(cat);
                }}
                style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[styles.filterSectionTitle, { marginTop: 12 }]}>Rarity</Text>
          <View style={styles.rarityGrid}>
            {RARITIES.map((rarity) => (
              <Pressable
                key={rarity}
                onPress={() => toggleRarity(rarity)}
                style={[
                  styles.rarityChip,
                  { borderColor: RARITY_CONFIG[rarity].color },
                  selectedRarities.includes(rarity) && {
                    backgroundColor: RARITY_CONFIG[rarity].color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rarityChipText,
                    { color: selectedRarities.includes(rarity) ? '#FFFFFF' : RARITY_CONFIG[rarity].color },
                  ]}
                >
                  {RARITY_CONFIG[rarity].label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Routes Panel */}
      {showRoutes && (
        <View style={[styles.routesPanel, { top: insets.top + 80 }]}>
          <Text style={styles.routesPanelTitle}>Curated Routes</Text>
          <ScrollView>
            {ROUTES.map((route) => (
              <Pressable
                key={route.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  // TODO: Implement route selection
                }}
                style={styles.routeCard}
              >
                <Text style={styles.routeEmoji}>{route.emoji}</Text>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeName}>{route.name}</Text>
                  <Text style={styles.routeMeta}>
                    {route.missions.length} missions · {route.distance}
                  </Text>
                </View>
                <Text style={styles.routeReward}>+${route.totalReward}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Bottom Sheet */}
      {selectedMission && (
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [
                {
                  translateY: bottomSheetAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
              ],
              opacity: bottomSheetAnim,
            },
          ]}
        >
          {/* Rarity Badge */}
          <View style={[styles.rarityBadge, { backgroundColor: RARITY_CONFIG[selectedMission.rarity].color }]}>
            <Text style={styles.rarityBadgeText}>{RARITY_CONFIG[selectedMission.rarity].label}</Text>
          </View>

          {/* Close Button */}
          <Pressable onPress={handleCloseSheet} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color="#6B7280" />
          </Pressable>

          {/* Mission Image */}
          {selectedMission.imageUrl && (
            <Image source={{ uri: selectedMission.imageUrl }} style={styles.missionImage} />
          )}

          <View style={styles.sheetContent}>
            <View style={styles.titleRow}>
              <Text style={styles.missionTitle}>{selectedMission.title}</Text>
              {selectedMission.type && (
                <View style={[styles.typeBadgeMini, { backgroundColor: selectedMission.type === 'global' ? '#8B5CF6' : '#10B981' }]}>
                  <Text style={styles.typeBadgeMiniText}>{selectedMission.type === 'global' ? '🌍 GLOBAL' : '📍 LOCAL'}</Text>
                </View>
              )}
            </View>
            <Text style={styles.missionSummary}>{selectedMission.summary}</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              {selectedMission.distance && (
                <View style={styles.statItem}>
                  <IconSymbol name="location.fill" size={14} color="#6B7280" />
                  <Text style={styles.statText}>{selectedMission.distance}</Text>
                </View>
              )}
              {selectedMission.timeEstimate && (
                <View style={styles.statItem}>
                  <IconSymbol name="clock.fill" size={14} color="#6B7280" />
                  <Text style={styles.statText}>{selectedMission.timeEstimate}</Text>
                </View>
              )}
              {selectedMission.completions && (
                <View style={styles.statItem}>
                  <IconSymbol name="person.2.fill" size={14} color="#6B7280" />
                  <Text style={styles.statText}>{selectedMission.completions.toLocaleString()} completed</Text>
                </View>
              )}
            </View>

            {/* Reward */}
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardLabel}>Reward</Text>
              <Text style={styles.rewardAmount}>+${selectedMission.reward} USDC</Text>
            </View>

            {/* CTA */}
            <Pressable
              onPress={handleStartMission}
              style={({ pressed }) => [styles.startButton, { opacity: pressed ? 0.9 : 1 }]}
            >
              <Text style={styles.startButtonText}>Start Mission</Text>
              <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Mission Count Badge */}
      <View style={[styles.countBadge, { top: insets.top + 130 }]}>
        <Text style={styles.countBadgeText}>
          {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Mission Paths Legend */}
      {currentPaths.length > 0 && (
        <View style={[styles.pathsLegend, { top: insets.top + 170 }]}>
          {currentPaths.map((path) => (
            <View key={path.name} style={styles.pathLegendItem}>
              <View style={[styles.pathDot, { backgroundColor: path.color }]} />
              <Text style={styles.pathLegendText}>{path.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Travel Elsewhere Button */}
      <Pressable
        onPress={handleOpenTravelModal}
        style={[styles.travelButton, { bottom: insets.bottom + 100 }]}
      >
        <Text style={styles.travelButtonIcon}>✈️</Text>
        <Text style={styles.travelButtonText}>Travel Elsewhere</Text>
      </Pressable>

      {/* Travel Modal */}
      {showTravelModal && (
        <>
          <Pressable
            style={styles.modalOverlay}
            onPress={handleCloseTravelModal}
          />
          <Animated.View
            style={[
              styles.travelModal,
              {
                transform: [
                  {
                    translateY: travelModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0],
                    }),
                  },
                ],
                opacity: travelModalAnim,
              },
            ]}
          >
            <View style={styles.modalHandle} />
            
            <Text style={styles.modalTitle}>
              {selectedDestination ? 'Book Your Flight' : 'Where to next?'}
            </Text>

            {!selectedDestination ? (
              <>
                <Text style={styles.modalSubtitle}>Choose your destination</Text>
                <View style={styles.destinationsGrid}>
                  {DESTINATIONS.filter(d => d.id !== currentCity).map((dest) => (
                    <Pressable
                      key={dest.id}
                      onPress={() => handleSelectDestination(dest)}
                      style={({ pressed }) => [
                        styles.destinationCard,
                        { opacity: pressed ? 0.8 : 1 },
                      ]}
                    >
                      <Text style={styles.destinationEmoji}>{dest.emoji}</Text>
                      <View style={styles.destinationInfo}>
                        <Text style={styles.destinationName}>{dest.name}</Text>
                        <Text style={styles.destinationCountry}>{dest.country}</Text>
                        <Text style={styles.destinationMissions}>
                          {dest.missionCount} missions available
                        </Text>
                      </View>
                      <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
                    </Pressable>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Pressable
                  onPress={() => setSelectedDestination(null)}
                  style={styles.backButton}
                >
                  <IconSymbol name="chevron.left" size={16} color="#6B7280" />
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>

                <View style={styles.selectedDestHeader}>
                  <Text style={styles.selectedDestEmoji}>{selectedDestination.emoji}</Text>
                  <View>
                    <Text style={styles.selectedDestName}>{selectedDestination.name}</Text>
                    <Text style={styles.selectedDestCountry}>{selectedDestination.country}</Text>
                  </View>
                </View>

                <Text style={styles.airlinesTitle}>Choose your airline partner</Text>
                
                {AIRLINES.map((airline) => (
                  <Pressable
                    key={airline.id}
                    onPress={() => handleBookFlight(airline, selectedDestination)}
                    style={({ pressed }) => [
                      styles.airlineCard,
                      { borderColor: airline.color, opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text style={styles.airlineLogo}>{airline.logo}</Text>
                    <View style={styles.airlineInfo}>
                      <Text style={styles.airlineName}>{airline.name}</Text>
                      <Text style={styles.airlineRoute}>
                        Singapore → {selectedDestination.name}
                      </Text>
                    </View>
                    <View style={[styles.airlineBadge, { backgroundColor: airline.color }]}>
                      <Text style={styles.airlineBadgeText}>Book Now</Text>
                    </View>
                  </Pressable>
                ))}

                <Text style={styles.partnerNote}>
                  🎁 Book with our partner airlines and unlock exclusive mission bonuses!
                </Text>
              </>
            )}
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FAFAF8',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E2DC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'Kugile',
  },
  cityIndicator: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    marginTop: 2,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
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
  iconButtonActive: {
    backgroundColor: '#0E1B2A',
    borderColor: '#0E1B2A',
  },
  filtersPanel: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    zIndex: 9,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0F14',
    marginBottom: 8,
    fontFamily: 'system font',
  },
  filterScroll: {
    marginBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0E1B2A',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'system font',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rarityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  rarityChipText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'system font',
  },
  routesPanel: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    maxHeight: 300,
    zIndex: 9,
  },
  routesPanelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0F14',
    marginBottom: 12,
    fontFamily: 'system font',
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  routeEmoji: {
    fontSize: 28,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  routeMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'system font',
  },
  routeReward: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
    fontFamily: 'system font',
  },
  countBadge: {
    position: 'absolute',
    left: 16,
    backgroundColor: '#0E1B2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 5,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'system font',
  },
  pathsLegend: {
    position: 'absolute',
    left: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 5,
    gap: 6,
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E2DC',
  },
  pathLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pathDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pathLegendText: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'system font',
    fontWeight: '500',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  rarityBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  rarityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'system font',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  missionImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContent: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    flex: 1,
  },
  typeBadgeMini: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeMiniText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    fontFamily: 'system font',
  },
  missionSummary: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    fontFamily: 'system font',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  rewardContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 14,
    color: '#15803D',
    fontFamily: 'system font',
  },
  rewardAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16A34A',
    fontFamily: 'system font',
  },
  startButton: {
    backgroundColor: '#0E1B2A',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
  travelButton: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0E1B2A',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  travelButtonIcon: {
    fontSize: 18,
  },
  travelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'system font',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  travelModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    zIndex: 101,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'Kugile',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 20,
  },
  destinationsGrid: {
    gap: 12,
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    gap: 12,
  },
  destinationEmoji: {
    fontSize: 36,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  destinationCountry: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    marginTop: 2,
  },
  destinationMissions: {
    fontSize: 12,
    color: '#16A34A',
    fontFamily: 'system font',
    marginTop: 4,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  selectedDestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  selectedDestEmoji: {
    fontSize: 48,
  },
  selectedDestName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  selectedDestCountry: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'system font',
    marginTop: 2,
  },
  airlinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 12,
  },
  airlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    gap: 12,
    marginBottom: 12,
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  airlineLogo: {
    fontSize: 32,
  },
  airlineInfo: {
    flex: 1,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  airlineRoute: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    marginTop: 2,
  },
  airlineBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  airlineBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
  },
  partnerNote: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
});
