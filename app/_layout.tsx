import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { ColorSchemeName, Platform, useColorScheme } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import { SERVER } from '@/constants/link';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [scheme, setScheme] = useState<any>()
  const inUserGroup = segments[0] === '(user)'
  const inStudentGroup = segments[0] === 'student'

  useEffect(() => {
    if (!isLoaded) return

    const loadTheme = async () => {
      const savedScheme = await AsyncStorage.getItem('colorScheme')
      if (savedScheme) {
        try {
          const parsedScheme = JSON.parse(savedScheme) as ColorSchemeName;
          setScheme(parsedScheme);
          if (Platform.OS !== 'web') Appearance.setColorScheme(parsedScheme);
        } catch (error) {
          console.error('Error parsing saved color scheme:', error);
        }
      } else {
        setScheme(colorScheme);
      }
    };
    loadTheme();

    if (isSignedIn) {

      const role = user?.publicMetadata?.role;
      if (role === "user" && !inUserGroup) {
        router.replace('/(user)/home');
      } else if (role === 'student' && !inStudentGroup && !user?.publicMetadata.access) {
        router.replace("/student/attendance");
      } else if (role === 'student' && !inStudentGroup && user?.publicMetadata.access) {
        router.replace("/student/(home)");
      }
    } else {
      router.replace('/login');
    }
  }, [isLoaded, user])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Slot />
        </ThemeProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  )

}

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const RootLayout = () => {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}

export default RootLayout;
