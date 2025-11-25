import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(
      colorScheme === 'dark' ? '#000000' : '#ffffff'
    );
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastManager />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar style="auto" />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="add_location" options={{ title: 'Add Location' }} />
            <Stack.Screen name="edit_location" options={{ title: 'Edit Location' }} />
            <Stack.Screen name="locations_list" options={{ title: 'Locations List' }} />
          </Stack>
        </ThemeProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
