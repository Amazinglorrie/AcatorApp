import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";

const logo = require("../../assets/logo.png");

// ─── Types ────────────────────────────────────────────────────────────────────
type Story = {
  id: string;
  name: string;
  avatar: string;
  hasNew: boolean;
};

type Message = {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STORIES: Story[] = [
  {
    id: "1",
    name: "Emma",
    avatar: "https://i.pravatar.cc/100?img=1",
    hasNew: true,
  },
  {
    id: "2",
    name: "Liam",
    avatar: "https://i.pravatar.cc/100?img=3",
    hasNew: false,
  },
  {
    id: "3",
    name: "Olivia",
    avatar: "https://i.pravatar.cc/100?img=5",
    hasNew: true,
  },
  {
    id: "4",
    name: "Noah",
    avatar: "https://i.pravatar.cc/100?img=7",
    hasNew: false,
  },
  {
    id: "5",
    name: "Ethan",
    avatar: "https://i.pravatar.cc/100?img=9",
    hasNew: true,
  },
  {
    id: "6",
    name: "Ava",
    avatar: "https://i.pravatar.cc/100?img=11",
    hasNew: false,
  },
];

const MESSAGES: Message[] = [
  {
    id: "1",
    name: "Andres",
    avatar: "https://i.pravatar.cc/100?img=12",
    preview: "Hey can you check this task for me?",
    time: "2m",
    unread: 1,
  },
  {
    id: "2",
    name: "Noah",
    avatar: "https://i.pravatar.cc/100?img=3",
    preview: "Message message message",
    time: "15m",
    unread: 0,
  },
  {
    id: "3",
    name: "Ethan",
    avatar: "https://i.pravatar.cc/100?img=9",
    preview: "Message message message",
    time: "1h",
    unread: 0,
  },
  {
    id: "4",
    name: "Emma",
    avatar: "https://i.pravatar.cc/100?img=1",
    preview: "Message message message",
    time: "3h",
    unread: 0,
  },
  {
    id: "5",
    name: "Olivia",
    avatar: "https://i.pravatar.cc/100?img=5",
    preview: "Message message message",
    time: "Tue",
    unread: 3,
  },
  {
    id: "6",
    name: "Michael",
    avatar: "https://i.pravatar.cc/100?img=15",
    preview: "Sounds good, see you there!",
    time: "Mon",
    unread: 0,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StoryItem({ item }: { item: Story }) {
  return (
    <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
      <View style={[styles.storyRing, item.hasNew && styles.storyRingActive]}>
        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyName}>{item.name}</Text>
    </TouchableOpacity>
  );
}

function MessageRow({ item }: { item: Message }) {
  return (
    <TouchableOpacity style={styles.msgRow} activeOpacity={0.7}>
      <View style={styles.msgAvatarWrapper}>
        <Image source={{ uri: item.avatar }} style={styles.msgAvatar} />
        {item.unread > 0 && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.msgContent}>
        <View style={styles.msgHeader}>
          <Text style={styles.msgName}>{item.name}</Text>
          <Text style={styles.msgTime}>{item.time}</Text>
        </View>
        <View style={styles.msgFooter}>
          <Text style={styles.msgPreview} numberOfLines={1}>
            {item.preview}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const [search, setSearch] = useState("");

  const filtered = MESSAGES.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Image source={logo} style={styles.headerLogo} resizeMode="contain" />
        <View style={styles.headerSide}>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={16}
          color={COLORS.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Stories */}
      <FlatList
        data={STORIES}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <StoryItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesList}
        style={styles.storiesRow}
      />

      {/* Messages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Messages</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.msgList}>
        {filtered.map((m) => (
          <MessageRow key={m.id} item={m} />
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding.lg,
    paddingVertical: 4,
    paddingBottom: 0,
    paddingTop: 16,
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerSide: {
    width: 40,
    alignItems: "flex-end",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    marginHorizontal: SIZES.padding.md,
    marginVertical: 10,
    borderRadius: SIZES.radius.full,
    paddingHorizontal: 14,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  storiesRow: {
    flexGrow: 0,
    flexShrink: 0,
    height: 90,
  },
  storiesList: {
    paddingHorizontal: SIZES.padding.md,
    paddingTop: 6,
    paddingBottom: 2,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 14,
    width: 60,
  },
  storyRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  storyRingActive: {
    borderColor: COLORS.primary,
  },
  storyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  storyName: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: SIZES.padding.md,
    paddingTop: 4,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  msgList: { flex: 1 },
  msgRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  msgAvatarWrapper: { position: "relative" },
  msgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  msgContent: {
    flex: 1,
    marginLeft: 12,
  },
  msgHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  msgName: {
    fontSize: SIZES.md,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  msgTime: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  msgFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  msgPreview: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
