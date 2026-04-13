import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../../constants/theme';
import { Project } from '../../constants/types';
import { getProjects, saveTask } from '../../store/storage';

export default function NewTaskScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(projectId ?? '');
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');

  useFocusEffect(useCallback(() => {
    getProjects().then((p) => {
      setProjects(p);
      if (!selectedProject && p.length > 0) setSelectedProject(p[0].id);
    });
  }, []));

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Name required', 'Please enter a task name.'); return; }
    if (!selectedProject) { Alert.alert('Project required', 'Please select a project.'); return; }
    if (!dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Invalid date', 'Please enter a date in YYYY-MM-DD format.');
      return;
    }
    await saveTask({
      id: uuidv4(),
      projectId: selectedProject,
      name: name.trim(),
      dueDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>New task</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.fieldLabel}>Task name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Write introduction"
          placeholderTextColor={Colors.textTertiary}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.fieldLabel}>Project</Text>
        {projects.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.projectRow, selectedProject === p.id && styles.projectRowActive]}
            onPress={() => setSelectedProject(p.id)}
          >
            <View style={[styles.colorDot, { backgroundColor: Colors[p.color] }]} />
            <Text style={styles.projectName}>{p.name}</Text>
            {selectedProject === p.id && (
              <Ionicons name="checkmark" size={16} color={Colors.accent} />
            )}
          </TouchableOpacity>
        ))}

        <Text style={styles.fieldLabel}>Due date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-05-01"
          placeholderTextColor={Colors.textTertiary}
          value={dueDate}
          onChangeText={setDueDate}
          keyboardType="numeric"
          maxLength={10}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  topTitle: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  saveBtn: { fontSize: 15, fontWeight: '500', color: Colors.accent },
  content: { padding: 16, paddingBottom: 48 },
  fieldLabel: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: Colors.card, borderRadius: 12, padding: 12, fontSize: 15, color: Colors.textPrimary },
  projectRow: { backgroundColor: Colors.card, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  projectRowActive: { borderWidth: 1.5, borderColor: Colors.accent },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  projectName: { flex: 1, fontSize: 14, color: Colors.textPrimary },
});
