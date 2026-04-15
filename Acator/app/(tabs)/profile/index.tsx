import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/theme";
import { getProgress } from "../../../constants/utils";
import { supabase } from "../../../lib/supabase";
import { getProjects, getTasks, seedDataIfEmpty } from "../../../store/storage";

type RowIconName = React.ComponentProps<typeof Ionicons>["name"];

interface MenuRow {
  icon: RowIconName;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [avgProgress, setAvgProgress] = useState(0);

  const load = useCallback(async () => {
    // Load user info from Supabase session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const meta = session.user.user_metadata;
      const name = meta?.full_name || meta?.name || "";
      const email = session.user.email || "";
      setUserName(name || email.split("@")[0]);
      setUserEmail(email);
      const parts = name.trim().split(" ");
      setUserInitials(
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : name.slice(0, 2).toUpperCase() || "U",
      );
    }

    // Load stats
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

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const completion =
    taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  const menuRows: MenuRow[] = [
    { icon: "person-outline", label: "Edit profile" },
    { icon: "notifications-outline", label: "Notification preferences" },
    { icon: "color-palette-outline", label: "Appearance" },
    // ── NEW: QR code row ──────────────────────────────────────────────────────
    {
      icon: "qr-code-outline",
      label: "My QR Code",
      onPress: () => router.push("/(tabs)/profile/qrcode"),    },
    // ─────────────────────────────────────────────────────────────────────────
    { icon: "help-circle-outline", label: "Help & feedback" },
    {
      icon: "log-out-outline",
      label: "Sign out",
      onPress: handleSignOut,
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

        {/* Avatar + user info from Supabase */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials || "U"}</Text>
          </View>
          <Text style={styles.name}>{userName || "User"}</Text>
          <Text style={styles.sub}>{userEmail}</Text>
        </View>

        {/* Stats */}
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

        {/* Menu */}
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

        <Text style={styles.version}>
          Acator v1.0.0 · Built with Expo + Supabase
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 100 },
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
    backgroundColor: Colors.badgeBg.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 24, fontWeight: "500", color: Colors.badgeText.teal },
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
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
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
