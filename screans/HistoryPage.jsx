import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { GameContext } from '../components/GameContext';

// HistoryPage component to display the game history
const HistoryPage = () => {
  // Get the game history and setHistory function from the GameContext
  const { history, setHistory } = useContext(GameContext);

  // Function to handle the "Clear History" button press
  const handleClearHistory = () => {
    setHistory([]); // Clear the game history by setting it to an empty array
  };

  // Function to render each history entry in the FlatList
  const renderEntry = ({ item, index }) => {
    // Determine the style for the history entry based on the result (Draw, Blue Win, or Red Win)
    const entryStyle =
      item.result === 'Draw'
        ? styles.entryDraw
        : item.result === 'Blue'
        ? styles.entryBlueWin
        : styles.entryRedWin;

    return (
      // Render the history entry with the determined style
      <View style={[styles.entryContainer, entryStyle]}>
        <Text style={styles.entryText}>
          {item.result === 'Draw' ? 'Draw' : `Winner: ${item.result}`}
        </Text>
      </View>
    );
  };

  return (
    // Render the HistoryPage component with a background image
    <ImageBackground source={require('../assets/background_image.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Title of the game history */}
        <Text style={styles.title}>Game History</Text>

        {/* FlatList to display the history entries */}
        <FlatList
          data={history}
          renderItem={renderEntry}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />

        {/* "Clear History" button */}
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Styles for the HistoryPage component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40, 
    paddingBottom: 20, 
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40, 
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  entryContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    paddingHorizontal: 80,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    alignItems: 'center', 
    marginHorizontal: 20,
  },
  entryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  entryDraw: {
    backgroundColor: 'rgba(211, 211, 211, 0.8)', // Light grey background for "Draw" entries
  },
  entryBlueWin: {
    backgroundColor: 'blue', // Blue background for "Blue Win" entries
  },
  entryRedWin: {
    backgroundColor: 'red', // Red background for "Red Win" entries
  },
  clearButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 4,
    marginTop: 20,
  },
  clearButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default HistoryPage;
