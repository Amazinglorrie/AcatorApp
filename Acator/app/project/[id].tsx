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
  "in-progress": { bg: Colors.badgeBg.blue, text: Colors.badgeText.blue },
  completed: { bg: Colors.badgeBg.green, text: Colors.badgeText.green },
  overdue: { bg: Colors.badgeBg.red, text: Colors.badgeText.red },
};

const PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const;
type Priority = (typeof PRIORITY_OPTIONS)[number];

const PRIORITY_STYLE: Record<Priority, { bg: string; text: string }> = {
  Low: { bg: Colors.badgeBg.green, text: Colors.badgeText.green },
  Medium: { bg: Colors.badgeBg.amber, text: Colors.badgeText.amber },
  High: { bg: Colors.badgeBg.red, text: Colors.badgeText.red },
};

const AVATAR_COLORS = [
  { bg: Colors.badgeBg.blue, text: Colors.badgeText.blue },
  { bg: Colors.badgeBg.teal, text: Colors.badgeText.teal },
  { bg: Colors.badgeBg.amber, text: Colors.badgeText.amber },
  { bg: Colors.badgeBg.purple, text: Colors.badgeText.purple },
  { bg: Colors.badgeBg.red, text: Colors.badgeText.red },
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
  const [priority, setPriority] = useState<Priority>("Medium");
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

  const handleSendComment = async () => {
    const text = newComment.trim();
    if (!text || !project) return;
    const comment: Comment = {
      id: Date.now().toString(),
      projectId: project.id,
      author: "You",
      initials: "YO",
      text,
      createdAt: new Date().toISOString(),
    };
    await addComment(comment);
    setNewComment("");
    await load();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
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
  const priorityStyle = PRIORITY_STYLE[priority];

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
        <TouchableOpacity
          onPress={() => router.push(`/project/edit?id=${project.id}`)}
          hitSlop={10}
          style={{ marginRight: 4 }}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
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

                  {/* Priority pill */}
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Priority</Text>
                    <TouchableOpacity
                      style={[
                        styles.priorityPill,
                        { backgroundColor: priorityStyle.bg },
                      ]}
                      onPress={() => setShowPriorityPicker(!showPriorityPicker)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.priorityPillText,
                          { color: priorityStyle.text },
                        ]}
                      >
                        {priority}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={12}
                        color={priorityStyle.text}
                      />
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
                            <View
                              style={[
                                styles.priorityDot,
                                { backgroundColor: PRIORITY_STYLE[p].text },
                              ]}
                            />
                            <Text style={styles.priorityOptionText}>{p}</Text>
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

              {/* Comments */}
              <View style={styles.card}>
                <Text style={styles.cardSectionLabel}>Comments</Text>
                {comments.length === 0 && (
                  <Text style={styles.noComments}>No comments yet.</Text>
                )}
                {comments.map((c) => {
                  const av = avatarColor(c.initials);
                  return (
                    <View key={c.id} style={styles.commentRow}>
                      <View
                        style={[
                          styles.commentAvatar,
                          { backgroundColor: av.bg },
                        ]}
                      >
                        <Text
                          style={[styles.commentAvatarText, { color: av.text }]}
                        >
                          {c.initials}
                        </Text>
                      </View>
                      <View style={styles.commentBubbleWrap}>
                        <Text style={styles.commentAuthor}>{c.author}</Text>
                        <View style={styles.commentBubble}>
                          <Text style={styles.commentText}>{c.text}</Text>
                        </View>
                      </View>
                      <Text style={styles.commentTime}>
                        {formatCommentTime(c.createdAt)}
                      </Text>
                    </View>
                  );
                })}
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
                    <Text
                      style={[styles.kanbanTaskName, styles.kanbanTaskDone]}
                    >
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

        {/* Comment input bar — overview only */}
        {activeTab === "overview" && (
          <View style={styles.commentInputBar}>
            <View
              style={[
                styles.commentAvatar,
                { backgroundColor: Colors.badgeBg.teal },
              ]}
            >
              <Text
                style={[
                  styles.commentAvatarText,
                  { color: Colors.badgeText.teal },
                ]}
              >
                YO
              </Text>
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment…"
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
        )}
      </KeyboardAvoidingView>
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
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "500", color: "#fff" },
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
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 24 },

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
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
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
    marginBottom: 4,
  },
  metaValue: { fontSize: 13, fontWeight: "500", color: Colors.textPrimary },

  priorityPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  priorityPillText: { fontSize: 12, fontWeight: "500" },
  priorityDropdown: {
    position: "absolute",
    top: 30,
    left: 0,
    zIndex: 99,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    width: 130,
    overflow: "hidden",
  },
  priorityOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityOptionText: { flex: 1, fontSize: 13, color: Colors.textPrimary },

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

  noComments: { fontSize: 13, color: Colors.textTertiary, paddingVertical: 4 },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 12,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  commentAvatarText: { fontSize: 11, fontWeight: "500" },
  commentBubbleWrap: { flex: 1 },
  commentAuthor: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  commentBubble: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 8,
  },
  commentText: { fontSize: 13, color: Colors.textPrimary, lineHeight: 18 },
  commentTime: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 18,
    flexShrink: 0,
  },

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
