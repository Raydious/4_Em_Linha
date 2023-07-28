import React, { createContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// Create a new context called GameContext
export const GameContext = createContext();

// Create a GameProvider component to manage the game state
export const GameProvider = ({ children }) => {
  // State variables for the number of rows and columns in the game board
  const [rows, setRows] = useState('6');
  const [cols, setCols] = useState('7');

  // State variable to control the background music
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  // State variable to store the background music sound object
  const [sound, setSound] = useState(null);

  // useRef to hold the current value of isMusicEnabled
  const isMusicEnabledRef = useRef(isMusicEnabled);

  // State variable to store the game history
  const [history, setHistory] = useState([]);

  // Function to load and play the background music
  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/music.mp3'),
        { shouldPlay: true, isLooping: true } // Play the music and loop it
      );
      setSound(sound);
    } catch (error) {
      console.log('Error loading sound:', error);
    }
  };

  // useEffect to load the background music when the component mounts
  useEffect(() => {
    loadSound();
  }, []);

  // useEffect to handle changes to isMusicEnabled and play/pause the music accordingly
  useEffect(() => {
    isMusicEnabledRef.current = isMusicEnabled;
    console.log("isMusicEnable:" + isMusicEnabled);
    if (sound) {
      isMusicEnabled ? sound.playAsync() : sound.pauseAsync();
    }
  }, [isMusicEnabled, sound]);

  // useEffect to set a listener for the end of the music and restart it if enabled
  useEffect(() => {
    const musicEndListener = (status) => {
      // Check if the music has finished playing and restart it if enabled
      if (status.didJustFinish && isMusicEnabledRef.current) {
        sound.replayAsync(); // Restart the music
      }
    };

    if (sound) {
      sound.setOnPlaybackStatusUpdate(musicEndListener);
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Function to toggle the background music on/off
  const toggleMusic = () => {
    setIsMusicEnabled((prevIsMusicEnabled) => !prevIsMusicEnabled);
  };

  // Function to add a winner to the game history
  const addWinnerToHistory = (result) => {
    setHistory((prevHistory) => [...prevHistory, { result }]);
  };

  // Provide the game state and functions to the children components using the GameContext.Provider
  return (
    <GameContext.Provider
      value={{
        rows,
        cols,
        setRows,
        setCols,
        isMusicEnabled,
        toggleMusic,
        history,
        addWinnerToHistory,
        setHistory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};