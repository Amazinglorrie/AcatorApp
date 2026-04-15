import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, theme } from "../constants/theme";
import { Task } from "../constants/types";
import { formatDueDate, getDueVariant } from "../constants/utils";

interface Props {
  task: Task;
  projectName?: string;
  onToggle: (id: string) => void;
  onPress?: (task: Task) => void;
}

const DUE_COLORS: Record<string, string> = {
  overdue: Colors.destructive,
  soon: Colors.warning,
  ok: Colors.textTertiary,
  done: Colors.textTertiary,
};

export default function TaskRow({
  task,
  projectName,
  onToggle,
  onPress,
}: Props) {
  const variant = getDueVariant(task.dueDate, task.status === "done");
  const dueColor = DUE_COLORS[variant];
  const isDone = task.status === "done";

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(task.id);
  };

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress?.(task)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[styles.check, isDone && styles.checkDone]}
        onPress={handleToggle}
        hitSlop={10}
      >
        {isDone && (
          <View style={styles.checkmark}>
            <View style={styles.checkmarkInner} />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.info}>
        <Text
          style={[styles.name, isDone && styles.nameDone]}
          numberOfLines={1}
        >
          {task.name}
        </Text>
        {projectName && (
          <Text style={styles.sub} numberOfLines={1}>
            {projectName}
          </Text>
        )}
      </View>
      <Text style={[styles.due, { color: dueColor }]}>
        {isDone ? "Done" : formatDueDate(task.dueDate)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card - 2,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#C7C7CC",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkmark: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkInner: {
    width: 10,
    height: 6,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: theme.colors.textOnTeal,
    transform: [{ rotate: "-45deg" }, { translateY: -1 }],
  },
  info: { flex: 1 },
  name: { fontSize: 13, color: Colors.textPrimary },
  nameDone: { textDecorationLine: "line-through", color: Colors.textTertiary },
  sub: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  due: { fontSize: 11, fontWeight: "500" },
});
