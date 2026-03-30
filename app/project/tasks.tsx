import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const subtasks = [
  { label: 'Onboarding flow wireframes', done: true },
  { label: 'Dashboard prototypes', done: false },
  { label: 'Setting flows', done: false },
  { label: 'Error states & edge cases', done: false },
];

const comments = [
  { initials: 'AL', name: 'Andres Lagos', text: 'Looks great! Can we adjust the settings flow a bit?' },
  { initials: 'CH', name: 'Cecilia H', text: "No problem, I'll get right on it." },
];

export default function TaskPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Teal Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Title & Status */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Prototype user flows</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>In Progress</Text>
          </View>
        </View>
        <Text style={styles.projectName}>Phase 2 Presentation</Text>

        {/* Description */}
        <View style={styles.descriptionBox}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Ionicons name="pencil-outline" size={18} color={Colors.text.secondary} />
          </View>
          <Text style={styles.description}>
            Create interactive prototypes for the onboarding, dashboard, and
            settings flows. Include edge cases and error states for each screen
            transition.
          </Text>
        </View>

        {/* Meta Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>ASSIGNEE</Text>
            <View style={styles.metaValueRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>CH</Text>
              </View>
              <Text style={styles.metaValue}>Cecilia H</Text>
            </View>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>DUE DATE</Text>
            <View style={styles.metaValueRow}>
              <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
              <Text style={styles.metaValue}>March 16</Text>
            </View>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>PRIORITY</Text>
            <Text style={styles.priorityText}>High</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>TASK PROGRESS (%)</Text>
            <Text style={styles.metaValue}>50%</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Subtasks */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            Subtasks <Text style={styles.sectionCount}>2/4</Text>
          </Text>
          <TouchableOpacity>
            <Text style={styles.addText}>+ Add subtask</Text>
          </TouchableOpacity>
        </View>

        {subtasks.map((task, index) => (
          <View key={index} style={styles.subtaskRow}>
            <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
              {task.done && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={styles.subtaskText}>{task.label}</Text>
            <Ionicons name="reorder-three-outline" size={18} color={Colors.text.secondary} />
          </View>
        ))}

        <View style={styles.divider} />

        {/* Comments */}
        <Text style={styles.sectionTitle}>Comments</Text>

        {comments.map((comment, index) => (
          <View key={index} style={styles.commentRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{comment.initials}</Text>
            </View>
            <View style={styles.commentBubble}>
              <Text style={styles.commentName}>{comment.name}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          </View>
        ))}

        {/* Comment Input */}
        <View style={styles.inputRow}>
          <View style={styles.commentAvatar}>
            <Text style={styles.avatarText}>LO</Text>
          </View>
          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor={Colors.text.secondary}
            style={styles.commentInput}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  header: {
    backgroundColor: Colors.sidebar,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  body: {
    flex: 1,
    padding: Colors.spacing.screen,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  statusPill: {
    backgroundColor: '#EF9F27',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
  },
  projectName: {
    fontSize: 13,
    color: Colors.primary,
    marginBottom: 12,
  },
  descriptionBox: {
    backgroundColor: '#fff',
    borderRadius: Colors.radius.card,
    padding: 12,
    marginBottom: 14,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  description: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  metaGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    width: '45%',
  },
  metaLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.alert,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  divider: {
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    marginVertical: 14,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  sectionCount: {
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  addText: {
    fontSize: 13,
    color: Colors.primary,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  subtaskText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.primary,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 0,
    borderTopRightRadius: Colors.radius.card,
    borderBottomRightRadius: Colors.radius.card,
    borderBottomLeftRadius: Colors.radius.card,
    padding: 10,
  },
  commentName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    fontSize: 13,
    color: Colors.text.primary,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});