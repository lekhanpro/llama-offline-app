import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Import all screens
import SimpleTest from './screens/SimpleTest';

// DEV MODE: Set to false for production
const DEV_MODE = true;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('simple');
  const [showDevMenu, setShowDevMenu] = useState(false);

  const screens = [
    { id: 'simple', name: 'Simple Test', component: SimpleTest },
    // Add new screens here as we build them
  ];

  const CurrentScreen = screens.find(s => s.id === currentScreen)?.component || SimpleTest;

  return (
    <>
      <CurrentScreen onNext={(nextScreen) => setCurrentScreen(nextScreen)} />
      
      {DEV_MODE && (
        <>
          <TouchableOpacity 
            style={styles.devButton}
            onPress={() => setShowDevMenu(!showDevMenu)}
          >
            <Text style={styles.devButtonText}>🔧</Text>
          </TouchableOpacity>

          {showDevMenu && (
            <View style={styles.devMenu}>
              <Text style={styles.devTitle}>Dev Menu</Text>
              {screens.map(screen => (
                <TouchableOpacity
                  key={screen.id}
                  style={[
                    styles.devMenuItem,
                    currentScreen === screen.id && styles.devMenuItemActive
                  ]}
                  onPress={() => {
                    setCurrentScreen(screen.id);
                    setShowDevMenu(false);
                  }}
                >
                  <Text style={styles.devMenuText}>{screen.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}

      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  devButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff00ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  devButtonText: {
    fontSize: 24,
  },
  devMenu: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ff00ff',
    minWidth: 200,
  },
  devTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff00ff',
    marginBottom: 10,
  },
  devMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  devMenuItemActive: {
    backgroundColor: '#ff00ff33',
  },
  devMenuText: {
    fontSize: 14,
    color: '#fff',
  },
});
