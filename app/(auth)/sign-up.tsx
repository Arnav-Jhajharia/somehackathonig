import { ThemedText } from '@/components/themed-text';
import { useAuth, useOAuth, useSignUp } from '@clerk/clerk-expo';
import { makeRedirectUri } from 'expo-auth-session';
import * as Haptics from 'expo-haptics';
import { Link, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { isSignedIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  React.useEffect(() => {
    if (isSignedIn) router.replace('/(auth)/onboarding');
  }, [isSignedIn]);

  const request = async () => {
    if (!isLoaded || isSignedIn) return;
    try {
      await signUp.create({ emailAddress: email });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setSent(true);
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message || String(e);
      if (/session already exists/i.test(msg)) {
        router.replace('/(auth)/onboarding');
        return;
      }
      Alert.alert('Error', 'Failed to send code');
    }
  };

  const verify = async () => {
    if (!isLoaded || isSignedIn) return;
    try {
      await signUp.attemptEmailAddressVerification({ code: otp });
      const result = await signUp.create({});
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        try { await Haptics.selectionAsync(); } catch {}
        router.replace('/(auth)/onboarding');
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message || String(e);
      if (/session already exists/i.test(msg)) {
        router.replace('/(auth)/onboarding');
        return;
      }
      Alert.alert('Error', 'Invalid code');
    }
  };

  const signUpWithGoogle = async () => {
    try {
      setLoading(true);
      const redirectUrl = makeRedirectUri();
      const res = await startOAuthFlow?.({ redirectUrl });
      if (res?.createdSessionId && res.setActive) {
        await res.setActive({ session: res.createdSessionId });
        try { await Haptics.selectionAsync(); } catch {}
        router.replace('/(auth)/onboarding');
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message || String(e);
      if (/session already exists/i.test(msg)) {
        router.replace('/(auth)/onboarding');
      } else {
        Alert.alert('Error', 'Google sign-up failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Luxury OTP segmented style
  const otpDigits = 6;
  const [otpArray, setOtpArray] = React.useState<string[]>(Array(otpDigits).fill(''));
  const inputs = React.useRef<Array<TextInput | null>>([]);

  React.useEffect(() => {
    setOtpArray(Array(otpDigits).fill(''));
  }, [sent]);

  const onChangeDigit = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otpArray];
    next[idx] = digit;
    setOtpArray(next);
    setOtp(next.join(''));
    if (digit && idx < otpDigits - 1) inputs.current[idx + 1]?.focus();
  };

  return (
    <View style={{ flex: 1, padding: 28, gap: 28, justifyContent: 'center', backgroundColor: '#FAFAF8' }}>
      <View style={{ alignItems: 'center', gap: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#0E1B2A', alignItems: 'center', justifyContent: 'center', shadowColor: '#0B0F14', shadowOpacity: 0.08, shadowRadius: 16 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Kugile' }}>GT+</Text>
        </View>
        <ThemedText type="title" style={{ color: '#0B0F14', fontSize: 42 }}>Create your account</ThemedText>
        <ThemedText style={{ color: '#6B7280', fontSize: 16 }}>Join GlobeTrotter+ today</ThemedText>
      </View>
      <View style={{ gap: 16 }}>
        <Pressable onPress={signUpWithGoogle} style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: '#E7E2DC', shadowColor: '#0B0F14', shadowOpacity: 0.06, shadowRadius: 24 }}>
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={{ width: 18, height: 18 }} />
          <ThemedText style={{ color: '#0B0F14', fontSize: 16 }}>{loading ? 'Opening…' : 'Sign up with Google'}</ThemedText>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#EEE9E3' }} />
          <ThemedText style={{ color: '#B89A5C', fontSize: 12 }}>or</ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: '#EEE9E3' }} />
        </View>
        <View style={{ gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E7E2DC', shadowColor: '#0B0F14', shadowOpacity: 0.04, shadowRadius: 18 }}>
          {!sent && (
            <>
              <TextInput placeholder="Email address" placeholderTextColor="#9AA2AF" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={{ color: '#0B0F14', borderWidth: 1, borderColor: '#E7E2DC', padding: 14, borderRadius: 14, backgroundColor: '#FFFFFF' }} />
              <Pressable onPress={request} style={{ backgroundColor: '#0E1B2A', padding: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#0B0F14', shadowOpacity: 0.08, shadowRadius: 24 }}>
                <ThemedText style={{ color: '#fff' }}>Send code</ThemedText>
              </Pressable>
            </>
          )}
          {sent && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                {otpArray.map((d, idx) => (
                  <TextInput
                    key={idx}
                    ref={(el) => { inputs.current[idx] = el; }}
                    value={d}
                    onChangeText={(v) => onChangeDigit(idx, v)}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoFocus={idx === 0}
                    style={{ width: 48, height: 56, textAlign: 'center', borderWidth: 1, borderColor: '#E7E2DC', borderRadius: 12, backgroundColor: '#FFFFFF', color: '#0B0F14', fontSize: 18, shadowColor: '#B89A5C', shadowOpacity: 0.15, shadowRadius: 6 }}
                  />
                ))}
              </View>
              <Pressable onPress={verify} style={{ backgroundColor: '#0E1B2A', padding: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#0B0F14', shadowOpacity: 0.08, shadowRadius: 24 }}>
                <ThemedText style={{ color: '#fff' }}>Verify</ThemedText>
              </Pressable>
            </>
          )}
        </View>
      </View>
      <Link href="/(auth)/sign-in" asChild>
        <Pressable style={{ padding: 8, alignItems: 'center' }}>
          <ThemedText style={{ color: '#6B7280' }}>Already have an account?</ThemedText>
        </Pressable>
      </Link>
    </View>
  );
}


