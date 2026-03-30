import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

export default function ProjectOverview() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock project data (will be replaced with real data later)
  const project = {
    title: "Phase 2 Presentation",
    description:
      "Design and prepare all assets for the Phase 2 stakeholder presentation, including prototypes, flows, and documentation.",
    start: "01/03/2024",
    due: "20/03/2024",
    priority: "Medium",
    members: ["Celina T", "Alan N", "Loretta O"],
    documents: 3,
    progress: 45,
  };

  const tasks = [
    { id: "1", title: "Prototype user flows", progress: 50 },
    { id: "2", title: "Dashboard UI polish", progress: 20 },
    { id: "3", title: "Settings redesign", progress: 100 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text style={styles.pageTitle}>{project.title}</Text>

      {/* Description */}
      <Text style={styles.sectionLabel}>Description</Text>
      <Text style={styles.description}>{project.description}</Text>

      {/* Dates + Priority */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
          <Text style={styles.metaText}>Start: {project.start}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="calendar" size={20} color={Colors.primary} />
          <Text style={styles.metaText}>Due: {project.due}</Text>
        </View>

        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name="flag"
            size={20}
            color={Colors.accent}
          />
          <Text style={[styles.metaText, { color: Colors.accent }]}>
            {project.priority}
          </Text>
        </View>
      </View>

      {/* Members */}
      <Text style={styles.sectionLabel}>Members</Text>
      <View style={styles.card}>
        {project.members.map((m, i) => (
          <View key={i} style={styles.memberItem}>
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.memberText}>{m}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color={Colors.text.light} />
          <Text style={styles.addButtonText}>Add member</Text>
        </TouchableOpacity>
      </View>

      {/* Documents */}
      <Text style={styles.sectionLabel}>Documents</Text>
      <View style={styles.card}>
        <View style={styles.metaItem}>
          <Ionicons name="document-text-outline" size={22} color={Colors.primary} />
          <Text style={styles.metaText}>{project.documents} documents</Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color={Colors.text.light} />
          <Text style={styles.addButtonText}>Add document</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <Text style={styles.sectionLabel}>Project Progress</Text>
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${project.progress}%` }]}
        />
      </View>
      <Text style={styles.progressText}>{project.progress}%</Text>

      {/* Task Preview */}
      <Text style={styles.sectionLabel}>Tasks</Text>

      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskCard}
          onPress={() => router.push(`/task/${task.id}`)}
        >
          <Text style={styles.taskTitle}>{task.title}</Text>

          <View style={styles.progressBarSmall}>
            <View
              style={[
                styles.progressFill,
                { width: `${task.progress}%`, height: "100%" },
              ]}
            />
          </View>

          <Text style={styles.taskProgress}>{task.progress}%</Text>
        </TouchableOpacity>
      ))}

      {/* View All Tasks */}
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={() => router.push("/project/tasks")}
      >
        <Text style={styles.viewAllText}>View all tasks</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Colors.spacing.screen,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 20,
  },

  sectionLabel: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },

  description: {
    color: Colors.text.secondary,
    lineHeight: 20,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  metaText: {
    color: Colors.text.primary,
    fontSize: 14,
  },

  card: {
    backgroundColor: Colors.text.light,
    padding: 16,
    borderRadius: Colors.radius.card,
    marginBottom: 10,
  },

  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  memberText: {
    color: Colors.text.primary,
    fontSize: 15,
  },

  addButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: Colors.radius.input,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },

  addButtonText: {
    color: Colors.text.light,
    fontWeight: "600",
  },

  progressBar: {
    height: 10,
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
    marginTop: 6,
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },

  progressText: {
    marginTop: 4,
    color: Colors.text.secondary,
  },

  taskCard: {
    backgroundColor: Colors.text.light,
    padding: 14,
    borderRadius: Colors.radius.card,
    marginBottom: 12,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },

  progressBarSmall: {
    height: 6,
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
    marginTop: 8,
  },

  taskProgress: {
    marginTop: 4,
    color: Colors.text.secondary,
    fontSize: 12,
  },

  viewAllButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: Colors.accent,
    borderRadius: Colors.radius.card,
    alignItems: "center",
  },

  viewAllText: {
    color: Colors.text.light,
    fontWeight: "700",
  },
});