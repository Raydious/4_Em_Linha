import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuPage from './screans/MenuPage';
import GamePage from './screans/GamePage';
import SettingsPage from './screans/SettingsPage';
import { GameProvider } from './components/GameContext';
import { Asset } from 'expo-asset';
import SpeedModePage from './screans/SpeedModePage';
import HistoryPage from './screans/HistoryPage';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // Image Preloading
    const imagesToPreload = [
      require('./assets/background_image.jpg'),
    ];

    const preloadImages = async () => {
      const tasks = imagesToPreload.map(image => Asset.fromModule(image).downloadAsync());
      await Promise.all(tasks);
    };

    preloadImages();
  }, []);

  return (
    <NavigationContainer>
      <GameProvider>
        <Stack.Navigator initialRouteName="MenuPage">
          <Stack.Screen
            name="MenuPage"
            component={MenuPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GamePage"
            component={GamePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SettingsPage"
            component={SettingsPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SpeedModePage"
            component={SpeedModePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HistoryPage"
            component={HistoryPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </GameProvider>
    </NavigationContainer>
  );
};

export default App;
