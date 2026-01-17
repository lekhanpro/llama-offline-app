import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  ScrollView, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, Keyboard
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Model catalog with detailed info
const MODELS = [
  {
    id: 'qwen-0.5b',
    name: 'Qwen2 0.5B',
    subtitle: 'Lightning Fast',
    description: 'Perfect for quick responses and simple tasks. Great for casual conversations, basic questions, and everyday assistance.',
    size: '~300MB',
    speed: '⚡️⚡️⚡️',
    quality: '⭐️⭐️⭐️',
    modelId: 'Xenova/Qwen2-0.5B-Instruct',
    color: '#00ff88',
    recommended: true,
  },
  {
    id: 'tinyllama',
    name: 'TinyLlama 1.1B',
    subtitle: 'Balanced Performance',
    description: 'Well-rounded model offering good quality responses with reasonable speed. Ideal for most conversations and tasks.',
    size: '~650MB',
    speed: '⚡️⚡️',
    quality: '⭐️⭐️⭐️⭐️',
    modelId: 'Xenova/TinyLlama-1.1B-Chat-v1.0',
    color: '#00ccff',
  },
  {
    id: 'phi-2',
    name: 'Phi-2 2.7B',
    subtitle: 'Maximum Intelligence',
    description: 'Most capable model with superior reasoning and knowledge. Best for complex questions, analysis, and detailed explanations.',
    size: '~1.6GB',
    speed: '⚡️',
    quality: '⭐️⭐️⭐️⭐️⭐️',
    modelId: 'Xenova/phi-2',
    color: '#ff00ff',
  }
];

