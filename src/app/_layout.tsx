import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/src/app/components/useColorScheme';

export { ErrorBoundary, } from 'expo-router'; // Catch any errors thrown by the Layout component.
export const unstable_settings = { initialRouteName: '(tabs)', }; // Ensure that reloading on `/modal` keeps a back button present.
SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding before asset loading is complete.

/** 
 * ROOT LAYOUT
 * Entry Point to the app
 * **/
export default function RootLayout() {

  //LOADING FONTS
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/NeueHaasDisplayRoman.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

/** 
 * ROOT LAYOUT NAV
 * 
 * **/
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        <Stack.Screen name="modals/tool-tip-register-modal" options={{ presentation: 'card' }} />
      </Stack>
    </ThemeProvider>
  );
}
