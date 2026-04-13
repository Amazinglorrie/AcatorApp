import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { Project, Task } from '../../constants/types';
import { getProjects, getTasks, seedDataIfEmpty } from '../../store/storage';
import ProjectCard from '../../components/ProjectCard';
import TaskRow from '../../components/TaskRow';
import { toggleTask } from '../../store/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await seedDataIfEmpty();
    const [p, t] = await Promise.all([getProjects(), getTasks()]);
    setProjects(p);
    setTasks(t);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleToggle = async (id: string) => {
    await toggleTask(id);
    await load();
  };

  const activeProjects = projects.filter((p) => p.status !== 'completed');
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const overdue = projects.filter((p) => p.status === 'overdue').length;
  const dueSoon = projects.filter((p) => p.status === 'in-progress').length;

  const upcomingTasks = tasks
    .filter((t) => t.status === 'pending')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const getProjectName = (id: string) =>
    projects.find((p) => p.id === id)?.name ?? '';

  const getTasksForProject = (id: string) =>
    tasks.filter((t) => t.projectId === id);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subtitle}>{activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push('/project/new')}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Tasks done</Text>
            <Text style={styles.statValue}>
              {doneTasks}
              <Text style={styles.statSub}>/{tasks.length}</Text>
            </Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Due soon</Text>
            <Text style={[styles.statValue, { color: Colors.warning }]}>{dueSoon}</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Overdue</Text>
            <Text style={[styles.statValue, { color: Colors.destructive }]}>{overdue}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Projects</Text>
        {projects.length === 0 && (
          <Text style={styles.empty}>No projects yet. Tap + to create one.</Text>
        )}
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            tasks={getTasksForProject(p.id)}
            onPress={() => router.push(`/project/${p.id}`)}
          />
        ))}

        {upcomingTasks.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Upcoming tasks</Text>
            {upcomingTasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                projectName={getProjectName(t.projectId)}
                onToggle={handleToggle}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 26, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statTile: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
  },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '500', color: Colors.textPrimary },
  statSub: { fontSize: 14, color: Colors.textTertiary },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  empty: { fontSize: 14, color: Colors.textTertiary, textAlign: 'center', marginTop: 32 },
});