export default function App() {
  const [screen, setScreen] = useState('welcome'); // 'welcome', 'setup', 'modelSelect', 'chat'
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [pipeline, setPipeline] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  // Keyboard handling
  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const loadModel = async (modelConfig) => {
    setModelLoading(true);
    setSelectedModel(modelConfig);
    
    try {
      const { pipeline } = await import('@xenova/transformers');
      
      const generator = await pipeline(
        'text-generation',
        modelConfig.modelId,
        {
          progress_callback: (progress) => {
            console.log('Download:', progress);
          }
        }
      );
      
      setPipeline(generator);
      
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm ${modelConfig.name}, running completely offline on your device. Your conversations are private and never leave your phone. How can I help you today?`
      }]);
      
      setScreen('chat');
    } catch (error) {
      console.error('Model load error:', error);
      alert(`Setup Required\n\n${error.message}\n\nFirst launch requires internet to download the AI model (~${modelConfig.size}). After download, everything works offline.`);
      setSelectedModel(null);
    } finally {
      setModelLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || generating || !pipeline) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setGenerating(true);

    // Auto-scroll
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const conversation = messages
        .slice(-6)
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
      
      const prompt = conversation 
        ? `${conversation}\nUser: ${userMessage.content}\nAssistant:`
        : `User: ${userMessage.content}\nAssistant:`;

      const result = await pipeline(prompt, {
        max_new_tokens: 200,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.9,
        repetition_penalty: 1.2,
      });

      let response = result[0].generated_text;
      
      if (response.includes('Assistant:')) {
        response = response.split('Assistant:').pop().trim();
      }
      
      response = response.split('\n')[0].trim();
      
      const aiMessage = {
        role: 'assistant',
        content: response || "I'm processing that... Could you rephrase?"
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setGenerating(false);
    }
  };

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <SafeAreaView style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeLogo}>🤖</Text>
          <Text style={styles.welcomeTitle}>Offline AI Assistant</Text>
          <Text style={styles.welcomeSubtitle}>
            Private • Offline • Powerful
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔒</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>100% Private</Text>
                <Text style={styles.featureDescription}>
                  All conversations stay on your device
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✈️</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Works Offline</Text>
                <Text style={styles.featureDescription}>
                  No internet needed after setup
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🧠</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Multiple Models</Text>
                <Text style={styles.featureDescription}>
                  Choose the right AI for your needs
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setScreen('setup')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  // Setup Instructions Screen
  if (screen === 'setup') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.setupContainer}>
          <Text style={styles.setupTitle}>Quick Setup</Text>
          <Text style={styles.setupSubtitle}>
            Follow these steps to get started
          </Text>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Connect to Internet</Text>
              <Text style={styles.stepDescription}>
                First-time setup requires internet to download AI models. 
                Models range from 300MB to 1.6GB depending on your choice.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choose Your Model</Text>
              <Text style={styles.stepDescription}>
                Select an AI model based on your needs. Smaller models are faster 
                but less capable. Larger models are smarter but slower.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Download & Chat</Text>
              <Text style={styles.stepDescription}>
                The model will download once. After that, everything works offline.
                Your chats are private and never leave your device.
              </Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Download over Wi-Fi to avoid mobile data charges. 
              First download may take 5-15 minutes.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setScreen('modelSelect')}
          >
            <Text style={styles.primaryButtonText}>Continue to Model Selection</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setScreen('welcome')}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  // Model Selection Screen
  if (screen === 'modelSelect') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.modelSelectHeader}>
          <TouchableOpacity onPress={() => setScreen('setup')}>
            <Text style={styles.backLink}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modelSelectTitle}>Choose Your AI</Text>
          <Text style={styles.modelSelectSubtitle}>
            Select a model to start chatting
          </Text>
        </View>

        <ScrollView style={styles.modelGrid}>
          {MODELS.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelCardPro,
                { borderColor: model.color }
              ]}
              onPress={() => loadModel(model)}
              disabled={modelLoading}
              activeOpacity={0.7}
            >
              {model.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>RECOMMENDED</Text>
                </View>
              )}
              
              <Text style={[styles.modelNamePro, { color: model.color }]}>
                {model.name}
              </Text>
              <Text style={styles.modelSubtitle}>{model.subtitle}</Text>
              
              <Text style={styles.modelDescriptionPro}>
                {model.description}
              </Text>

              <View style={styles.modelStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Speed</Text>
                  <Text style={styles.statValue}>{model.speed}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Quality</Text>
                  <Text style={styles.statValue}>{model.quality}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Size</Text>
                  <Text style={styles.statValue}>{model.size}</Text>
                </View>
              </View>

              <View style={[styles.selectButton, { backgroundColor: model.color }]}>
                <Text style={styles.selectButtonText}>Select Model</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {modelLoading && (
          <View style={styles.loadingOverlayPro}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={selectedModel?.color || '#00ff00'} />
              <Text style={styles.loadingTitle}>
                Loading {selectedModel?.name}
              </Text>
              <Text style={styles.loadingDescription}>
                Downloading model files (~{selectedModel?.size})
              </Text>
              <Text style={styles.loadingHint}>
                This may take 5-15 minutes on first launch.
                Please keep the app open.
              </Text>
            </View>
          </View>
        )}

        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  // Chat Screen (Claude-style)
  return (
    <SafeAreaView style={styles.chatContainer} edges={['top']}>
      <View style={styles.chatHeader}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => {
            setScreen('modelSelect');
            setMessages([]);
            setPipeline(null);
          }}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.chatHeaderTitle}>{selectedModel?.name}</Text>
          <Text style={styles.chatHeaderSubtitle}>🔒 Private & Offline</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      >
        {messages.map((msg, idx) => (
          <View 
            key={idx} 
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.assistantBubble
            ]}
          >
            <Text style={styles.messageRole}>
              {msg.role === 'user' ? 'You' : selectedModel?.name}
            </Text>
            <Text style={styles.messageContent}>{msg.content}</Text>
          </View>
        ))}
        
        {generating && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <Text style={styles.messageRole}>{selectedModel?.name}</Text>
            <View style={styles.thinkingIndicator}>
              <ActivityIndicator size="small" color="#888" />
              <Text style={styles.thinkingText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={[
          styles.inputArea,
          keyboardHeight > 0 && { marginBottom: keyboardHeight - 20 }
        ]}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.claudeInput}
              value={input}
              onChangeText={setInput}
              placeholder="Send a message..."
              placeholderTextColor="#666"
              onSubmitEditing={sendMessage}
              editable={!generating}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity 
              style={[
                styles.sendIconButton,
                (!input.trim() || generating) && styles.sendIconButtonDisabled
              ]} 
              onPress={sendMessage}
              disabled={!input.trim() || generating}
            >
              <Text style={styles.sendIcon}>
                {generating ? '⏸' : '↑'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Welcome Screen
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  welcomeLogo: {
    fontSize: 80,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 50,
  },
  featuresList: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  featureIcon: {
    fontSize: 36,
    marginRight: 20,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },

  // Setup Screen
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  setupContainer: {
    flex: 1,
    padding: 20,
  },
  setupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  setupSubtitle: {
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

  // Model Selection
  modelSelectHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backLink: {
    fontSize: 16,
    color: '#00ff88',
    marginBottom: 15,
  },
  modelSelectTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  modelSelectSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  modelGrid: {
    flex: 1,
    padding: 20,
  },
  modelCardPro: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#00ff88',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  modelNamePro: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modelSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  modelDescriptionPro: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 20,
  },
  modelStats: {
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
    fontSize: 16,
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
  loadingOverlayPro: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.97)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingCard: {
    backgroundColor: '#1a1a1a',
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  loadingDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Chat Screen (Claude-style)
  chatContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  chatHeaderSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageBubble: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#2a4a7c',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#1a1a1a',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#333',
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  messageContent: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 24,
  },
  thinkingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thinkingText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
    fontStyle: 'italic',
  },
  inputArea: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: '#0a0a0a',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  claudeInput: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendIconButtonDisabled: {
    backgroundColor: '#333',
  },
  sendIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  // Buttons
  primaryButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
