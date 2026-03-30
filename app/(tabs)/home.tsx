import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, Loretta</Text>
        <Ionicons
          name="notifications-outline"
          size={26}
          color={Colors.text.primary}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="add-circle-outline"
              size={28}
              color={Colors.primary}
            />
            <Text style={styles.actionText}>New Task</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons
              name="view-kanban"
              size={28}
              color={Colors.accent}
            />
            <Text style={styles.actionText}>Kanban</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="Project-outline"
              size={28}
              color={Colors.header}
            />
            <Text style={styles.actionText}>Projects</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Card */}
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Your Projects</Text>
          <Text style={styles.featureSubtitle}>
            Track progress and stay organized
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: Colors.spacing.screen,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.text.primary,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  actionButton: {
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.text.light,
    borderRadius: Colors.radius.card,
    width: "30%",
    elevation: 2,
  },

  actionText: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.text.secondary,
  },

  featureCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: Colors.radius.card,
    marginBottom: 20,
  },

  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.light,
  },

  featureSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.85,
  },
});