import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";
import { getProgress } from "../../constants/utils";
import { getProjects, getTasks, seedDataIfEmpty } from "../../store/storage";

type RowIconName = React.ComponentProps<typeof Ionicons>["name"];

interface MenuRow {
  icon: RowIconName;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [avgProgress, setAvgProgress] = useState(0);

  const load = useCallback(async () => {
    await seedDataIfEmpty();
    const [p, t] = await Promise.all([getProjects(), getTasks()]);
    setProjectCount(p.length);
    setTaskCount(t.length);
    setDoneCount(t.filter((t) => t.status === "done").length);
    setOverdueCount(p.filter((p) => p.status === "overdue").length);
    setCompletedCount(p.filter((p) => p.status === "completed").length);
    setAvgProgress(
      p.length === 0
        ? 0
        : Math.round(
            p.reduce((sum, proj) => {
              const pt = t.filter((task) => task.projectId === proj.id);
              return sum + getProgress(pt);
            }, 0) / p.length,
          ),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleClearData = () => {
    Alert.alert(
      "Clear all data",
      "This will delete all projects and tasks. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            await load();
          },
        },
      ],
    );
  };

  const completion =
    taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  const menuRows: MenuRow[] = [
    { icon: "person-outline", label: "Edit profile" },
    { icon: "notifications-outline", label: "Notification preferences" },
    { icon: "color-palette-outline", label: "Appearance" },
    { icon: "help-circle-outline", label: "Help & feedback" },
    {
      icon: "trash-outline",
      label: "Clear all data",
      onPress: handleClearData,
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.name}>Student</Text>
          <Text style={styles.sub}>StudyDesk user</Text>
        </View>

        <Text style={styles.sectionLabel}>Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statTile}>
            <Text style={styles.statVal}>{projectCount}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statVal}>{taskCount}</Text>
            <Text style={styles.statLabel}>Total tasks</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statVal, { color: Colors.success }]}>
              {completion}%
            </Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statVal, { color: Colors.teal }]}>
              {completedCount}
            </Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statTile}>
            <Text
              style={[
                styles.statVal,
                {
                  color:
                    overdueCount > 0 ? Colors.destructive : Colors.textPrimary,
                },
              ]}
            >
              {overdueCount}
            </Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statVal}>{avgProgress}%</Text>
            <Text style={styles.statLabel}>Avg progress</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>App</Text>
        <View style={styles.menuCard}>
          {menuRows.map((row, i) => (
            <TouchableOpacity
              key={row.label}
              style={[
                styles.menuRow,
                i < menuRows.length - 1 && styles.menuRowBorder,
              ]}
              onPress={row.onPress}
              activeOpacity={0.6}
            >
              <View
                style={[styles.menuIcon, row.danger && styles.menuIconDanger]}
              >
                <Ionicons
                  name={row.icon}
                  size={17}
                  color={row.danger ? Colors.destructive : Colors.teal}
                />
              </View>
              <Text
                style={[styles.menuText, row.danger && styles.menuTextDanger]}
              >
                {row.label}
              </Text>
              {!row.danger && (
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textTertiary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>StudyDesk v1.0.0 · Built with Expo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 48 },
  title: {
    fontSize: 26,
    fontWeight: "500",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  avatarWrap: { alignItems: "center", marginBottom: 28 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.badgeBg.blue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 28, fontWeight: "500", color: Colors.badgeText.blue },
  name: { fontSize: 18, fontWeight: "500", color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  statTile: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
  },
  statVal: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: { fontSize: 12, color: Colors.textSecondary },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.badgeBg.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: { backgroundColor: Colors.badgeBg.red },
  menuText: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  menuTextDanger: { color: Colors.destructive },
  version: { textAlign: "center", fontSize: 12, color: Colors.textTertiary },
});
