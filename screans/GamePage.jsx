import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, ImageBackground } from 'react-native';
import { GameContext } from '../components/GameContext';
import { useContext } from 'react';


const GamePage = () => {
  const { history, addWinnerToHistory } = useContext(GameContext);

  const [showRulesModal, setShowRulesModal] = useState(true);
  // State variable to control the visibility of the rules modal.

  const { rows, cols } = useContext(GameContext);
  //console.log("Rows: " + rows + "Cols: " + cols);
  const [board, setBoard] = useState(Array(parseInt(rows)).fill(null)
    .map(() =>
      // For each row, create an array of size COLS and fill it with null values
      Array(parseInt(cols)).fill(null)
    ));
  console.log(board);

  const [startPlayer, setStartPlayer] = useState('Blue');

  const [player, setPlayer] = useState(startPlayer);
  // State variable to keep track of the current player in the game.

  const [showWinModal, setShowWinModal] = useState(false);
  // State variable to control the visibility of the win modal.

  const [winner, setWinner] = useState('');
  // State variable to store the name of the winner of the game.

  // Create a ref to store the Animated.Value for each ball
  const ballAnimations = useRef(
    board.map((row, rowIndex) =>
      row.map((cell, colIndex) => new Animated.Value(-(parseInt(rows) - 1 - rowIndex) * 50))
    )
  ).current;

  // Function to check for a draw condition
  const checkDraw = (board) => {
    for (let row of board) {
      for (let cell of row) {
        if (cell === null) {
          // If there is an empty cell, the game is not a draw
          return false;
        }
      }
    }
    // If all cells are filled and no player has won, it's a draw
    return true;
  };

  // Handle the click event on a cell
  const handleCellClick = (row, col) => {
    // Create a new copy of the game board
    const newBoard = [...board];

    // Initialize a variable to track the row where the player's ball will be placed
    let newRow = null;

    // Iterate through the rows of the game board from bottom to top
    for (let r = parseInt(rows) - 1; r >= 0; r--) {
      // Check if the current cell in the column is empty (null)
      if (newBoard[r][col] === null) {
        // If the cell is empty, set the newRow variable to the current row
        newRow = r;
        // Exit the loop since we found the appropriate row
        break;
      }
    }

    // Check if a valid empty row was found
    if (newRow !== null) {
      // Place the player's ball in the newBoard array at the determined row and column
      newBoard[newRow][col] = player;

      // Update the game board state with the newBoard array
      setBoard(newBoard);

      // Calculate the translateY value for the animation based on the initial position of the ball
      const startY = -(parseInt(rows) - 1 - newRow + 1) * 50; // Move the starting position above the visible area
      const endY = 0; // End position for all rows

      // Reset the Animated.Value to the initial position before starting a new animation
      ballAnimations[newRow][col].setValue(startY);

      // Animate the ball falling into its place
      Animated.timing(ballAnimations[newRow][col], {
        toValue: endY,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Switch players: If the current player is Player 1, set it to Player 2, otherwise set it to Player 1
      setPlayer(player === 'Blue' ? 'Red' : 'Blue');

      // Check for a draw after each move
      if (checkDraw(newBoard)) {
        // Set the winner state to 'Draw'
        setWinner('Draw');

        // Show the win modal for a draw
        setShowWinModal(true);

        // Check if the current move will not result in a win
        if (!checkWin(newBoard, newRow, col, player)) {
          // Add the draw to the history
          addWinnerToHistory('Draw');
        }
      }

      // Check if the current move resulted in a win
      if (checkWin(newBoard, newRow, col, player)) {
        // Set the winner state to the current player
        setWinner(player);

        // Show the win modal
        setShowWinModal(true);

        // Add the winner to the history
        addWinnerToHistory(player);
      }


    }
  };


  const checkWin = (board, row, col, player) => {
    // Check horizontally
    let count = 0;
    for (let c = 0; c < parseInt(cols); c++) {
      if (board[row][c] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }

    // Check vertically
    count = 0;
    for (let r = 0; r < parseInt(rows); r++) {
      if (board[r][col] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }

    // Check diagonally (top-left to bottom-right)
    count = 0;
    const startOffset = Math.min(row, col);
    const startRow = row - startOffset;
    const startCol = col - startOffset;
    for (let i = 0; i < Math.min(parseInt(rows) - startRow, parseInt(cols) - startCol); i++) {
      if (board[startRow + i][startCol + i] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }

    // Check diagonally (bottom-left to top-right)
    count = 0;
    const endOffset = Math.min(row, parseInt(cols) - col - 1);
    const endRow = row - endOffset;
    const endCol = col + endOffset;
    for (let i = 0; i < Math.min(parseInt(rows) - endRow, endCol + 1); i++) {
      if (board[endRow + i][endCol - i] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }

    return false;
  };

  const resetBoard = () => {
    // Reset the board by creating a new empty board array
    setBoard(Array(parseInt(rows)).fill(null).map(() => Array(parseInt(cols)).fill(null)));

    // Switch the starting player to the opposite player
    setStartPlayer(startPlayer === 'Blue' ? 'Red' : 'Blue');

    // Set the current player to the starting player
    setPlayer(startPlayer);

    // Hide the win modal
    setShowWinModal(false);

    // Clear the winner
    setWinner('');
  };


  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      // Render each row of the board
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => (
          // Render each cell in a row
          <TouchableOpacity
            key={colIndex}
            style={styles.cell}
            onPress={() => handleCellClick(rowIndex, colIndex)}
          >
            {/* Use Animated.View for the ball and set its position */}
            <Animated.View
              style={[
                styles.ball,
                {
                  transform: [
                    {
                      translateY: ballAnimations[rowIndex][colIndex].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 50], // Adjust this value to control the drop distance
                      }),
                    },
                  ],
                },
              ]}
            >
              {cell === 'Blue' ? (
                // Render a blue ball if the cell value is 'Player 1'
                <View style={styles.blueBall} />
              ) : cell === 'Red' ? (
                // Render a red ball if the cell value is 'Player 2'
                <View style={styles.redBall} />
              ) : null}
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <ImageBackground source={require('../assets/background_image.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Render the title */}
        <Text style={styles.title}>Connect Four</Text>

        {/* Render the game board */}
        <View style={styles.board}>{renderBoard()}</View>

        {/* Display the current player's turn */}
        <Text style={styles.player}>{player === 'Blue' ? 'Blue' : 'Red'}'s turn</Text>

        {/* Render the rules modal */}
        <Modal
          visible={showRulesModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRulesModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Display the rules */}
              <Text style={styles.modalText}>
                Connect Four is a two-player connection game in which the players first choose a color and then take turns
                dropping one colored disc from the top into a suspended grid. The pieces fall straight down, occupying the next available space within the column.
                The objective of the game is to connect four of one's own discs of the same color next to each other vertically, horizontally, or diagonally before your opponent.
              </Text>

              {/* Render the "Start Game" button */}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'green' }]}
                onPress={() => setShowRulesModal(false)}
              >
                <Text style={styles.modalButtonText}>Start Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Render the win modal */}
        <Modal
          visible={showWinModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowWinModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Display the winner or "It's a Draw!" */}
              <Text style={styles.modalText}>{winner === 'Draw' ? "It's a Draw!" : `${winner} wins!`}</Text>

              {/* Render the "Play Again" button */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: winner === 'Blue' ? 'blue' : winner === 'Red' ? 'red' : 'gray' },
                ]}
                onPress={resetBoard}
              >
                <Text style={styles.modalButtonText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );

};

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
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  blueBall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'blue',
  },
  redBall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  player: {
    marginTop: 10,
    color: 'white',
    fontSize: 24,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GamePage;
