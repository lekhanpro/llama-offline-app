import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function SetupScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Quick Setup</Text>
        <Text style={styles.subtitle}>Follow these steps to get started</Text>

        <StepCard 
          number={1}
          title="Connect to Internet"
          description="First-time setup requires internet to download AI models. Models range from 300MB to 1.6GB depending on your choice."
        />

        <StepCard 
          number={2}
          title="Choose Your Model"
          description="Select an AI model based on your needs. Smaller models are faster but less capable. Larger models are smarter but slower."
        />

        <StepCard 
          number={3}
          title="Download & Chat"
          description="The model will download once. After that, everything works offline. Your chats are private and never leave your device."
        />

        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Download over Wi-Fi to avoid mobile data charges. First download may take 5-15 minutes.
          </Text>
        </View>

        <Text style={styles.hint}>
          Use 🔧 dev menu to navigate
        </Text>
      </ScrollView>
    </View>
  );
}

function StepCard({ number, title, description }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#2a2200',
    padding: 15,
    borderRadius: 12,
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffcc00',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#ffcc00',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
