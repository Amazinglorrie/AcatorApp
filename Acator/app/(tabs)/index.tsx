import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import ProjectCard from "../../components/ProjectCard";
import TaskRow from "../../components/TaskRow";
import { colorBarFill, Colors, theme } from "../../constants/theme";
import { Project, Task } from "../../constants/types";
import { getProgress } from "../../constants/utils";
import {
  getProjects,
  getTasks,
  seedDataIfEmpty,
  toggleTask,
} from "../../store/storage";

const RING_SIZE = 36;
const RING_STROKE = 3;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) {
  const filled = ((100 - progress) / 100) * CIRCUMFERENCE;
  return (
    <Svg
      width={RING_SIZE}
      height={RING_SIZE}
      style={{ transform: [{ rotate: "-90deg" }] }}
    >
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke="#E5E5EA"
        strokeWidth={RING_STROKE}
        fill="none"
      />
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={color}
        strokeWidth={RING_STROKE}
        fill="none"
        strokeDasharray={`${CIRCUMFERENCE}`}
        strokeDashoffset={filled}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await seedDataIfEmpty();
    const [p, t] = await Promise.all([getProjects(), getTasks()]);
    setProjects(p);
    setTasks(t);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleToggle = async (id: string) => {
    await toggleTask(id);
    await load();
  };

  const activeProjects = projects.filter((p) => p.status !== "completed");
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const overdue = projects.filter((p) => p.status === "overdue").length;
  const dueSoon = projects.filter((p) => p.status === "in-progress").length;
  const upcomingTasks = tasks
    .filter((t) => t.status === "pending")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const getProjectName = (id: string) =>
    projects.find((p) => p.id === id)?.name ?? "";
  const getTasksForProject = (id: string) =>
    tasks.filter((t) => t.projectId === id);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const ringProjects = activeProjects.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ── Teal header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>
            {activeProjects.length} active project
            {activeProjects.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/project/new")}
        >
          <Ionicons name="add" size={22} color={theme.colors.textOnTeal} />
        </TouchableOpacity>
      </View>

      {/* ── Progress ring strip ── */}
      {ringProjects.length > 0 && (
        <View style={styles.ringStrip}>
          {ringProjects.map((p) => {
            const pt = getTasksForProject(p.id);
            const prog = getProgress(pt);
            const ringColor = colorBarFill[p.color];
            return (
              <TouchableOpacity
                key={p.id}
                style={styles.ringItem}
                onPress={() => router.push(`/project/${p.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.ringWrap}>
                  <ProgressRing progress={prog} color={ringColor} />
                  <Text style={styles.ringPct}>{prog}%</Text>
                </View>
                <Text style={styles.ringLabel} numberOfLines={1}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Tasks done</Text>
            <Text style={styles.statValue}>
              {doneTasks}
              <Text style={styles.statSub}>/{tasks.length}</Text>
            </Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Due soon</Text>
            <Text style={[styles.statValue, { color: Colors.warning }]}>
              {dueSoon}
            </Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Overdue</Text>
            <Text style={[styles.statValue, { color: Colors.destructive }]}>
              {overdue}
            </Text>
          </View>
        </View>

        {/* ── Projects ── */}
        <Text style={styles.sectionLabel}>Projects</Text>
        {projects.length === 0 && (
          <Text style={styles.empty}>
            No projects yet. Tap + to create one.
          </Text>
        )}
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            tasks={getTasksForProject(p.id)}
            onPress={() => router.push(`/project/${p.id}`)}
          />
        ))}

        {/* ── Upcoming tasks ── */}
        {upcomingTasks.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Upcoming tasks</Text>
            {upcomingTasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                projectName={getProjectName(t.projectId)}
                onToggle={handleToggle}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.primary },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: theme.colors.primary,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "500",
    color: theme.colors.textOnTeal,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 13, color: theme.colors.textOnTealMuted, marginTop: 2 },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  ringStrip: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  ringItem: { alignItems: "center", gap: 5, flex: 1, maxWidth: 80 },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringPct: {
    position: "absolute",
    fontSize: 9,
    fontWeight: "500",
    color: theme.colors.textOnTeal,
  },
  ringLabel: {
    fontSize: 10,
    color: theme.colors.textOnTealMuted,
    textAlign: "center",
    maxWidth: 72,
  },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  statTile: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 12,
  },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "500", color: Colors.textPrimary },
  statSub: { fontSize: 14, color: Colors.textTertiary },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  empty: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: "center",
    marginTop: 32,
  },
});
