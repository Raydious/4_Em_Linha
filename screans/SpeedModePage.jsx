import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ImageBackground, Button } from 'react-native';
import { GameContext } from '../components/GameContext';
import { useContext } from 'react';

const SpeedGamePage = () => {
  // Get the number of rows and columns from the GameContext
  const { rows, cols } = useContext(GameContext);

  // State variables for the game
  const [board, setBoard] = useState(Array(parseInt(rows)).fill(null).map(() => Array(parseInt(cols)).fill(null)));
  const [timer, setTimer] = useState(60); // 60 seconds timer for the speed mode
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(true); // Show the modal by default to explain the game
  const [intervalTime, setIntervalTime] = useState(1000); // Initial interval time for ball appearance
  const [gameStarted, setGameStarted] = useState(false); // State to track if the game has started or not

  // Function to start the game timer when the user clicks "Start"
  useEffect(() => {
    if (gameStarted && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // Clear the interval when the component is unmounted or timer reaches 0
      return () => clearInterval(interval);
    }
  }, [gameStarted, timer]);

  // Function to handle ball appearance and disappearance
  const handleBallMovement = useCallback(() => {
    const randomRow = Math.floor(Math.random() * parseInt(rows));
    const randomCol = Math.floor(Math.random() * parseInt(cols));
    setBoard((prevBoard) => {
      if (!prevBoard[randomRow][randomCol]) {
        prevBoard[randomRow][randomCol] = 1;
        return [...prevBoard];
      }
      return prevBoard;
    });
    setTimeout(() => {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => row.map((cell) => (cell === 1 ? null : cell)));
        return newBoard;
      });
    }, 2000); // Ball disappears after 2 seconds
  }, [rows, cols]);

  // Function to handle clicking on a ball
  const handleCellClick = (row, col) => {
    if (gameStarted && board[row][col]) {
      // If the cell has a ball and the game has started, increase the score and remove the ball
      setScore((prevScore) => prevScore + 1);
      setBoard((prevBoard) => {
        prevBoard[row][col] = null;
        return [...prevBoard];
      });
    }
  };

  // Function to reset the game
  const handleResetGame = () => {
    setBoard(Array(parseInt(rows)).fill(null).map(() => Array(parseInt(cols)).fill(null)));
    setTimer(60);
    setScore(0);
    setShowModal(true);
    setGameStarted(false);
  };

  // Function to handle ball appearance after the previous ball disappears or is clicked
  useEffect(() => {
    if (gameStarted && timer > 0) {
      const ballAppearanceInterval = setInterval(() => {
        handleBallMovement();
      }, intervalTime);
      return () => clearInterval(ballAppearanceInterval);
    }
  }, [handleBallMovement, gameStarted, timer, intervalTime]);

  // Function to start the game
  const startGame = () => {
    setGameStarted(true);
    setShowModal(false); // Hide the modal when the game starts
  };

  return (
    <ImageBackground source={require('../assets/background_image.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Title of the speed game */}
        <Text style={styles.title}>Speed Mode</Text>

        {/* Display the timer and score when the game is started */}
        {gameStarted && (
          <>
            <Text style={styles.timer}>Time Remaining: {timer}s</Text>
            <Text style={styles.score}>Score: {score}</Text>
          </>
        )}

        {/* Game board to display the balls */}
        <View style={styles.board}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={[styles.cell, cell ? styles.ballCell : null]}
                  onPress={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell === 1 && <View style={styles.ball} />}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Modal to explain the game and start the game */}
        {!gameStarted && (
          <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Welcome to Speed Mode!</Text>
                <Text style={styles.menuText}>Tap the red balls to score points.</Text>
                <Text style={styles.menuText}>You have 60 seconds to score as many points as possible.</Text>
                <Text style={styles.menuText}>Ready to start?</Text>
                <Button title="Start Game" onPress={startGame} />
              </View>
            </View>
          </Modal>
        )}

        {/* Game Over Modal */}
        <Modal visible={timer === 0} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Game Over</Text>
              <Text style={styles.modalScore}>Your Score: {score}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleResetGame}>
                <Text style={styles.modalButtonText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Styles for the SpeedGamePage component
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  timer: {
    fontSize: 20,
    marginBottom: 5,
    color: 'white',
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
  },
  board: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'rgba(237, 240, 239, 0.5)',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  ballCell: {
    backgroundColor: 'rgba(237, 240, 239, 0.0)',
  },
  ball: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red', 
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalScore: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default SpeedGamePage;
