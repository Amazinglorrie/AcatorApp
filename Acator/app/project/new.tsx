import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { Colors, PROJECT_SUBJECTS, PROJECT_COLORS } from '../../constants/theme';
import { ProjectColor } from '../../constants/types';
import { saveProject } from '../../store/storage';

export default function NewProjectScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState(PROJECT_SUBJECTS[0]);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [color, setColor] = useState<ProjectColor>('blue');

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Name required', 'Please enter a project name.'); return; }
    if (!dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Invalid date', 'Please enter a date in YYYY-MM-DD format.');
      return;
    }
    await saveProject({
      id: uuidv4(),
      name: name.trim(),
      subject,
      description: description.trim(),
      dueDate,
      status: 'not-started',
      color,
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
        <Text style={styles.topTitle}>New project</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.fieldLabel}>Project name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Chemistry lab report"
          placeholderTextColor={Colors.textTertiary}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.fieldLabel}>Subject</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
          {PROJECT_SUBJECTS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.pill, subject === s && styles.pillActive]}
              onPress={() => setSubject(s)}
            >
              <Text style={[styles.pillText, subject === s && styles.pillTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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

        <Text style={styles.fieldLabel}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="What does this project involve?"
          placeholderTextColor={Colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.fieldLabel}>Color</Text>
        <View style={styles.colorRow}>
          {PROJECT_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorDot,
                { backgroundColor: Colors[c] },
                color === c && styles.colorDotSelected,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>
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
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  pillScroll: { flexGrow: 0, marginBottom: 4 },
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: Colors.card, marginRight: 8 },
  pillActive: { backgroundColor: Colors.accent },
  pillText: { fontSize: 13, color: Colors.textSecondary },
  pillTextActive: { color: '#fff', fontWeight: '500' },
  colorRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: Colors.textPrimary },
});
