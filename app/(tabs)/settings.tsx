import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SettingItem = {
  id: string;
  icon: string;
  label: string;
  value?: string;
  type: 'navigation' | 'toggle' | 'action';
  enabled?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
};

export default function SettingsScreen() {
  const { signOut, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const accountSettings: SettingItem[] = [
    {
      id: 'profile',
      icon: 'person.circle.fill',
      label: 'Edit Profile',
      value: 'Update your information',
      type: 'navigation',
      onPress: () => {
        Haptics.selectionAsync();
        Alert.alert('Coming Soon', 'Profile editing will be available soon!');
      },
    },
    {
      id: 'card',
      icon: 'creditcard.fill',
      label: 'Card Management',
      value: 'Manage your GlobeTrotter+ card',
      type: 'navigation',
      onPress: () => {
        Haptics.selectionAsync();
        router.push('/(tabs)/card');
      },
    },
    {
      id: 'vault',
      icon: 'lock.fill',
      label: 'Yield Vault',
      value: '$127,450.82',
      type: 'navigation',
      onPress: () => {
        Haptics.selectionAsync();
        Alert.alert('Vault Details', 'Your USDC vault is earning 8.5% APY');
      },
    },
  ];

  const preferencesSettings: SettingItem[] = [
    {
      id: 'notifications',
      icon: 'bell.fill',
      label: 'Push Notifications',
      type: 'toggle',
      enabled: notificationsEnabled,
      onToggle: (value) => {
        Haptics.selectionAsync();
        setNotificationsEnabled(value);
      },
    },
    {
      id: 'location',
      icon: 'location.fill',
      label: 'Location Services',
      type: 'toggle',
      enabled: locationEnabled,
      onToggle: (value) => {
        Haptics.selectionAsync();
        setLocationEnabled(value);
      },
    },
    {
      id: 'darkmode',
      icon: 'moon.fill',
      label: 'Dark Mode',
      type: 'toggle',
      enabled: darkModeEnabled,
      onToggle: (value) => {
        Haptics.selectionAsync();
        setDarkModeEnabled(value);
        Alert.alert('Coming Soon', 'Dark mode will be available in a future update!');
      },
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: 'badges',
      icon: 'star.fill',
      label: 'Badges & Achievements',
      type: 'navigation',
      onPress: () => {
        Haptics.selectionAsync();
        router.push('/badges');
      },
    },
    {
      id: 'privacy',
      icon: 'hand.raised.fill',
      label: 'Privacy & Security',
      type: 'navigation',
      onPress: () => {
        Haptics.selectionAsync();
        Alert.alert('Privacy & Security', 'Your data is encrypted and secure. We never share your information.');
      },
    },
    {
      id: 'help',
      icon: 'questionmark.circle.fill',
      label: 'Help & Support',
      type: 'navigation',
      onPress: () => {
        Haptics.selectionAsync();
        Alert.alert('Help & Support', 'Contact us at support@globetrotter.com');
      },
    },
    {
      id: 'about',
      icon: 'info.circle.fill',
      label: 'About',
      value: 'Version 1.0.0',
      type: 'navigation',
      onPress: () => {
        Haptics.selectionAsync();
        Alert.alert('About GlobeTrotter+', 'Version 1.0.0\n\nTravel. Earn. Explore.\n\n© 2024 GlobeTrotter+ by Bank of Vibes');
      },
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    if (item.type === 'toggle') {
      return (
        <View key={item.id} style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.iconContainer}>
              <IconSymbol name={item.icon as any} size={20} color="#0B0F14" />
            </View>
            <Text style={styles.settingLabel}>{item.label}</Text>
          </View>
          <Switch
            value={item.enabled}
            onValueChange={item.onToggle}
            trackColor={{ false: '#D1D5DB', true: '#B89A5C' }}
            thumbColor="#FFFFFF"
          />
        </View>
      );
    }

    return (
      <Pressable
        key={item.id}
        onPress={item.onPress}
        style={({ pressed }) => [
          styles.settingItem,
          { backgroundColor: pressed ? '#F9FAFB' : '#FFFFFF' },
        ]}
      >
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <IconSymbol name={item.icon as any} size={20} color="#0B0F14" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
          </View>
        </View>
        <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />
      </Pressable>
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#0B0F14" />
        </Pressable>
      </View>

      <Text style={styles.pageTitle}>Settings</Text>

      {/* Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.section}>
        {accountSettings.map(renderSettingItem)}
      </View>

      {/* Preferences Section */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.section}>
        {preferencesSettings.map(renderSettingItem)}
      </View>

      {/* App Section */}
      <Text style={styles.sectionTitle}>App</Text>
      <View style={styles.section}>
        {appSettings.map(renderSettingItem)}
      </View>

      {/* Sign Out */}
      {isSignedIn && (
        <View style={styles.section}>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.signOutButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for travelers worldwide</Text>
        <Text style={styles.footerSubtext}>Powered by Bank of Vibes</Text>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'system font',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    overflow: 'hidden',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  settingValue: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'system font',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'system font',
  },
});


