import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type OnboardingStep = 'bank' | 'wallet' | 'complete';

export default function OnboardingScreen() {
  const [step, setStep] = useState<OnboardingStep>('bank');

  useEffect(() => {
    // Bank connection step - 2 seconds
    const bankTimer = setTimeout(() => {
      setStep('wallet');
    }, 2000);

    return () => clearTimeout(bankTimer);
  }, []);

  useEffect(() => {
    if (step === 'wallet') {
      // Wallet connection step - 2 seconds
      const walletTimer = setTimeout(() => {
        setStep('complete');
        // Navigate to main app
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      }, 2000);

      return () => clearTimeout(walletTimer);
    }
  }, [step]);

  return (
    <View style={styles.container}>
      {step === 'bank' && (
        <Animated.View
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
          style={styles.content}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🏦</Text>
          </View>
          <Text style={styles.title}>Connecting to Bank of Vibes</Text>
          <Text style={styles.subtitle}>Securing your account...</Text>
          <ActivityIndicator size="large" color="#0B0F14" style={styles.spinner} />
        </Animated.View>
      )}

      {step === 'wallet' && (
        <Animated.View
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
          style={styles.content}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>
          <Text style={styles.title}>Connecting Crypto Wallet</Text>
          <Text style={styles.subtitle}>Setting up your USDC vault...</Text>
          <ActivityIndicator size="large" color="#0B0F14" style={styles.spinner} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'system font',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  spinner: {
    marginTop: 8,
  },
});

