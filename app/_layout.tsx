import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useColorScheme } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();


  useEffect(() => {
    if (!isLoaded) return

    const inUserGroup = segments[0] === '(user)'
    const inStudentGroup = segments[0] === '(student)'

    if (isSignedIn) {
      const role = user?.publicMetadata?.role; // Assuming you store the role in publicMetadata
      if (!role && !inUserGroup) {
        router.replace('/(user)/home');
      } else if (role === 'student' && !inStudentGroup) {
        router.replace('/(student)/(home)/');
      }
    } else {
      router.replace('/login');
    }
    console.log('user', isSignedIn, 'role', user?.publicMetadata?.role);
  }, [isLoaded, user])

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Theme name='blue'>
            <Slot />
          </Theme>
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

  useEffect(() => {
    if (loaded) {
      // Can hide splash screen here
    }
  }, [loaded]);

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