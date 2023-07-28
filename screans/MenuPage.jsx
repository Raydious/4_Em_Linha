import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { GameContext } from '../components/GameContext';
import { useContext } from 'react';

const MenuPage = ({ navigation }) => {
  const { rows, cols } = useContext(GameContext);

  const handleStartGame = () => {
    // Navigate to the classic Connect Four game page with the specified number of rows and columns
    navigation.navigate('GamePage', { rows, cols });
  };

  const handleSettings = () => {
    // Navigate to the settings page
    navigation.navigate('SettingsPage');
  };

  const handleSpeedMode = () => {
    // Navigate to the Speed Mode game page
    navigation.navigate('SpeedModePage');
  };

  const handleHistory = () => {
    // Navigate to the History page
    navigation.navigate('HistoryPage');
  };

  return (
    <ImageBackground source={require('../assets/background_image.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Connect Four</Text>

        <TouchableOpacity style={styles.button} onPress={handleStartGame}>
          <Text style={styles.buttonText}>Normal Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSpeedMode}>
          <Text style={styles.buttonText}>Speed Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleHistory}>
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        
      </View>
    </ImageBackground>
  );
};

// Styles for the MenuPage component
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'blue',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default MenuPage;
