import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colorBarFill, Colors, theme } from "../constants/theme";
import { Project, Task } from "../constants/types";
import { formatDueDate, getProgress, STATUS_LABELS } from "../constants/utils";

interface Props {
  project: Project;
  tasks: Task[];
  onPress: () => void;
}

const STATUS_COLOR: Record<Project["status"], { bg: string; text: string }> = {
  "not-started": { bg: "#F1EFE8", text: "#444441" },
  "in-progress": { bg: Colors.badgeBg.blue, text: Colors.badgeText.blue },
  completed: { bg: Colors.badgeBg.green, text: Colors.badgeText.green },
  overdue: { bg: Colors.badgeBg.red, text: Colors.badgeText.red },
};

export default function ProjectCard({ project, tasks, onPress }: Props) {
  const progress = getProgress(tasks);
  const done = tasks.filter((t) => t.status === "done").length;
  const { bg, text } = STATUS_COLOR[project.status];
  const barColor = colorBarFill[project.color];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.top}>
        <Text style={styles.name} numberOfLines={1}>
          {project.name}
        </Text>
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Text style={[styles.badgeText, { color: text }]}>
            {STATUS_LABELS[project.status]}
          </Text>
        </View>
      </View>
      <Text style={styles.subject}>
        {project.subject} · Due {formatDueDate(project.dueDate)}
      </Text>
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: barColor },
          ]}
        />
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          {done}/{tasks.length} tasks
        </Text>
        <Text style={styles.metaText}>{progress}%</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 14,
    marginBottom: 10,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  subject: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  progressBg: {
    height: 3,
    backgroundColor: "#E5E5EA",
    borderRadius: 99,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
