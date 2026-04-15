import { Ionicons } from "@expo/vector-icons";
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
import DatePickerModal from "../../components/DatePickerModal";
import {
  Colors,
  PROJECT_COLORS,
  PROJECT_SUBJECTS,
  colorBarFill,
  theme,
} from "../../constants/theme";
import { Project, ProjectColor } from "../../constants/types";
import { formatDueDate } from "../../constants/utils";
import { getProjects, saveProject } from "../../store/storage";

const STATUS_OPTIONS: { label: string; value: Project["status"] }[] = [
  { label: "Not started", value: "not-started" },
  { label: "In progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "overdue" },
];

export default function EditProjectScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [color, setColor] = useState<ProjectColor>("teal");
  const [status, setStatus] = useState<Project["status"]>("not-started");
  const [original, setOriginal] = useState<Project | null>(null);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const load = useCallback(async () => {
    const projects = await getProjects();
    const p = projects.find((p) => p.id === id);
    if (!p) return;
    setOriginal(p);
    setName(p.name);
    setDescription(p.description);
    setSubject(p.subject);
    setColor(p.color);
    setStatus(p.status);
    setDueDate(p.dueDate);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Title required", "Please enter a project title.");
      return;
    }
    if (!original) return;
    await saveProject({
      ...original,
      name: name.trim(),
      description: description.trim(),
      subject,
      dueDate,
      color,
      status,
    });
    router.back();
  };

  if (!original) return null;

  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.textOnTeal}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Project</Text>
        <TouchableOpacity onPress={handleSave} hitSlop={10}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Project title"
          placeholderTextColor={Colors.textTertiary}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

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
          <Text style={styles.pickerBtnText}>
            {dueDate ? formatDueDate(dueDate) : "Pick a date"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Subject</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowSubjectPicker(!showSubjectPicker)}
        >
          <Text style={styles.pickerBtnText}>{subject}</Text>
          <Ionicons
            name={showSubjectPicker ? "chevron-up" : "chevron-down"}
            size={16}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
        {showSubjectPicker && (
          <View style={styles.pickerList}>
            {PROJECT_SUBJECTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.pickerItem}
                onPress={() => {
                  setSubject(s);
                  setShowSubjectPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    s === subject && styles.pickerItemTextActive,
                  ]}
                >
                  {s}
                </Text>
                {s === subject && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Status</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowStatusPicker(!showStatusPicker)}
        >
          <Text style={styles.pickerBtnText}>{statusLabel}</Text>
          <Ionicons
            name={showStatusPicker ? "chevron-up" : "chevron-down"}
            size={16}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
        {showStatusPicker && (
          <View style={styles.pickerList}>
            {STATUS_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={styles.pickerItem}
                onPress={() => {
                  setStatus(s.value);
                  setShowStatusPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    s.value === status && styles.pickerItemTextActive,
                  ]}
                >
                  {s.label}
                </Text>
                {s.value === status && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Color</Text>
        <View style={styles.colorRow}>
          {PROJECT_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorSwatch,
                { backgroundColor: colorBarFill[c] },
                c === color && styles.colorSwatchActive,
              ]}
              onPress={() => setColor(c)}
            >
              {c === color && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={theme.colors.textOnTeal}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveFullBtn} onPress={handleSave}>
          <Text style={styles.saveFullBtnText}>Save changes</Text>
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
  safe: { flex: 1, backgroundColor: theme.colors.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.textOnTeal,
  },
  saveBtn: { fontSize: 15, fontWeight: "500", color: theme.colors.textOnTeal },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    marginBottom: 14,
  },
  textarea: { minHeight: 72, paddingTop: 10 },
  pickerBtn: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
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
  pickerList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
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
  pickerItemTextActive: { color: theme.colors.primary, fontWeight: "500" },
  colorRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  colorSwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchActive: { borderWidth: 2.5, borderColor: Colors.textPrimary },
  saveFullBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveFullBtnText: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.textOnTeal,
  },
});
