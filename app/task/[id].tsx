import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

const TaskDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
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
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>In Progress</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Phase 2 Presentation</Text>

        {/* Description */}
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>
          Create interactive prototypes for the onboarding, dashboard, and
          settings flows. Include edge cases and error states for each screen
          transition.
        </Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>ASSIGNEE</Text>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>CT</Text>
              </View>
              <Text style={styles.metaValue}>Celina </Text>
            </View>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>DUE DATE</Text>
            <Text style={styles.metaValue}>March 16</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>PRIORITY</Text>
            <Text style={styles.priorityText}>High</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>TASK PROGRESS</Text>
            <Text style={styles.metaValue}>50%</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Subtasks */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Subtasks <Text style={styles.sectionCount}>2/4</Text></Text>
          <TouchableOpacity>
            <Text style={styles.addText}>+ Add subtask</Text>
          </TouchableOpacity>
        </View>

        {[
          { label: 'Onboarding flow wireframes', done: true },
          { label: 'Dashboard prototypes', done: false },
          { label: 'Setting flows', done: false },
          { label: 'Error states & edge cases', done: false },
        ].map((task, index) => (
          <View key={index} style={styles.subtaskRow}>
            <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
              {task.done && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={styles.subtaskText}>{task.label}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Comments */}
        <Text style={styles.sectionTitle}>Comments</Text>

        {[
          { initials: 'AN', name: 'Alan N', text: 'Looks great! Can we adjust the settings flow a bit?' },
          { initials: 'CT', name: 'Celina T', text: "No problem, I'll get right on it." },
        ].map((comment, index) => (
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
          <View style={styles.input} />
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.sidebar,
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#EF9F27',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 4,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
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
    marginVertical: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    paddingVertical: 6,
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
    fontSize: 13,
    color: Colors.text.primary,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
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
    marginTop: 8,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});