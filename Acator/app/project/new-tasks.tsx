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

export default function NewProjectTasksScreen() {
  const router = useRouter();
  const { projectJson } = useLocalSearchParams<{ projectJson: string }>();
  const project: Project = JSON.parse(projectJson ?? "{}");

  const [tasks, setTasks] = useState<{ id: string; name: string }[]>([]);
  const [newTaskName, setNewTaskName] = useState("");

  const addTask = () => {
    const name = newTaskName.trim();
    if (!name) return;
    setTasks((prev) => [...prev, { id: Date.now().toString(), name }]);
    setNewTaskName("");
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
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

    // Navigate to the new project detail page
    router.replace(`/project/${project.id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} />
        <View style={styles.headerIcon}>
          <Ionicons name="settings-outline" size={16} color="#fff" />
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

        <View style={styles.card}>
          {tasks.length === 0 && (
            <Text style={styles.emptyText}>No tasks yet. Add one below.</Text>
          )}

          {tasks.map((t, index) => (
            <View
              key={t.id}
              style={[
                styles.taskRow,
                index === tasks.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.taskCircle} />
              <Text style={styles.taskName} numberOfLines={1}>
                {t.name}
              </Text>
              <TouchableOpacity
                style={styles.editIcon}
                hitSlop={8}
                onPress={() => {
                  setNewTaskName(t.name);
                  removeTask(t.id);
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={8} onPress={() => removeTask(t.id)}>
                <Ionicons name="close" size={16} color={Colors.destructive} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add task row */}
          <View style={styles.addRow}>
            <View style={[styles.taskCircle, { borderColor: Colors.teal }]} />
            <TextInput
              style={styles.addInput}
              placeholder="Add a task…"
              placeholderTextColor={Colors.textTertiary}
              value={newTaskName}
              onChangeText={setNewTaskName}
              onSubmitEditing={addTask}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={addTask} hitSlop={8}>
              <Ionicons name="add-circle" size={22} color={Colors.teal} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Project summary */}
        {project.name ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Project</Text>
            <Text style={styles.summaryValue}>{project.name}</Text>
            {project.subject ? (
              <>
                <Text style={[styles.summaryLabel, { marginTop: 8 }]}>
                  Subject
                </Text>
                <Text style={styles.summaryValue}>{project.subject}</Text>
              </>
            ) : null}
          </View>
        ) : null}

        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishBtnText}>Finish</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
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
  headerTitle: { flex: 1 },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },

  pageTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 20,
    letterSpacing: -0.4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: "center",
    paddingVertical: 8,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  taskCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#C7C7CC",
    flexShrink: 0,
  },
  taskName: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  editIcon: { marginRight: -2 },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 10,
    marginTop: 4,
  },
  addInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },

  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },

  finishBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  finishBtnText: { fontSize: 15, fontWeight: "500", color: "#fff" },
});
