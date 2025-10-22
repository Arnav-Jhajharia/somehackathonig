import * as SecureStore from 'expo-secure-store';

let getTokenFn: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  getTokenFn = getter;
}

export async function getAuthToken(): Promise<string | null> {
  if (getTokenFn) return getTokenFn();
  try {
    // Fallback: read any persisted token if available (best-effort)
    return (await SecureStore.getItemAsync('clerk-db-jwt')) || null;
  } catch {
    return null;
  }
}


