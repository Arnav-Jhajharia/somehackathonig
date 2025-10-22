import { usePlanTrip } from '@/app/api/hooks';
import { usePlannerStore } from '@/app/store/planner';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PlanScreen() {
  const { destination, startDate, endDate, setField, setBundles } = usePlannerStore();
  const [running, setRunning] = React.useState(false);
  const planTrip = usePlanTrip();

  const onPlan = async () => {
    setRunning(true);
    const bundles = await planTrip(destination, startDate, endDate);
    setBundles(bundles);
    setRunning(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={styles.header}>Plan a Trip</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Destination</Text>
        <TextInput value={destination} onChangeText={(t) => setField('destination', t)} placeholder="City or country" style={styles.input} />
        <Text style={styles.label}>Start date</Text>
        <TextInput value={startDate} onChangeText={(t) => setField('startDate', t)} placeholder="YYYY-MM-DD" style={styles.input} />
        <Text style={styles.label}>End date</Text>
        <TextInput value={endDate} onChangeText={(t) => setField('endDate', t)} placeholder="YYYY-MM-DD" style={styles.input} />
        <Pressable onPress={onPlan} style={styles.cta}>
          <Text style={styles.ctaText}>{running ? 'Planning…' : 'Generate bundles'}</Text>
        </Pressable>
      </View>

      <BundlesList />
    </ScrollView>
  );
}

function BundlesList() {
  const { bundles } = usePlannerStore();
  if (!bundles.length) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.section}>Suggested Bundles</Text>
      {bundles.map((b, i) => (
        <View key={i} style={styles.bundle}>
          <Text style={styles.bundleTitle}>{b.title}</Text>
          <Text style={styles.bundleMeta}>{b.summary}</Text>
          <Text style={styles.bundleMeta}>Projected: {b.projectedReward} USDC • APY +{b.apyImpact}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 28, fontWeight: '700', color: '#0B0F14' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    gap: 10,
  },
  label: { fontSize: 12, color: '#6B7280' },
  input: {
    borderWidth: 1,
    borderColor: '#E7E2DC',
    borderRadius: 12,
    padding: 12,
    color: '#0B0F14',
    backgroundColor: '#FFFFFF',
  },
  cta: { backgroundColor: '#0E1B2A', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  ctaText: { color: '#fff', fontWeight: '600' },
  section: { fontSize: 16, fontWeight: '700', color: '#0B0F14', marginBottom: 8 },
  bundle: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  bundleTitle: { fontSize: 14, fontWeight: '700', color: '#0B0F14' },
  bundleMeta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});


