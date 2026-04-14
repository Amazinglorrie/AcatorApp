import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskRow from "../../components/TaskRow";
import { Colors } from "../../constants/theme";
import { Project, Task } from "../../constants/types";
import { getDueVariant } from "../../constants/utils";
import {
  getProjects,
  getTasks,
  seedDataIfEmpty,
  toggleTask,
} from "../../store/storage";

type Filter = "all" | "pending" | "done";

function groupTasks(tasks: Task[]) {
  const overdue: Task[] = [];
  const todayTomorrow: Task[] = [];
  const upcoming: Task[] = [];
  const done: Task[] = [];

  tasks.forEach((t) => {
    if (t.status === "done") {
      done.push(t);
      return;
    }
    const variant = getDueVariant(t.dueDate);
    if (variant === "overdue") {
      overdue.push(t);
      return;
    }
    if (variant === "soon") {
      todayTomorrow.push(t);
      return;
    }
    upcoming.push(t);
  });

  return { overdue, todayTomorrow, upcoming, done };
}

export default function TasksScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

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

  const handleToggle = async (id: string) => {
    await toggleTask(id);
    await load();
  };

  const getProjectName = (id: string) =>
    projects.find((p) => p.id === id)?.name ?? "";

  const filtered =
    filter === "pending"
      ? tasks.filter((t) => t.status === "pending")
      : filter === "done"
        ? tasks.filter((t) => t.status === "done")
        : tasks;

  const { overdue, todayTomorrow, upcoming, done } = groupTasks(filtered);
  const totalDone = tasks.filter((t) => t.status === "done").length;

  const renderSection = (label: string, items: Task[], labelColor?: string) => {
    if (items.length === 0) return null;
    return (
      <>
        <Text
          style={[styles.sectionLabel, labelColor ? { color: labelColor } : {}]}
        >
          {label}
        </Text>
        {items.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            projectName={getProjectName(t.projectId)}
            onToggle={handleToggle}
          />
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.subtitle}>
            {tasks.length} tasks · {totalDone} done
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/task/new")}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {(["all", "pending", "done"] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && (
          <Text style={styles.empty}>No tasks here yet.</Text>
        )}
        {renderSection("Overdue", overdue, Colors.destructive)}
        {renderSection("Today & tomorrow", todayTomorrow, Colors.warning)}
        {renderSection("Upcoming", upcoming)}
        {renderSection("Done", done)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: Colors.card,
  },
  filterActive: { backgroundColor: Colors.teal },
  filterText: { fontSize: 13, color: Colors.textSecondary },
  filterTextActive: { color: "#fff", fontWeight: "500" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  empty: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: "center",
    marginTop: 40,
  },
});
