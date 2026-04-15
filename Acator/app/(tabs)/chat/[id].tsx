// app/(tabs)/chat/[id].tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  mockConversations,
  MockMessage,
  MOCK_ME_ID,
} from '../../../constants/mockChatData';
import { Colors } from '../../../constants/theme';

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const convo = mockConversations.find(c => c.id === id);

  const [messages, setMessages] = useState<MockMessage[]>(
    convo ? [...convo.messages] : []
  );
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!convo) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: Colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
          Conversation not found.
        </Text>
      </SafeAreaView>
    );
  }

  const participant = convo.participant;

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMsg: MockMessage = {
      id: `msg_${Date.now()}`,
      senderId: MOCK_ME_ID,
      text,
      timestamp: new Date(),
      read: true,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate a reply after a short delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: MockMessage = {
        id: `msg_${Date.now()}_reply`,
        senderId: participant.id,
        text: getAutoReply(text),
        timestamp: new Date(),
        read: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const renderMessage = ({ item, index }: { item: MockMessage; index: number }) => {
    const isMe = item.senderId === MOCK_ME_ID;
    const prevMsg = messages[index - 1];
    const showAvatar = !isMe && (index === 0 || prevMsg?.senderId === MOCK_ME_ID);

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        {/* Placeholder to keep alignment when no avatar shown */}
        {!isMe && (
          showAvatar ? (
            <View style={[styles.miniAvatar, { backgroundColor: participant.avatarColor + '22' }]}>
              <Text style={[styles.miniAvatarText, { color: participant.avatarColor }]}>
                {participant.avatarInitials}
              </Text>
            </View>
          ) : (
            <View style={styles.miniAvatarSpacer} />
          )
        )}

        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.headerAvatar, { backgroundColor: participant.avatarColor + '22' }]}>
            <Text style={[styles.headerAvatarText, { color: participant.avatarColor }]}>
              {participant.avatarInitials}
            </Text>
          </View>
          <View>
            <Text style={styles.headerName}>{participant.name}</Text>
            <Text style={[styles.headerStatus, { color: participant.online ? Colors.success : Colors.textTertiary }]}>
              {participant.online ? '● Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Spacer to balance back button */}
        <View style={{ width: 60 }} />
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingRow}>
                <View style={[styles.miniAvatar, { backgroundColor: participant.avatarColor + '22' }]}>
                  <Text style={[styles.miniAvatarText, { color: participant.avatarColor }]}>
                    {participant.avatarInitials}
                  </Text>
                </View>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingDots}>• • •</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={Colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Simple auto-replies to make mock feel alive
function getAutoReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hey') || lower.includes('hi'))
    return 'Hey! 👋';
  if (lower.includes('thanks') || lower.includes('thank you'))
    return 'No problem at all! 😊';
  if (lower.includes('?'))
    return 'Good question — let me check and get back to you!';
  if (lower.includes('ok') || lower.includes('sure') || lower.includes('sounds good'))
    return 'Perfect! 👍';
  return 'Got it, thanks for letting me know!';
}

const BUBBLE_RADIUS = 18;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.accent,
    lineHeight: 30,
  },
  backLabel: {
    fontSize: 16,
    color: Colors.accent,
    marginLeft: 2,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerStatus: {
    fontSize: 11,
    textAlign: 'center',
  },

  // Messages
  messageList: {
    padding: 16,
    gap: 6,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowThem: {
    justifyContent: 'flex-start',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  miniAvatarText: {
    fontSize: 10,
    fontWeight: '700',
  },
  miniAvatarSpacer: {
    width: 34, // 28 avatar + 6 margin
  },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  bubbleMe: {
    backgroundColor: Colors.accent,
    borderRadius: BUBBLE_RADIUS,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.card,
    borderRadius: BUBBLE_RADIUS,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: '#fff',
  },
  bubbleTextThem: {
    color: Colors.textPrimary,
  },

  // Typing indicator
  typingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: 4,
  },
  typingBubble: {
    backgroundColor: Colors.card,
    borderRadius: BUBBLE_RADIUS,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.separator,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  typingDots: {
    color: Colors.textTertiary,
    fontSize: 14,
    letterSpacing: 2,
  },

  // Input
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 16 : 10,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    fontSize: 15,
    color: Colors.textPrimary,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  sendIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
});