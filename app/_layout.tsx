import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppClerkProvider } from '@/app/auth/clerk';
import { CardOverlayProvider } from '@/app/providers/card-overlay';
import { ReactQueryProvider } from '@/app/providers/react-query';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFonts } from 'expo-font';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Kugile: require('@/Kugile_Demo.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <AppClerkProvider>
      <ReactQueryProvider>
        <CardOverlayProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="dark" />
          </ThemeProvider>
        </CardOverlayProvider>
      </ReactQueryProvider>
    </AppClerkProvider>
  );
}
