import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import {
  Colors,
  PROJECT_COLORS,
  PROJECT_SUBJECTS,
  colorBarFill,
} from "../../constants/theme";
import { Project, ProjectColor } from "../../constants/types";

const PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const;
type Priority = (typeof PRIORITY_OPTIONS)[number];

const PRIORITY_COLOR: Record<Priority, string> = {
  Low: Colors.success,
  Medium: Colors.warning,
  High: Colors.destructive,
};

export default function NewProjectScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(PROJECT_SUBJECTS[0]);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [color, setColor] = useState<ProjectColor>("teal");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  // Simple date parser: accepts DD/MM/YYYY → YYYY-MM-DD
  const parseDate = (raw: string): string => {
    const parts = raw.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (d && m && y && y.length === 4)
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    // fallback: try today + 7 days
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 7);
    return fallback.toISOString().split("T")[0];
  };

  const handleNext = () => {
    if (!name.trim()) {
      Alert.alert("Title required", "Please enter a project title.");
      return;
    }
    const project: Project = {
      id: Date.now().toString(),
      name: name.trim(),
      subject,
      description: description.trim(),
      dueDate: parseDate(dueDate) || parseDate(""),
      status: "not-started",
      color,
      createdAt: new Date().toISOString(),
    };
    // Pass project via router params to step 2
    router.push({
      pathname: "/project/new-tasks",
      params: { projectJson: JSON.stringify(project) },
    });
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

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor={Colors.textTertiary}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Description"
          placeholderTextColor={Colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={styles.label}>Start date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={Colors.textTertiary}
              value={startDate}
              onChangeText={setStartDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View style={styles.dateField}>
            <Text style={styles.label}>Due date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={Colors.textTertiary}
              value={dueDate}
              onChangeText={setDueDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

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
                  <Ionicons name="checkmark" size={16} color={Colors.teal} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Priority</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowPriorityPicker(!showPriorityPicker)}
        >
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: PRIORITY_COLOR[priority] },
            ]}
          />
          <Text style={styles.pickerBtnText}>{priority}</Text>
          <Ionicons
            name={showPriorityPicker ? "chevron-up" : "chevron-down"}
            size={16}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
        {showPriorityPicker && (
          <View style={styles.pickerList}>
            {PRIORITY_OPTIONS.map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.pickerItem}
                onPress={() => {
                  setPriority(p);
                  setShowPriorityPicker(false);
                }}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: PRIORITY_COLOR[p] },
                  ]}
                />
                <Text
                  style={[
                    styles.pickerItemText,
                    p === priority && styles.pickerItemTextActive,
                  ]}
                >
                  {p}
                </Text>
                {p === priority && (
                  <Ionicons name="checkmark" size={16} color={Colors.teal} />
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
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Documents</Text>
        <TouchableOpacity style={styles.dashedBox}>
          <Ionicons name="add" size={22} color={Colors.textTertiary} />
          <Text style={styles.dashedBoxText}>Add documents</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Members</Text>
        <TouchableOpacity style={styles.dashedBox}>
          <Ionicons
            name="people-outline"
            size={22}
            color={Colors.textTertiary}
          />
          <Text style={styles.dashedBoxText}>Add members</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next</Text>
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
  textarea: { minHeight: 72, paddingTop: 10 },

  dateRow: { flexDirection: "row", gap: 10 },
  dateField: { flex: 1 },

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

  priorityDot: { width: 10, height: 10, borderRadius: 5 },

  colorRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  colorSwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchActive: {
    borderWidth: 2.5,
    borderColor: Colors.textPrimary,
  },

  dashedBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.textTertiary,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 14,
  },
  dashedBoxText: { fontSize: 13, color: Colors.textTertiary },

  nextBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  nextBtnText: { fontSize: 15, fontWeight: "500", color: "#fff" },
});
