import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { setAuthTokenGetter } from '@/app/api/tokens';

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
};

export function getClerkPublishableKey() {
  return process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
}

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = getClerkPublishableKey();
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AuthBridge>{children}</AuthBridge>
    </ClerkProvider>
  );
}

function AuthBridge({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  React.useEffect(() => {
    setAuthTokenGetter(async () => {
      try {
        // Request a backend-issuable JWT if configured (template claims)
        return (await getToken({ template: 'backend' })) ?? null;
      } catch {
        return null;
      }
    });
  }, [getToken]);
  return <>{children}</>;
}

export { tokenCache } from "@clerk/clerk-expo/token-cache";


