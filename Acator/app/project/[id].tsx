import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  addComment,
  Comment,
  deleteProject,
  deleteTask,
  getComments,
  getProjects,
  getTasksForProject,
  saveTask,
  toggleTask,
} from "../../store/storage";

const STATUS_COLOR: Record<Project["status"], { bg: string; text: string }> = {
  "not-started": { bg: "#F1EFE8", text: "#444441" },
  "in-progress": { bg: "#FFB300", text: "#fff" },
  completed: { bg: Colors.badgeBg.green, text: Colors.badgeText.green },
  overdue: { bg: Colors.badgeBg.red, text: Colors.badgeText.red },
};

const PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const;
type Priority = (typeof PRIORITY_OPTIONS)[number];
const PRIORITY_COLOR: Record<Priority, string> = {
  Low: Colors.success,
  Medium: Colors.warning,
  High: Colors.destructive,
};

const AVATAR_COLORS = [
  { bg: "#E53935", text: "#fff" },
  { bg: "#8E24AA", text: "#fff" },
  { bg: "#1E88E5", text: "#fff" },
  { bg: Colors.teal, text: "#fff" },
  { bg: "#F4511E", text: "#fff" },
];

function avatarColor(initials: string) {
  const i =
    (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

function formatCommentTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "kanban">("overview");
  const [priority, setPriority] = useState<Priority>("High");
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const load = useCallback(async () => {
    const projects = await getProjects();
    const found = projects.find((p) => p.id === id) ?? null;
    setProject(found);
    if (found) {
      const [t, c] = await Promise.all([
        getTasksForProject(found.id),
        getComments(found.id),
      ]);
      setTasks(t);
      setComments(c);
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
    await saveTask({
      id: Date.now().toString(),
      projectId: project.id,
      name,
      dueDate: project.dueDate,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setNewTaskName("");
    await load();
  };

  const handleDeleteTask = async (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await deleteTask(taskId);
    await load();
  };

  const handleSendComment = async () => {
    const text = newComment.trim();
    if (!text || !project) return;
    await addComment({
      id: Date.now().toString(),
      projectId: project.id,
      author: "You",
      initials: "YO",
      text,
      createdAt: new Date().toISOString(),
    });
    setNewComment("");
    await load();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
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
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={() => router.push(`/project/edit?id=${project.id}`)}
          hitSlop={10}
          style={{ marginRight: 8 }}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteProject} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["overview", "kanban"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── KANBAN TAB ── horizontally scrollable, full height */}
      {activeTab === "kanban" ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.kanbanOuter}
          contentContainerStyle={styles.kanbanContent}
        >
          {/* Backlog column */}
          <View style={styles.kanbanCol}>
            <View
              style={[
                styles.kanbanColHeader,
                { backgroundColor: Colors.destructive },
              ]}
            >
              <Text style={styles.kanbanColTitle}>Backlog</Text>
              <Ionicons name="create-outline" size={16} color="#fff" />
            </View>
            {pending.length === 0 && (
              <View style={styles.kanbanCard}>
                <Text style={styles.kanbanEmpty}>No tasks</Text>
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
                <View style={styles.kanbanCardFooter}>
                  <Text style={styles.kanbanDue}>
                    {formatDueDate(t.dueDate)}
                  </Text>
                  <View
                    style={[
                      styles.kanbanAvatar,
                      { backgroundColor: Colors.teal },
                    ]}
                  >
                    <Text style={styles.kanbanAvatarText}>CH</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* In Progress column */}
          <View style={styles.kanbanCol}>
            <View
              style={[styles.kanbanColHeader, { backgroundColor: "#FFB300" }]}
            >
              <Text style={styles.kanbanColTitle}>In Progress</Text>
            </View>
            {pending.slice(0, 1).map((t) => (
              <TouchableOpacity
                key={`ip-${t.id}`}
                style={styles.kanbanCard}
                onPress={() => handleToggle(t.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.kanbanTaskName}>{t.name}</Text>
                <View style={styles.taskChip}>
                  <Text style={styles.taskChipText}>Task</Text>
                </View>
              </TouchableOpacity>
            ))}
            {pending.length === 0 && (
              <View style={styles.kanbanCard}>
                <Text style={styles.kanbanEmpty}>Nothing here</Text>
              </View>
            )}
          </View>

          {/* Done column */}
          <View style={styles.kanbanCol}>
            <View
              style={[
                styles.kanbanColHeader,
                { backgroundColor: Colors.success },
              ]}
            >
              <Text style={styles.kanbanColTitle}>Done</Text>
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
        </ScrollView>
      ) : (
        /* ── OVERVIEW TAB ── vertical scroll */
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title + status */}
            <View style={styles.titleRow}>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: bg }]}>
                <Text style={[styles.statusBadgeText, { color: text }]}>
                  {STATUS_LABELS[project.status]}
                </Text>
              </View>
            </View>
            <Text style={styles.subject}>{project.subject}</Text>

            {/* Description card */}
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardLabel}>Description</Text>
                <TouchableOpacity
                  onPress={() => router.push(`/project/edit?id=${project.id}`)}
                  hitSlop={8}
                >
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={Colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.description}>
                {project.description || "No description."}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>ASSIGNEE</Text>
                  <View style={styles.assigneeRow}>
                    <View
                      style={[
                        styles.assigneeAvatar,
                        { backgroundColor: Colors.teal },
                      ]}
                    >
                      <Text style={styles.assigneeAvatarText}>CH</Text>
                    </View>
                    <Text style={styles.assigneeName}>Cecilia H</Text>
                  </View>
                </View>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>DUE DATE:</Text>
                  <View style={styles.dueDateRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={Colors.teal}
                    />
                    <Text style={styles.dueDateText}>
                      {formatDueDate(project.dueDate)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>PRIORITY</Text>
                  <TouchableOpacity
                    onPress={() => setShowPriorityPicker(!showPriorityPicker)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: PRIORITY_COLOR[priority] },
                      ]}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                  {showPriorityPicker && (
                    <View style={styles.priorityDropdown}>
                      {PRIORITY_OPTIONS.map((p) => (
                        <TouchableOpacity
                          key={p}
                          style={styles.priorityOption}
                          onPress={() => {
                            setPriority(p);
                            setShowPriorityPicker(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.priorityOptionText,
                              { color: PRIORITY_COLOR[p] },
                            ]}
                          >
                            {p}
                          </Text>
                          {p === priority && (
                            <Ionicons
                              name="checkmark"
                              size={14}
                              color={Colors.teal}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>TASK PROGRESS (%):</Text>
                  <Text style={[styles.priorityText, { color: Colors.teal }]}>
                    {progress}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Subtasks */}
            <View style={styles.subtasksHeader}>
              <Text style={styles.subtasksTitle}>
                Subtasks{" "}
                <Text style={styles.subtasksCount}>
                  {done}/{tasks.length}
                </Text>
              </Text>
              <Text style={styles.addSubtaskText}>+ Add subtask</Text>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: barColor },
                ]}
              />
            </View>
            <View style={{ marginTop: 12 }}>
              {tasks.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.subtaskRow}
                  onPress={() => handleToggle(t.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.subtaskCheck,
                      t.status === "done" && styles.subtaskCheckDone,
                    ]}
                  >
                    {t.status === "done" && (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.subtaskName,
                      t.status === "done" && styles.subtaskNameDone,
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
                      name="reorder-three-outline"
                      size={18}
                      color={Colors.textTertiary}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              <View style={styles.addTaskRow}>
                <View style={styles.subtaskCheckEmpty} />
                <TextInput
                  style={styles.addTaskInput}
                  placeholder="Add a subtask…"
                  placeholderTextColor={Colors.textTertiary}
                  value={newTaskName}
                  onChangeText={setNewTaskName}
                  onSubmitEditing={handleAddTask}
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Comments */}
            <Text style={styles.commentsTitle}>Comments</Text>
            {comments.length > 0 && (
              <Text style={styles.commentsTime}>
                Today at {formatCommentTime(comments[0].createdAt)}
              </Text>
            )}
            {comments.map((c) => {
              const av = avatarColor(c.initials);
              return (
                <View key={c.id} style={styles.commentRow}>
                  <View
                    style={[styles.commentAvatar, { backgroundColor: av.bg }]}
                  >
                    <Text style={styles.commentAvatarText}>{c.initials}</Text>
                  </View>
                  <View style={styles.commentBody}>
                    <Text style={styles.commentAuthor}>{c.author}</Text>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                </View>
              );
            })}
            {comments.length === 0 && (
              <Text style={styles.noComments}>No comments yet.</Text>
            )}
          </ScrollView>

          {/* Comment input bar */}
          <View style={styles.commentInputBar}>
            <View
              style={[styles.commentAvatar, { backgroundColor: Colors.teal }]}
            >
              <Text style={styles.commentAvatarText}>SJ</Text>
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor={Colors.textTertiary}
              value={newComment}
              onChangeText={setNewComment}
              onSubmitEditing={handleSendComment}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSendComment}
            >
              <Ionicons name="send" size={15} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.teal },
  header: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 14,
  backgroundColor: Colors.teal,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
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
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  tabActive: { backgroundColor: Colors.teal },
  tabText: { fontSize: 13, fontWeight: "500", color: Colors.textSecondary },
  tabTextActive: { color: "#fff" },

  // Kanban
  kanbanOuter: { flex: 1, backgroundColor: "#EBF5F0" },
  kanbanContent: {
    padding: 16,
    gap: 16,
    alignItems: "flex-start",
    paddingBottom: 100,
  },
  kanbanCol: { width: 240, minHeight: 400, marginRight: 12, flexShrink: 0
  },
  kanbanColHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  kanbanColTitle: { fontSize: 15, fontWeight: "600", color: "#fff" },
kanbanCard: {
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 12,
  marginBottom: 10,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
},
  kanbanTaskName: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  kanbanTaskDone: {
    textDecorationLine: "line-through",
    color: Colors.textTertiary,
  },
  kanbanCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  kanbanDue: { fontSize: 11, color: Colors.textTertiary },
  kanbanAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  kanbanAvatarText: { fontSize: 10, fontWeight: "600", color: "#fff" },
  kanbanEmpty: {
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: "center",
    paddingVertical: 8,
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

  // Overview
  scroll: { flex: 1, backgroundColor: "#EBF5F0" },
  content: { padding: 16, paddingBottom: 24 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  projectName: {
  fontSize: 26, // was 22
  fontWeight: "800", // stronger
  letterSpacing: -0.5,
},

subject: {
  fontSize: 13,
  opacity: 0.7, // softer instead of same color weight
},
  statusBadge: { 
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99 

  },
  statusBadgeText: { fontSize: 12, fontWeight: "600" 
  },
  card: {
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 16,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
},
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  metaRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  metaCol: { flex: 1 },
  metaLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  assigneeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  assigneeAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  assigneeAvatarText: { fontSize: 10, fontWeight: "600", color: "#fff" },
  assigneeName: { fontSize: 13, fontWeight: "500", color: Colors.textPrimary },
  dueDateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dueDateText: { fontSize: 13, fontWeight: "500", color: Colors.teal },
  priorityText: { fontSize: 13, fontWeight: "600" },
  priorityDropdown: {
    position: "absolute",
    top: 24,
    left: 0,
    zIndex: 99,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    width: 110,
    overflow: "hidden",
  },
  priorityOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  priorityOptionText: { fontSize: 13, fontWeight: "500" },
  subtasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subtasksTitle: { fontSize: 15, fontWeight: "600", color: Colors.textPrimary },
  subtasksCount: { color: Colors.textTertiary, fontWeight: "400" },
  addSubtaskText: { fontSize: 13, color: Colors.teal, fontWeight: "500" },
progressBg: {
  height: 8, // was 6
  backgroundColor: "#D0EAE0",
  borderRadius: 99,
  overflow: "hidden",
},

progressFill: {
  height: "100%",
  borderRadius: 99,
},
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  subtaskCheck: {
    width: 22,
    height: 22,
    borderRadius: 11, // circle instead of square
    borderWidth: 2,
    borderColor: "#C7C7CC",
    alignItems: "center",
    justifyContent: "center",
  },

  subtaskCheckDone: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  subtaskCheckEmpty: { width: 20, height: 20, flexShrink: 0 },
  subtaskName: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  subtaskNameDone: {
    textDecorationLine: "line-through",
    color: Colors.textTertiary,
  },
  addTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  addTaskInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  commentsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  commentsTime: { fontSize: 11, color: Colors.textTertiary, marginBottom: 12 },
  commentRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  commentAvatarText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  commentBody: {
  flex: 1,
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 12,

  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
},
  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  commentText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  noComments: { fontSize: 13, color: Colors.textTertiary, paddingVertical: 8 },
  commentInputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.separator,
  },
  commentInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: Colors.separator,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
});