import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { Project, Task } from "../../constants/types";
import { getProjects, getTasks } from "../../store/storage";

// ── Local-only richer types ───────────────────────────────────────────────────

interface Subtask {
  id: string;
  name: string;
  done: boolean;
}

interface Comment {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  text: string;
  time: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<string, string> = {
  High: Colors.red,
  Medium: Colors.warning,
  Low: Colors.success,
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "In Progress": { bg: "#E6F4EA", text: Colors.teal },
  Pending: { bg: "#FFF3E0", text: Colors.amber },
  Done: { bg: "#E8F5E9", text: Colors.green },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [commentText, setCommentText] = useState("");

  // Rich UI state (local only — extend storage later as needed)
  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: "s1", name: "Onboarding flow wireframes", done: true },
    { id: "s2", name: "Dashboard prototypes", done: false },
    { id: "s3", name: "Setting flows", done: false },
    { id: "s4", name: "Error states & edge cases", done: false },
  ]);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "Andres Lagos",
      initials: "AL",
      avatarColor: Colors.purple,
      text: "Looks great! Can we adjust the settings flow a bit?",
      time: "Today at 1:34PM",
    },
    {
      id: "c2",
      author: "Cecilia H.",
      initials: "CH",
      avatarColor: Colors.teal,
      text: "No problem, I'll get right on it.",
      time: "",
    },
  ]);

  const priority = "High";
  const assigneeName = "Cecilia H";
  const assigneeInitials = "CH";
  const statusLabel = "In Progress";
  const progressPercent = 58;

  const doneSubtasks = subtasks.filter((s) => s.done).length;

  useEffect(() => {
    (async () => {
      const tasks = await getTasks();
      const found = tasks.find((t) => t.id === id) ?? null;
      setTask(found);
      if (found) {
        const projects = await getProjects();
        setProject(projects.find((p) => p.id === found.projectId) ?? null);
      }
    })();
  }, [id]);

  function toggleSubtask(sid: string) {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === sid ? { ...s, done: !s.done } : s)),
    );
  }

  function sendComment() {
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "You",
        initials: "YO",
        avatarColor: Colors.blue,
        text: commentText.trim(),
        time: "Just now",
      },
    ]);
    setCommentText("");
  }

  if (!task) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: Colors.textSecondary }}>Loading task…</Text>
      </View>
    );
  }

  const statusStyle = STATUS_COLORS[statusLabel] ?? STATUS_COLORS["Pending"];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.card} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {project?.name ?? "Task"}
          </Text>
          <TouchableOpacity style={styles.editBtn}>
            <Feather name="edit-2" size={18} color={Colors.card} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* ── Title + Status ── */}
          <View style={styles.titleRow}>
            <Text style={styles.taskTitle}>{task.name}</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
            >
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {statusLabel}
              </Text>
            </View>
          </View>

          {/* ── Description ── */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>
            {project?.description ?? "No description provided."}
          </Text>

          {/* ── Meta row ── */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>ASSIGNEE</Text>
              <View style={styles.assigneeRow}>
                <View style={[styles.avatar, { backgroundColor: Colors.teal }]}>
                  <Text style={styles.avatarText}>{assigneeInitials}</Text>
                </View>
                <Text style={styles.metaValue}>{assigneeName}</Text>
              </View>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>DUE DATE</Text>
              <View style={styles.dueDateRow}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={14}
                  color={Colors.red}
                />
                <Text
                  style={[
                    styles.metaValue,
                    { color: Colors.red, marginLeft: 4 },
                  ]}
                >
                  {formatDate(task.dueDate)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>PRIORITY</Text>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: PRIORITY_COLORS[priority] + "22" },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: PRIORITY_COLORS[priority] },
                  ]}
                >
                  {priority}
                </Text>
              </View>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>TASK PROGRESS (%)</Text>
              <Text style={styles.metaValue}>{progressPercent}%</Text>
            </View>
          </View>

          {/* ── Progress bar ── */}
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>

          {/* ── Subtasks ── */}
          <View style={styles.subtaskHeader}>
            <Text style={styles.sectionTitle}>
              Subtasks {doneSubtasks}/{subtasks.length}
            </Text>
            <TouchableOpacity>
              <Text style={styles.addSubtask}>+ Add subtask</Text>
            </TouchableOpacity>
          </View>

          {subtasks.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.subtaskRow}
              onPress={() => toggleSubtask(s.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, s.done && styles.checkboxDone]}>
                {s.done && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={[styles.subtaskName, s.done && styles.subtaskDone]}>
                {s.name}
              </Text>
              <Ionicons name="menu" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}

          {/* ── Comments ── */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Comments</Text>

          {comments.map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <View style={[styles.avatar, { backgroundColor: c.avatarColor }]}>
                <Text style={styles.avatarText}>{c.initials}</Text>
              </View>
              <View style={styles.commentBubble}>
                {c.time ? (
                  <Text style={styles.commentTime}>{c.time}</Text>
                ) : null}
                <Text style={styles.commentAuthor}>{c.author}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            </View>
          ))}

          {/* ── Comment input ── */}
          <View style={styles.inputRow}>
            <View style={[styles.avatar, { backgroundColor: Colors.blue }]}>
              <Text style={styles.avatarText}>YO</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add a comment…"
              placeholderTextColor={Colors.textTertiary}
              value={commentText}
              onChangeText={setCommentText}
              returnKeyType="send"
              onSubmitEditing={sendComment}
            />
            <TouchableOpacity onPress={sendComment} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color={Colors.teal} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 40 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Header
  header: {
    backgroundColor: Colors.teal,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, color: "#fff", fontSize: 16, fontWeight: "600" },
  editBtn: { padding: 4 },

  // Body
  body: { padding: 16, gap: 8 },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  taskTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 11, fontWeight: "600" },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
  },
  description: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  // Meta
  metaRow: { flexDirection: "row", gap: 16, marginTop: 12 },
  metaItem: { flex: 1, gap: 4 },
  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: { fontSize: 13, fontWeight: "500", color: Colors.textPrimary },
  assigneeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dueDateRow: { flexDirection: "row", alignItems: "center" },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  priorityText: { fontSize: 12, fontWeight: "600" },

  // Progress
  progressBar: {
    height: 6,
    backgroundColor: Colors.separator,
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.teal,
    borderRadius: 3,
  },

  // Subtasks
  subtaskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary },
  addSubtask: { fontSize: 13, color: Colors.teal, fontWeight: "500" },
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.textTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  subtaskName: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  subtaskDone: {
    textDecorationLine: "line-through",
    color: Colors.textTertiary,
  },

  // Comments
  commentRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    alignItems: "flex-start",
  },
  commentBubble: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 10,
  },
  commentTime: { fontSize: 10, color: Colors.textTertiary, marginBottom: 2 },
  commentAuthor: { fontSize: 12, fontWeight: "700", color: Colors.textPrimary },
  commentText: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  // Input
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  sendBtn: { padding: 4 },

  // Avatar
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
