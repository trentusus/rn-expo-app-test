import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatsigProviderRN } from '@statsig/react-native-bindings';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { getUserPersistentOverrideAdapter } from '@/utils/persistedUserAdapter';

// Direct SDK key
const STATSIG_SDK_KEY = 'YOUR_KEY_HERE';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });



  const statsigOptions = useMemo(() => ({
    overrideAdapter: getUserPersistentOverrideAdapter(),
  }), []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <StatsigProviderRN 
      sdkKey={STATSIG_SDK_KEY}
      user={{ userID: "control-group-user-3" }} // You can make this dynamic based on your auth system
      options={statsigOptions}
      loadingComponent={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      }
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </StatsigProviderRN>
  );
}
