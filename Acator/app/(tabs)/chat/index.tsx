// app/(tabs)/chat/index.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, StatusBar,} from 'react-native';
import { useRouter } from 'expo-router';
import {mockConversations,MockConversation,getLastMessage,getUnreadCount,formatTimestamp,MOCK_ME_ID,mockFriends } from '../../../constants/mockChatData';
import { Colors } from '../../../constants/theme';


export default function ChatListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = mockConversations.filter(c =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: MockConversation }) => {
    const last = getLastMessage(item);
    const unread = getUnreadCount(item);
    const isMe = last.senderId === MOCK_ME_ID;

    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => router.push(`/(tabs)/chat/${item.id}`)}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: item.participant.avatarColor + '22' }]}>
          <Text style={[styles.avatarText, { color: item.participant.avatarColor }]}>
            {item.participant.avatarInitials}
          </Text>
          {item.participant.online && <View style={styles.onlineDot} />}
        </View>

        {/* Content */}
        <View style={styles.rowContent}>
          <View style={styles.rowTop}>
            <Text style={[styles.name, unread > 0 && styles.nameBold]}>
              {item.participant.name}
            </Text>
            <Text style={styles.time}>{formatTimestamp(last.timestamp)}</Text>
          </View>
          <View style={styles.rowBottom}>
            <Text
              style={[styles.preview, unread > 0 && styles.previewBold]}
              numberOfLines={1}
            >
              {isMe ? `You: ${last.text}` : last.text}
            </Text>
            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>

        <TouchableOpacity style={styles.headerAddBtn}>
          <Text style={styles.headerAddText}>+</Text>
        </TouchableOpacity>
      </View>
      <view style={styles.topSection}>
      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

    {/* Friends Row */}
    <View style={styles.friendsContainer}>

      <FlatList
        data={mockFriends}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.friendsList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.friendItem}>
            <View style={[styles.friendAvatar, { backgroundColor: item.color + "22" }]}>
              <Text style={[styles.friendText, { color: item.color }]}>
                {item.initials}
              </Text>

              {item.online && <View style={styles.friendOnlineDot} />}
            </View>

            <Text style={styles.friendName} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
    </view>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.separator,
  },

  headerAddText: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: -2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.separator,
    gap: 8,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  separator: {
    height: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  rowContent: {
    flex: 1,
    gap: 3,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  nameBold: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  preview: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  previewBold: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: Colors.textTertiary,
    fontSize: 15,
  },
  friendsContainer: {
  marginTop: 6,
  marginBottom: 10,
},

friendsList: {
  paddingHorizontal: 16,
  gap: 14,
  alignItems: "center",
},

addFriendBtn: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: Colors.card,
  borderWidth: 1,
  borderColor: Colors.separator,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 16,
},

addFriendText: {
  fontSize: 24,
  fontWeight: "600",
  color: Colors.textPrimary,
  marginTop: -2,
},

friendItem: {
  alignItems: "center",
  width: 60,
},

friendAvatar: {
  width: 44,
  height: 44,
  borderRadius: 22,
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
},

friendText: {
  fontSize: 14,
  fontWeight: "700",
},

friendOnlineDot: {
  position: "absolute",
  bottom: 2,
  right: 2,
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: Colors.success,
  borderWidth: 2,
  borderColor: Colors.card,
},

friendName: {
  fontSize: 11,
  marginTop: 4,
  color: Colors.textSecondary,
  textAlign: "center",
},
topSection: {
  marginBottom: 8,
},
});
