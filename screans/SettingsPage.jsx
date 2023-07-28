import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ImageBackground } from 'react-native';
import { GameContext } from '../components/GameContext';
import { Switch } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

const SettingsPage = ({ navigation }) => {
    // Access the game context to get and modify game settings
    const { rows: initialRows, cols: initialCols, setRows, setCols, isMusicEnabled, toggleMusic } = useContext(GameContext);
    const [rows, setLocalRows] = useState(initialRows.toString());
    const [cols, setLocalCols] = useState(initialCols.toString());
    const [initialMusicState, setInitialMusicState] = useState(isMusicEnabled);
    // Add a state variable to keep track of changes in settings
    const [settingsChanged, setSettingsChanged] = useState(false);

    // Update local state when game settings change
    useEffect(() => {
        setLocalRows(initialRows.toString());
        setLocalCols(initialCols.toString());
        setInitialMusicState(isMusicEnabled);
        setSettingsChanged(false); // Reset the settings change state when the component mounts
    }, [initialRows, initialCols, isMusicEnabled]);

    // Reset the local state to default settings
    const handleResetSettings = () => {
        setLocalRows('6');
        setLocalCols('7');
        setSettingsChanged(true); // Mark settings as changed
    };

    // Save the user-modified settings and navigate back to the menu page
    const handleSaveSettings = () => {
        const numRows = parseInt(rows);
        const numCols = parseInt(cols);

        if (isNaN(numRows) || isNaN(numCols) || numRows <= 0 || numCols <= 0) {
            alert('Please enter valid values for rows and columns.');
        } else if (numRows > 10 || numCols > 7) {
            alert('The maximum limit for rows is 10 and columns is 7.');
        } else {
            setRows(numRows.toString());
            setCols(numCols.toString());
            navigation.navigate('MenuPage', { numRows, numCols });
        }
    };

    // Revert the changes made by the user and go back to the previous screen
    const handleBackButton = () => {
        setLocalRows(initialRows.toString());
        setLocalCols(initialCols.toString());
        toggleMusic(initialMusicState); // Revert the music state to the initial value
        navigation.goBack();
    };

    return (
        <ImageBackground source={require('../assets/background_image.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                {/* Title of the settings page */}
                <Text style={styles.title}>Settings</Text>

                {/* Input field for rows */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Number of Rows (Max: 10)</Text>
                    <TextInput
                        style={styles.input}
                        value={rows}
                        onChangeText={setLocalRows}
                        keyboardType="numeric"
                        maxLength={2}
                    />
                </View>

                {/* Input field for columns */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Number of Columns (Max: 7)</Text>
                    <TextInput
                        style={styles.input}
                        value={cols}
                        onChangeText={setLocalCols}
                        keyboardType="numeric"
                        maxLength={2}
                    />
                </View>

                {/* Toggle switch for background music */}
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Background Music</Text>
                    <Switch value={isMusicEnabled} onValueChange={toggleMusic} />
                </View>

                {/* Reset Settings button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleResetSettings}>
                        <Text style={styles.buttonText}>Reset Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Save Settings and Back buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleSaveSettings}>
                        <Text style={styles.buttonText}>Save Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

// Styles for the SettingsPage component
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
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    inputContainer: {
        alignItems: 'center',
        marginBottom: 20, 
    },
    label: {
        fontSize: 24, 
        marginBottom: 10, 
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    input: {
        marginTop: 10, 
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontSize: 24, 
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 40, 
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
        flex: 1,
        marginLeft: 10, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        marginTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        flex: 1,
        marginRight: 10, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'blue',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 5,
        textAlign: 'center', 
        textTransform: 'uppercase',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10, 
        paddingHorizontal: 20,
    },
    switchLabel: {
        fontSize: 24,
        color: 'white',
        marginRight: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    resetButton: {
        marginTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SettingsPage;
