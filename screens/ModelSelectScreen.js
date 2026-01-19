import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const MODELS = [
  {
    id: 'qwen',
    name: 'Qwen2 0.5B',
    subtitle: 'Lightning Fast ⚡',
    description: 'Perfect for quick responses and simple tasks. Great for casual conversations.',
    size: '~300MB',
    speed: '⚡⚡⚡',
    quality: '⭐⭐⭐',
    color: '#00ff88',
    recommended: true,
  },
  {
    id: 'tinyllama',
    name: 'TinyLlama 1.1B',
    subtitle: 'Balanced ⚖️',
    description: 'Well-rounded model with good quality and reasonable speed. Ideal for most conversations.',
    size: '~650MB',
    speed: '⚡⚡',
    quality: '⭐⭐⭐⭐',
    color: '#00ccff',
  },
  {
    id: 'phi2',
    name: 'Phi-2 2.7B',
    subtitle: 'Maximum Intelligence 🧠',
    description: 'Most capable model with superior reasoning. Best for complex questions and analysis.',
    size: '~1.6GB',
    speed: '⚡',
    quality: '⭐⭐⭐⭐⭐',
    color: '#ff00ff',
  },
];

export default function ModelSelectScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your AI</Text>
        <Text style={styles.subtitle}>Select a model to start chatting</Text>
      </View>

      <ScrollView style={styles.modelList}>
        {MODELS.map((model) => (
          <TouchableOpacity
            key={model.id}
            style={[styles.modelCard, { borderColor: model.color }]}
            activeOpacity={0.7}
          >
            {model.recommended && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>RECOMMENDED</Text>
              </View>
            )}

            <Text style={[styles.modelName, { color: model.color }]}>
              {model.name}
            </Text>
            <Text style={styles.modelSubtitle}>{model.subtitle}</Text>
            
            <Text style={styles.modelDescription}>{model.description}</Text>

            <View style={styles.stats}>
              <StatItem label="Speed" value={model.speed} />
              <StatItem label="Quality" value={model.quality} />
              <StatItem label="Size" value={model.size} />
            </View>

            <View style={[styles.selectButton, { backgroundColor: model.color }]}>
              <Text style={styles.selectButtonText}>Select Model</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function StatItem({ label, value }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  modelList: {
    flex: 1,
    padding: 20,
  },
  modelCard: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  badge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#00ff88',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  modelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modelSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  modelDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
