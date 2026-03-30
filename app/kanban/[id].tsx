import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

const columns = [
  {
    id: 'col-1',
    title: 'Backlog',
    color: Colors.alert,
    tasks: [
      { id: 't1', title: 'Finalize implementation plan', tag: 'Task', member: 'CH' },
      { id: 't2', title: "Build 'Chat' page", tag: 'Task', member: 'TG' },
    ],
  },
  {
    id: 'col-2',
    title: 'In Progress',
    color: '#EF9F27',
    tasks: [
      { id: 't3', title: 'Prototype user flows', tag: 'Task', member: 'LO' },
    ],
  },
  {
    id: 'col-3',
    title: 'Review',
    color: Colors.accent,
    tasks: [
      { id: 't4', title: 'Design system update', tag: 'Task', member: 'AL' },
    ],
  },
  {
    id: 'col-4',
    title: 'Done',
    color: Colors.primary,
    tasks: [
      { id: 't5', title: 'Project kickoff meeting', tag: 'Task', member: 'MR' },
    ],
  },
];

const tabs = ['Overview', 'Kanban', 'Chat'];

export default function KanbanBoard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Kanban');

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={24} color="#ffffff" />
      </View>

      {/* Title & Status */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Phase 2 Presentation</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>In Progress</Text>
        </View>
      </View>

      {/* Scrollable Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Horizontal FlatList for Kanban Columns */}
      {activeTab === 'Kanban' && (
        <FlatList
          data={columns}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.columnsContainer}
          renderItem={({ item }) => (
            <View style={styles.column}>
              {/* Column Header */}
              <View style={[styles.columnHeader, { backgroundColor: item.color }]}>
                <Text style={styles.columnTitle}>{item.title}</Text>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#ffffff" />
              </View>

              {/* Vertical FlatList for Tasks */}
              <FlatList
                data={item.tasks}
                keyExtractor={(task) => task.id}
                scrollEnabled={false}
                renderItem={({ item: task }) => (
                  <TouchableOpacity
                    style={styles.taskCard}
                    onPress={() => router.push(`/task/${task.id}`)}
                  >
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={styles.tagRow}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{task.tag}</Text>
                      </View>
                      <View style={styles.memberCircle}>
                        <Text style={styles.memberInitial}>{task.member}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />

              {/* Add Task Button */}
              <TouchableOpacity style={styles.addTaskBtn}>
                <Ionicons name="add" size={18} color={Colors.primary} />
                <Text style={styles.addTaskText}>Add task</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Overview Tab Placeholder */}
      {activeTab === 'Overview' && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Overview coming soon</Text>
        </View>
      )}

      {/* Chat Tab Placeholder */}
      {activeTab === 'Chat' && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Chat coming soon</Text>
        </View>
      )}

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/home')}>
          <Ionicons name="home" size={22} color={Colors.primary} />
          <Text style={[styles.navLabel, { color: Colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/chat')}>
          <Ionicons name="chatbubble-outline" size={22} color={Colors.text.secondary} />
          <Text style={styles.navLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/notifications')}>
          <Ionicons name="notifications-outline" size={22} color={Colors.text.secondary} />
          <Text style={styles.navLabel}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="person-outline" size={22} color={Colors.text.secondary} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

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
  titleSection: {
    backgroundColor: Colors.sidebar,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 10,
  },
  statusPill: {
    backgroundColor: '#EF9F27',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: '#fffff',
    fontWeight: '600',
    fontSize: 12,
  },
  tabsContainer: {
    backgroundColor: Colors.background,
    maxHeight: 50,
    marginTop: 4,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.text.secondary,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: Colors.sidebar,
    borderColor: Colors.sidebar,
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  columnsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  column: {
    width: 220,
    marginRight: 16,
  },
  columnHeader: {
    padding: 12,
    borderRadius: Colors.radius.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  columnTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: Colors.radius.card,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#090000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  memberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    padding: 8,
  },
  addTaskText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.text.secondary,
    fontSize: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
  },
  navLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
});