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
import DatePickerModal from "../../components/DatePickerModal";
import {
  Colors,
  PROJECT_COLORS,
  PROJECT_SUBJECTS,
  colorBarFill,
} from "../../constants/theme";
import { Project, ProjectColor } from "../../constants/types";
import { formatDueDate } from "../../constants/utils";

const PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const;
type Priority = (typeof PRIORITY_OPTIONS)[number];

const PRIORITY_COLOR: Record<Priority, string> = {
  Low: Colors.success,
  Medium: "#FFB300",
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
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

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
      dueDate:
        dueDate ||
        (() => {
          const d = new Date();
          d.setDate(d.getDate() + 7);
          return d.toISOString().split("T")[0];
        })(),
      status: "not-started",
      color,
      createdAt: new Date().toISOString(),
    };
    router.push({
      pathname: "/project/new-tasks",
      params: { projectJson: JSON.stringify(project) },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Teal header */}
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

        {/* Card 1: Title + Description */}
        <View style={styles.card}>
          <TextInput
            style={styles.cardInput}
            placeholder="Title"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.cardDivider} />
          <TextInput
            style={[styles.cardInput, { minHeight: 60 }]}
            placeholder="Description"
            placeholderTextColor={Colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Card 2: Start date, Due date, Priority */}
        <View style={styles.card}>
          {/* Start date */}
          <TouchableOpacity
            style={styles.inlineRow}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.inlineLabel}>Start date:</Text>
            <Text
              style={[
                styles.inlineValue,
                !startDate && styles.inlinePlaceholder,
              ]}
            >
              {startDate ? formatDueDate(startDate) : "DD/MM/YYYY"}
            </Text>
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* Due date */}
          <TouchableOpacity
            style={styles.inlineRow}
            onPress={() => setShowDueDatePicker(true)}
          >
            <Text style={styles.inlineLabel}>Due date:</Text>
            <Text
              style={[styles.inlineValue, !dueDate && styles.inlinePlaceholder]}
            >
              {dueDate ? formatDueDate(dueDate) : "DD/MM/YYYY"}
            </Text>
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* Priority */}
          <View style={styles.inlineRow}>
            <Text style={styles.inlineLabel}>Priority:</Text>
            <TouchableOpacity
              style={[
                styles.priorityPill,
                { backgroundColor: PRIORITY_COLOR[priority] },
              ]}
              onPress={() => setShowPriorityPicker(!showPriorityPicker)}
              activeOpacity={0.8}
            >
              <Text style={styles.priorityPillText}>{priority}</Text>
              <Ionicons name="chevron-down" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
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
                      { backgroundColor: PRIORITY_COLOR[p] },
                    ]}
                  />
                  <Text style={styles.priorityOptionText}>{p}</Text>
                  {p === priority && (
                    <Ionicons name="checkmark" size={14} color={Colors.teal} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Color picker (subtle) */}
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
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Documents */}
        <Text style={styles.sectionLabel}>Documents</Text>
        <TouchableOpacity style={styles.dashedCard}>
          <View style={styles.dashedCircle}>
            <Ionicons name="add" size={20} color={Colors.teal} />
          </View>
          <Text style={styles.dashedText}>Add documents</Text>
        </TouchableOpacity>

        {/* Members */}
        <Text style={styles.sectionLabel}>Members</Text>
        <TouchableOpacity style={styles.dashedCard}>
          <View style={styles.dashedCircle}>
            <Ionicons name="add" size={20} color={Colors.teal} />
          </View>
          <Text style={styles.dashedText}>Add members</Text>
        </TouchableOpacity>

        {/* Next button */}
        <View style={styles.nextRow}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Next</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DatePickerModal
        visible={showStartDatePicker}
        value={startDate || new Date().toISOString().split("T")[0]}
        onConfirm={(date) => {
          setStartDate(date);
          setShowStartDatePicker(false);
        }}
        onCancel={() => setShowStartDatePicker(false)}
      />
      <DatePickerModal
        visible={showDueDatePicker}
        value={dueDate || new Date().toISOString().split("T")[0]}
        onConfirm={(date) => {
          setDueDate(date);
          setShowDueDatePicker(false);
        }}
        onCancel={() => setShowDueDatePicker(false)}
      />
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

  // White cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  cardDivider: { height: StyleSheet.hairlineWidth, backgroundColor: "#E8F0EC" },

  // Inline rows inside card
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inlineLabel: { fontSize: 14, color: Colors.textSecondary },
  inlineValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: "500" },
  inlinePlaceholder: { color: Colors.textTertiary, fontWeight: "400" },

  // Priority pill
  priorityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
  },
  priorityPillText: { fontSize: 13, fontWeight: "600", color: "#fff" },
  priorityDropdown: {
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    overflow: "hidden",
  },
  priorityOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  priorityDot: { width: 9, height: 9, borderRadius: 5 },
  priorityOptionText: { flex: 1, fontSize: 13, color: Colors.textPrimary },

  // Color row
  colorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchActive: { borderWidth: 2.5, borderColor: Colors.textPrimary },

  // Section labels + dashed cards
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  dashedCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#C5DDD5",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 16,
  },
  dashedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  dashedText: { fontSize: 13, color: Colors.textSecondary },

  // Next button
  nextRow: { alignItems: "flex-end", marginTop: 8 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.teal,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 99,
  },
  nextBtnText: { fontSize: 15, fontWeight: "600", color: "#fff" },
});
