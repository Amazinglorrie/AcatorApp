import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, theme } from "../../constants/theme";
import { formatDueDate, getDueVariant } from "../../constants/utils";
import { getProjects, getTasks } from "../../store/storage";

interface NotifItem {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
}

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotifItem[]>([]);

  const load = useCallback(async () => {
    const [projects, tasks] = await Promise.all([getProjects(), getTasks()]);
    const notifs: NotifItem[] = [];

    projects
      .filter((p) => p.status === "overdue")
      .forEach((p) => {
        notifs.push({
          id: `overdue-${p.id}`,
          icon: "alert-circle-outline",
          iconColor: Colors.destructive,
          iconBg: Colors.badgeBg.red,
          title: "Project overdue",
          body: `"${p.name}" was due ${formatDueDate(p.dueDate)}.`,
          time: formatDueDate(p.dueDate),
        });
      });

    tasks
      .filter(
        (t) => t.status === "pending" && getDueVariant(t.dueDate) === "soon",
      )
      .forEach((t) => {
        notifs.push({
          id: `soon-${t.id}`,
          icon: "time-outline",
          iconColor: Colors.warning,
          iconBg: Colors.badgeBg.amber,
          title: "Task due soon",
          body: `"${t.name}" is due ${formatDueDate(t.dueDate)}.`,
          time: formatDueDate(t.dueDate),
        });
      });

    projects
      .filter((p) => p.status === "completed")
      .forEach((p) => {
        notifs.push({
          id: `done-${p.id}`,
          icon: "checkmark-circle-outline",
          iconColor: Colors.success,
          iconBg: Colors.badgeBg.green,
          title: "Project completed",
          body: `Great work! "${p.name}" is all done.`,
          time: formatDueDate(p.dueDate),
        });
      });

    setItems(notifs);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color={Colors.textTertiary}
            />
            <Text style={styles.emptyTitle}>All clear</Text>
            <Text style={styles.emptyBody}>No notifications right now.</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowText}>{item.body}</Text>
              </View>
              <Text style={styles.rowTime}>{item.time}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: theme.colors.textOnTeal,
  },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  emptyWrap: { alignItems: "center", marginTop: 80, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "500", color: Colors.textSecondary },
  emptyBody: { fontSize: 13, color: Colors.textTertiary },
  row: {
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowBody: { flex: 1 },
  rowTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  rowText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  rowTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    flexShrink: 0,
    marginTop: 2,
  },
});
