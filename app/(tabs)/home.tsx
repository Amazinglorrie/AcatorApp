import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const projects = [
  {
    id: '1',
    title: 'Phase 2 Presentation',
    status: 'In Progress',
    progress: 50,
    members: ['CH', 'AL', 'TS'],
    dueDate: 'March 16',
    priority: 'High',
  },
  {
    id: '2',
    title: 'Mobile App Redesign',
    status: 'In Progress',
    progress: 30,
    members: ['MR', 'CH'],
    dueDate: 'March 20',
    priority: 'Medium',
  },
  {
    id: '3',
    title: 'Backend API Integration',
    status: 'Todo',
    progress: 10,
    members: ['TS', 'AL'],
    dueDate: 'March 25',
    priority: 'High',
  },
];

const getStatusStyle = (status: string) => ({
  backgroundColor: status === 'In Progress' ? Colors.statusInProgress : Colors.statusTodo,
  textColor: status === 'In Progress' ? Colors.white : Colors.primary,
});

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, Loretta</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={26} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/project/create')}
          >
            <Ionicons name="add-circle-outline" size={28} color={Colors.primary} />
            <Text style={styles.actionText}>New Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/kanban/1')}
          >
            <MaterialCommunityIcons name="view-kanban" size={28} color={Colors.accent} />
            <Text style={styles.actionText}>Kanban</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/project/create')}
          >
            <Ionicons name="folder-open-outline" size={28} color={Colors.sidebar} />
            <Text style={styles.actionText}>Projects</Text>
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your Projects</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Projects FlatList */}
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <TouchableOpacity
                style={styles.projectCard}
                onPress={() => router.push(`/kanban/${item.id}`)}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Text style={styles.projectTitle}>{item.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Priority & Due Date */}
                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>
                    Priority: <Text style={styles.priorityText}>{item.priority}</Text>
                  </Text>
                  <Text style={styles.metaText}>Due: {item.dueDate}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                </View>
                <Text style={styles.progressLabel}>{item.progress}% complete</Text>

                {/* Members */}
                <View style={styles.membersRow}>
                  {item.members.map((member, index) => (
                    <View
                      key={index}
                      style={[styles.memberAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                    >
                      <Text style={styles.memberText}>{member}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    paddingHorizontal: Colors.spacing.screen,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: Colors.radius.card,
    width: '30%',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  actionText: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.text.secondary,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.primary,
  },
  projectCard: {
    backgroundColor: Colors.white,
    borderRadius: Colors.radius.card,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Colors.radius.button,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  priorityText: {
    color: Colors.alert,
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: 10,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  memberText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.white,
  },
});