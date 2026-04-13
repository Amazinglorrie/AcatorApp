import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/theme';
import { getProjects, getTasks, seedDataIfEmpty } from '../../store/storage';

export default function ProfileScreen() {
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  const load = useCallback(async () => {
    await seedDataIfEmpty();
    const [p, t] = await Promise.all([getProjects(), getTasks()]);
    setProjectCount(p.length);
    setTaskCount(t.length);
    setDoneCount(t.filter((t) => t.status === 'done').length);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleClearData = () => {
    Alert.alert('Clear all data', 'This will delete all projects and tasks. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          await load();
        },
      },
    ]);
  };

  const completion = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.name}>Student</Text>
          <Text style={styles.sub}>StudyDesk user</Text>
        </View>

        <Text style={styles.sectionLabel}>Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statTile}>
            <Text style={styles.statVal}>{projectCount}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statVal}>{taskCount}</Text>
            <Text style={styles.statLabel}>Total tasks</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statVal}>{doneCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statVal, { color: Colors.success }]}>{completion}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>App</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuRow} onPress={handleClearData}>
            <Text style={[styles.menuText, { color: Colors.destructive }]}>Clear all data</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>StudyDesk v1.0.0 · Built with Expo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 26, fontWeight: '500', color: Colors.textPrimary, letterSpacing: -0.5, marginBottom: 20 },
  avatarWrap: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.badgeBg.blue, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 28, fontWeight: '500', color: Colors.badgeText.blue },
  name: { fontSize: 18, fontWeight: '500', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  sectionLabel: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  statTile: { flex: 1, minWidth: '45%', backgroundColor: Colors.card, borderRadius: 14, padding: 14 },
  statVal: { fontSize: 24, fontWeight: '500', color: Colors.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: 12, color: Colors.textSecondary },
  menuCard: { backgroundColor: Colors.card, borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
  menuRow: { padding: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  menuText: { fontSize: 14 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textTertiary },
});
