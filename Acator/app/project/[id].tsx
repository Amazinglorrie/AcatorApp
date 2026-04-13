import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, colorBarFill } from '../../constants/theme';
import { Project, Task } from '../../constants/types';
import {
  getProjects, getTasksForProject,
  deleteProject, toggleTask, deleteTask,
} from '../../store/storage';
import TaskRow from '../../components/TaskRow';
import { formatDueDate, getProgress, STATUS_LABELS } from '../../constants/utils';

const STATUS_COLOR: Record<Project['status'], { bg: string; text: string }> = {
  'not-started': { bg: '#F1EFE8', text: '#444441' },
  'in-progress': { bg: Colors.badgeBg.blue, text: Colors.badgeText.blue },
  completed: { bg: Colors.badgeBg.green, text: Colors.badgeText.green },
  overdue: { bg: Colors.badgeBg.red, text: Colors.badgeText.red },
};

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = useCallback(async () => {
    const projects = await getProjects();
    const p = projects.find((x) => x.id === id) ?? null;
    setProject(p);
    if (p) {
      const t = await getTasksForProject(p.id);
      setTasks(t);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleToggle = async (taskId: string) => {
    await toggleTask(taskId);
    await load();
  };

  const handleDeleteProject = () => {
    Alert.alert('Delete project', 'This will also delete all tasks in this project.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (project) {
            await deleteProject(project.id);
            router.back();
          }
        },
      },
    ]);
  };

  const handleDeleteTask = (taskId: string, taskName: string) => {
    Alert.alert('Delete task', `Delete "${taskName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(taskId);
          await load();
        },
      },
    ]);
  };

  if (!project) return null;

  const progress = getProgress(tasks);
  const done = tasks.filter((t) => t.status === 'done').length;
  const { bg, text } = STATUS_COLOR[project.status];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={Colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteProject} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color={Colors.destructive} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.colorBar, { backgroundColor: colorBarFill[project.color] }]} />

        <Text style={styles.name}>{project.name}</Text>
        <Text style={styles.subject}>{project.subject}</Text>

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.badgeText, { color: text }]}>{STATUS_LABELS[project.status]}</Text>
          </View>
          <Text style={styles.due}>Due {formatDueDate(project.dueDate)}</Text>
        </View>

        {project.description ? (
          <Text style={styles.desc}>{project.description}</Text>
        ) : null}

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPct}>{progress}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: colorBarFill[project.color] },
              ]}
            />
          </View>
          <Text style={styles.progressMeta}>{done} of {tasks.length} tasks complete</Text>
        </View>

        <View style={styles.taskHeader}>
          <Text style={styles.sectionLabel}>Tasks</Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/task/new', params: { projectId: project.id } })}
          >
            <Ionicons name="add-circle-outline" size={22} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {tasks.length === 0 && (
          <Text style={styles.empty}>No tasks yet. Tap + to add one.</Text>
        )}

        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            onToggle={handleToggle}
            onPress={(task) => handleDeleteTask(task.id, task.name)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  colorBar: { height: 4, borderRadius: 99, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.5, marginBottom: 4 },
  subject: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  badgeText: { fontSize: 12, fontWeight: '500' },
  due: { fontSize: 13, color: Colors.textSecondary },
  desc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  progressSection: { backgroundColor: Colors.card, borderRadius: 14, padding: 14, marginBottom: 20 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  progressPct: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  progressBg: { height: 6, backgroundColor: '#E5E5EA', borderRadius: 99, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 99 },
  progressMeta: { fontSize: 12, color: Colors.textTertiary },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionLabel: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  empty: { fontSize: 14, color: Colors.textTertiary, textAlign: 'center', marginTop: 20 },
});
