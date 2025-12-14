import '@/global.css';
import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { apolloClient } from '@/src/services/apollo';
import { store } from '@/src/store/store';
import { ApolloProvider } from '@apollo/client/react';
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
import { Provider } from 'react-redux';
import ToastManager from 'toastify-react-native';
import { useNotification } from '../hooks/useNotification';
useNotification();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(
      colorScheme === 'dark' ? '#000000' : '#ffffff'
    );
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <GluestackUIProvider mode='system'>
            <ToastManager />
            <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff' }}>
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
          </GluestackUIProvider>
        </Provider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}
