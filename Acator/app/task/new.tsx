import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
import DatePickerModal from "../../components/DatePickerModal";
import { Colors } from "../../constants/theme";
import { Project, Task } from "../../constants/types";
import { formatDueDate } from "../../constants/utils";
import { getProjects, saveTask } from "../../store/storage";

export default function NewTaskScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [dueDate, setDueDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  const load = useCallback(async () => {
    const p = await getProjects();
    setProjects(p);
    if (p.length > 0 && !selectedProjectId) setSelectedProjectId(p[0].id);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter a task name.");
      return;
    }
    if (!selectedProjectId) {
      Alert.alert("Project required", "Please select a project.");
      return;
    }
    const project = projects.find((p) => p.id === selectedProjectId);
    const task: Task = {
      id: Date.now().toString(),
      projectId: selectedProjectId,
      name: name.trim(),
      dueDate:
        dueDate || project?.dueDate || new Date().toISOString().split("T")[0],
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await saveTask(task);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Task</Text>
        <TouchableOpacity onPress={handleSave} hitSlop={10}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Task name</Text>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor={Colors.textTertiary}
          value={name}
          onChangeText={setName}
          autoFocus
          returnKeyType="done"
        />

        <Text style={styles.label}>Project</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowProjectPicker(!showProjectPicker)}
        >
          <View style={styles.projectDot} />
          <Text style={styles.pickerBtnText}>
            {selectedProject?.name ?? "Select a project"}
          </Text>
          <Ionicons
            name={showProjectPicker ? "chevron-up" : "chevron-down"}
            size={16}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
        {showProjectPicker && (
          <View style={styles.pickerList}>
            {projects.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedProjectId(p.id);
                  setShowProjectPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    p.id === selectedProjectId && styles.pickerItemTextActive,
                  ]}
                >
                  {p.name}
                </Text>
                <Text style={styles.pickerItemSub}>{p.subject}</Text>
                {p.id === selectedProjectId && (
                  <Ionicons name="checkmark" size={16} color={Colors.teal} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Due date</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text
            style={[
              styles.pickerBtnText,
              !dueDate && { color: Colors.textTertiary },
            ]}
          >
            {dueDate ? formatDueDate(dueDate) : "Pick a date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveFullBtn} onPress={handleSave}>
          <Text style={styles.saveFullBtnText}>Save task</Text>
        </TouchableOpacity>
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        value={dueDate || new Date().toISOString().split("T")[0]}
        onConfirm={(date) => {
          setDueDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
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
  saveBtn: { fontSize: 15, fontWeight: "500", color: "#fff" },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },

  label: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    marginBottom: 14,
  },
  pickerBtn: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: Colors.separator,
    marginBottom: 6,
    gap: 8,
  },
  pickerBtnText: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  projectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.teal,
  },
  pickerList: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    marginBottom: 14,
    overflow: "hidden",
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  pickerItemText: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  pickerItemTextActive: { color: Colors.teal, fontWeight: "500" },
  pickerItemSub: { fontSize: 11, color: Colors.textTertiary },

  saveFullBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  saveFullBtnText: { fontSize: 15, fontWeight: "500", color: "#fff" },
});
