import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! This is a test app. AI will be added in phase 2.' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    const echoMessage = { 
      role: 'assistant', 
      content: `You said: "${input}". (Echo mode - AI coming soon!)` 
    };
    
    setMessages(prev => [...prev, userMessage, echoMessage]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Offline AI Chat</Text>
      <Text style={styles.subtitle}>Phase 1: Basic APK Build</Text>
      
      <ScrollView style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <View 
            key={idx} 
            style={msg.role === 'user' ? styles.userMessage : styles.aiMessage}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  chatBox: {
    flex: 1,
    paddingHorizontal: 15,
  },
  userMessage: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'flex-end',
    maxWidth: '75%',
  },
  aiMessage: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '75%',
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#0a0a0a',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 20,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#00ff00',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
  },
});
