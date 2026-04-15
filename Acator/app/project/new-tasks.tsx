import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
import { Colors } from "../../constants/theme";
import { Project, Task } from "../../constants/types";
import { saveProject, saveTask } from "../../store/storage";

interface TaskDraft {
  id: string;
  name: string;
  member: string | null;
}

export default function NewProjectTasksScreen() {
  const router = useRouter();
  const { projectJson } = useLocalSearchParams<{ projectJson: string }>();
  const project: Project = JSON.parse(projectJson ?? "{}");

  const [tasks, setTasks] = useState<TaskDraft[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  const addTask = () => {
    const name = newTaskName.trim();
    if (!name) {
      setAddingNew(false);
      return;
    }
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), name, member: null },
    ]);
    setNewTaskName("");
    setAddingNew(false);
  };

  const removeTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const removeMember = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, member: null } : t)),
    );

  const addMember = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, member: "Terry Gerson" } : t)),
    );

  const startEdit = (t: TaskDraft) => {
    setEditingId(t.id);
    setEditingName(t.name);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const name = editingName.trim();
    if (name)
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, name } : t)),
      );
    setEditingId(null);
    setEditingName("");
  };

  const handleFinish = async () => {
    if (!project.id) {
      Alert.alert("Error", "Project data is missing.");
      return;
    }
    await saveProject(project);
    for (const t of tasks) {
      const task: Task = {
        id: t.id,
        projectId: project.id,
        name: t.name,
        dueDate: project.dueDate,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await saveTask(task);
    }
    router.replace(`/project/${project.id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <View style={styles.headerIcon}>
          <Ionicons name="bookmark-outline" size={16} color="#fff" />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>New Project</Text>
        <Text style={styles.sectionLabel}>Tasks</Text>

        {/* Tasks card */}
        <View style={styles.card}>
          {tasks.map((t, index) => (
            <View key={t.id}>
              {/* Task row */}
              <View style={styles.taskRow}>
                {/* Circle checkbox */}
                <View style={styles.taskCircle} />

                {/* Name or edit input */}
                {editingId === t.id ? (
                  <TextInput
                    style={styles.taskNameInput}
                    value={editingName}
                    onChangeText={setEditingName}
                    onSubmitEditing={commitEdit}
                    onBlur={commitEdit}
                    autoFocus
                    returnKeyType="done"
                  />
                ) : (
                  <Text style={styles.taskName} numberOfLines={1}>
                    {t.name}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() => startEdit(t)}
                  hitSlop={8}
                  style={styles.taskAction}
                >
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={Colors.textTertiary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeTask(t.id)}
                  hitSlop={8}
                  style={styles.taskAction}
                >
                  <Ionicons
                    name="reorder-three-outline"
                    size={18}
                    color={Colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>

              {/* Member row */}
              {t.member ? (
                <View style={styles.memberRow}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>TG</Text>
                  </View>
                  <Text style={styles.memberName}>{t.member}</Text>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeMember(t.id)}
                  >
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Add member to task */}
              <TouchableOpacity
                style={styles.addMemberRow}
                onPress={() => addMember(t.id)}
              >
                <View style={styles.addMemberCircle}>
                  <Ionicons name="add" size={14} color={Colors.teal} />
                </View>
                <Text style={styles.addMemberText}>Add member to task</Text>
              </TouchableOpacity>

              {/* Divider between tasks */}
              {index < tasks.length - 1 && <View style={styles.taskDivider} />}
            </View>
          ))}

          {/* New task input */}
          {addingNew && (
            <View style={styles.taskRow}>
              <View style={styles.taskCircle} />
              <TextInput
                style={[styles.taskNameInput, { flex: 1 }]}
                placeholder="Task name…"
                placeholderTextColor={Colors.textTertiary}
                value={newTaskName}
                onChangeText={setNewTaskName}
                onSubmitEditing={addTask}
                onBlur={addTask}
                autoFocus
                returnKeyType="done"
              />
            </View>
          )}

          {/* Add New Task button */}
          <TouchableOpacity
            style={[
              styles.addNewTaskRow,
              tasks.length > 0 && styles.addNewTaskRowBorder,
            ]}
            onPress={() => setAddingNew(true)}
          >
            <View style={styles.addNewCircle}>
              <Ionicons name="add" size={16} color={Colors.teal} />
            </View>
            <Text style={styles.addNewTaskText}>Add New Task</Text>
          </TouchableOpacity>
        </View>

        {/* Finish button */}
        <View style={styles.finishRow}>
          <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
            <Text style={styles.finishBtnText}>Finish</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.teal },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.teal,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1, backgroundColor: "#EBF5F0" },
  content: { padding: 16, paddingBottom: 40 },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 10,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 24,
  },

  // Task row
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  taskCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    flexShrink: 0,
  },
  taskName: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  taskNameInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
    padding: 0,
  },
  taskAction: { padding: 2 },
  taskDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EEF5F1",
    marginVertical: 2,
  },

  // Member row
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 32,
    marginBottom: 6,
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF6B35",
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: { fontSize: 9, fontWeight: "700", color: "#fff" },
  memberName: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  removeBtn: {
    backgroundColor: Colors.destructive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  removeBtnText: { fontSize: 11, fontWeight: "600", color: "#fff" },

  // Add member
  addMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 32,
    marginBottom: 10,
  },
  addMemberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  addMemberText: { fontSize: 13, color: Colors.teal, fontWeight: "500" },

  // Add New Task
  addNewTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },
  addNewTaskRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EEF5F1",
  },
  addNewCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  addNewTaskText: { fontSize: 14, color: Colors.teal, fontWeight: "500" },

  // Finish button
  finishRow: { alignItems: "flex-end" },
  finishBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.teal,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 99,
  },
  finishBtnText: { fontSize: 15, fontWeight: "600", color: "#fff" },
});
