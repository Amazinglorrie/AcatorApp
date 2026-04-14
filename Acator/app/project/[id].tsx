import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colorBarFill, Colors } from "../../constants/theme";
import { Project, Task } from "../../constants/types";
import {
  formatDueDate,
  getProgress,
  STATUS_LABELS,
} from "../../constants/utils";
import {
  deleteProject,
  deleteTask,
  getProjects,
  getTasksForProject,
  saveTask,
  toggleTask,
} from "../../store/storage";

const STATUS_COLOR: Record<Project["status"], { bg: string; text: string }> = {
  "not-started": { bg: "#F1EFE8", text: "#444441" },
  "in-progress": { bg: Colors.badgeBg.blue, text: Colors.badgeText.blue },
  completed: { bg: Colors.badgeBg.green, text: Colors.badgeText.green },
  overdue: { bg: Colors.badgeBg.red, text: Colors.badgeText.red },
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "kanban">("overview");

  const load = useCallback(async () => {
    const projects = await getProjects();
    const found = projects.find((p) => p.id === id) ?? null;
    setProject(found);
    if (found) {
      const t = await getTasksForProject(found.id);
      setTasks(t);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleToggle = async (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleTask(taskId);
    await load();
  };

  const handleAddTask = async () => {
    const name = newTaskName.trim();
    if (!name || !project) return;
    const task: Task = {
      id: Date.now().toString(),
      projectId: project.id,
      name,
      dueDate: project.dueDate,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await saveTask(task);
    setNewTaskName("");
    await load();
  };

  const handleDeleteTask = async (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await deleteTask(taskId);
    await load();
  };

  const handleDeleteProject = () => {
    Alert.alert(
      "Delete project",
      "This will permanently delete the project and all its tasks.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteProject(id!);
            router.back();
          },
        },
      ],
    );
  };

  if (!project) return null;

  const progress = getProgress(tasks);
  const done = tasks.filter((t) => t.status === "done").length;
  const { bg, text } = STATUS_COLOR[project.status];
  const barColor = colorBarFill[project.color];

  const pending = tasks.filter((t) => t.status === "pending");
  const completed = tasks.filter((t) => t.status === "done");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {project.name}
        </Text>
        <TouchableOpacity onPress={handleDeleteProject} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.tabActive]}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.tabTextActive,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "kanban" && styles.tabActive]}
          onPress={() => setActiveTab("kanban")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "kanban" && styles.tabTextActive,
            ]}
          >
            Kanban
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "overview" ? (
          <>
            {/* Status + title */}
            <View style={styles.titleRow}>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={[styles.badge, { backgroundColor: bg }]}>
                <Text style={[styles.badgeText, { color: text }]}>
                  {STATUS_LABELS[project.status]}
                </Text>
              </View>
            </View>
            <Text style={styles.subject}>{project.subject}</Text>

            {/* Info card */}
            <View style={styles.card}>
              <Text style={styles.cardSectionLabel}>Description</Text>
              <Text style={styles.description}>
                {project.description || "No description."}
              </Text>

              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Due date</Text>
                  <Text
                    style={[styles.metaValue, { color: Colors.destructive }]}
                  >
                    {formatDueDate(project.dueDate)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Priority</Text>
                  <Text
                    style={[styles.metaValue, { color: Colors.destructive }]}
                  >
                    High
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Tasks done</Text>
                  <Text style={styles.metaValue}>
                    {done}/{tasks.length}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Progress</Text>
                  <Text style={styles.metaValue}>{progress}%</Text>
                </View>
              </View>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%`, backgroundColor: barColor },
                  ]}
                />
              </View>
            </View>

            {/* Tasks */}
            <View style={styles.card}>
              <View style={styles.taskHeader}>
                <Text style={styles.cardSectionLabel}>
                  Tasks {done}/{tasks.length}
                </Text>
              </View>

              {tasks.map((t) => (
                <View key={t.id} style={styles.taskRow}>
                  <TouchableOpacity
                    style={[
                      styles.check,
                      t.status === "done" && styles.checkDone,
                    ]}
                    onPress={() => handleToggle(t.id)}
                    hitSlop={8}
                  >
                    {t.status === "done" && (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.taskName,
                      t.status === "done" && styles.taskNameDone,
                    ]}
                    numberOfLines={1}
                  >
                    {t.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(t.id)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name="close"
                      size={16}
                      color={Colors.textTertiary}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add task input */}
              <View style={styles.addTaskRow}>
                <TextInput
                  style={styles.addTaskInput}
                  placeholder="Add a task…"
                  placeholderTextColor={Colors.textTertiary}
                  value={newTaskName}
                  onChangeText={setNewTaskName}
                  onSubmitEditing={handleAddTask}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={handleAddTask}>
                  <Ionicons name="add-circle" size={24} color={Colors.teal} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Kanban — Pending column */}
            <View style={styles.kanbanCol}>
              <View
                style={[
                  styles.kanbanHeader,
                  { backgroundColor: Colors.destructive },
                ]}
              >
                <Text style={styles.kanbanHeaderText}>Pending</Text>
                <Ionicons name="create-outline" size={16} color="#fff" />
              </View>
              {pending.length === 0 && (
                <View style={styles.kanbanCard}>
                  <Text style={styles.kanbanEmpty}>No pending tasks</Text>
                </View>
              )}
              {pending.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.kanbanCard}
                  onPress={() => handleToggle(t.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.kanbanTaskName}>{t.name}</Text>
                  <View style={styles.taskChip}>
                    <Text style={styles.taskChipText}>Task</Text>
                  </View>
                  <Text style={styles.kanbanDue}>
                    {formatDueDate(t.dueDate)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Kanban — Done column */}
            <View style={styles.kanbanCol}>
              <View
                style={[
                  styles.kanbanHeader,
                  { backgroundColor: Colors.success },
                ]}
              >
                <Text style={styles.kanbanHeaderText}>Done</Text>
              </View>
              {completed.length === 0 && (
                <View style={styles.kanbanCard}>
                  <Text style={styles.kanbanEmpty}>No completed tasks</Text>
                </View>
              )}
              {completed.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.kanbanCard}
                  onPress={() => handleToggle(t.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.kanbanTaskName, styles.kanbanTaskDone]}>
                    {t.name}
                  </Text>
                  <View
                    style={[
                      styles.taskChip,
                      { backgroundColor: Colors.badgeBg.green },
                    ]}
                  >
                    <Text
                      style={[
                        styles.taskChipText,
                        { color: Colors.badgeText.green },
                      ]}
                    >
                      Done
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.teal },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.teal,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: Colors.teal,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: "#fff",
  },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  projectName: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeText: { fontSize: 11, fontWeight: "500" },
  subject: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  metaItem: { width: "45%" },
  metaLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  metaValue: { fontSize: 13, fontWeight: "500", color: Colors.textPrimary },
  progressBg: {
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 99 },

  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#C7C7CC",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkDone: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  taskName: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  taskNameDone: {
    textDecorationLine: "line-through",
    color: Colors.textTertiary,
  },
  addTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  addTaskInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.background,
  },

  // Kanban
  kanbanCol: { marginBottom: 14 },
  kanbanHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 2,
  },
  kanbanHeaderText: { fontSize: 13, fontWeight: "500", color: "#fff" },
  kanbanCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  kanbanTaskName: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  kanbanTaskDone: {
    textDecorationLine: "line-through",
    color: Colors.textTertiary,
  },
  kanbanDue: { fontSize: 11, color: Colors.textTertiary, marginTop: 4 },
  kanbanEmpty: {
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: "center",
    paddingVertical: 4,
  },
  taskChip: {
    alignSelf: "flex-start",
    backgroundColor: Colors.badgeBg.teal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  taskChipText: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.badgeText.teal,
  },
});
