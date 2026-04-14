import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";

const logo = require("../../assets/logo.png");

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifType =
  | "deadline"
  | "message"
  | "task_done"
  | "invite"
  | "task_update"
  | "project"
  | "assigned";

type Notification = {
  id: string;
  type: NotifType;
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const NOTIFICATIONS: { section: string; data: Notification[] }[] = [
  {
    section: "Recent",
    data: [
      {
        id: "1",
        type: "deadline",
        title: "Upcoming Due date",
        subtitle: "Project Phase 2 due in 3 days",
        time: "5m",
        read: false,
      },
      {
        id: "2",
        type: "message",
        title: "New Message",
        subtitle: "Andres: Hey can you check...",
        time: "12m",
        read: false,
      },
    ],
  },
  {
    section: "Yesterday",
    data: [
      {
        id: "3",
        type: "task_done",
        title: "Task 'Build home page' has been updated",
        subtitle: "Build home page' task has been completed by Developer",
        time: "1d",
        read: true,
      },
      {
        id: "4",
        type: "invite",
        title: "You have been invited to join a project",
        subtitle: "Julia has invited you to join a project",
        time: "1d",
        read: true,
      },
      {
        id: "5",
        type: "task_update",
        title: "Task 'App planning' has been updated",
        subtitle: "Abigail has added a new subtask",
        time: "1d",
        read: true,
      },
      {
        id: "6",
        type: "task_done",
        title: "Task 'New dashboard' has been updated",
        subtitle: "'New dashboard' has been completed",
        time: "1d",
        read: true,
      },
    ],
  },
  {
    section: "Previous",
    data: [
      {
        id: "7",
        type: "project",
        title: "Project 2 has been completed",
        subtitle: "'Project 2' is ready to be submitted",
        time: "2d",
        read: true,
      },
      {
        id: "8",
        type: "assigned",
        title: "You have been assigned a task",
        subtitle: "Destiny has assigned you a new task",
        time: "3d",
        read: true,
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getNotifIcon(type: NotifType): {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
} {
  switch (type) {
    case "deadline":
      return { name: "calendar", color: "#ef4444", bg: "#fee2e2" };
    case "message":
      return { name: "chatbubble", color: "#f97316", bg: "#ffedd5" };
    case "task_done":
      return { name: "checkmark-circle", color: "#10b981", bg: "#d1fae5" };
    case "invite":
      return { name: "person-add", color: "#3b82f6", bg: "#dbeafe" };
    case "task_update":
      return { name: "create", color: "#8b5cf6", bg: "#ede9fe" };
    case "project":
      return { name: "folder", color: "#10b981", bg: "#d1fae5" };
    case "assigned":
      return { name: "clipboard", color: "#8b5cf6", bg: "#ede9fe" };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function NotifItem({ item }: { item: Notification }) {
  const icon = getNotifIcon(item.type);
  return (
    <TouchableOpacity
      style={[styles.notifRow, !item.read && styles.notifRowUnread]}
      activeOpacity={0.7}
    >
      <View style={[styles.notifIconBox, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={18} color={icon.color} />
      </View>
      <View style={styles.notifContent}>
        <Text
          style={[styles.notifTitle, !item.read && styles.notifTitleBold]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.notifSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
      <Text style={styles.notifTime}>{item.time}</Text>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Image source={logo} style={styles.headerLogo} resizeMode="contain" />
        <View style={styles.headerSide} />
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

      {/* Notification list */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {NOTIFICATIONS.map((group) => (
          <View key={group.section}>
            <Text style={styles.groupLabel}>{group.section}</Text>
            {group.data
              .filter(
                (n) =>
                  !search ||
                  n.title.toLowerCase().includes(search.toLowerCase()) ||
                  n.subtitle.toLowerCase().includes(search.toLowerCase()),
              )
              .map((n) => (
                <NotifItem key={n.id} item={n} />
              ))}
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
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
    paddingTop: 16,
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerSide: {
    width: 40,
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
  list: { flex: 1 },
  groupLabel: {
    fontSize: SIZES.md,
    fontWeight: "700",
    color: COLORS.textPrimary,
    paddingHorizontal: SIZES.padding.md,
    paddingTop: 14,
    paddingBottom: 6,
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notifRowUnread: {
    backgroundColor: COLORS.primaryLight,
  },
  notifIconBox: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
    marginRight: 8,
  },
  notifTitle: {
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  notifTitleBold: {
    fontWeight: "600",
  },
  notifSubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  notifTime: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginRight: 4,
    flexShrink: 0,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
