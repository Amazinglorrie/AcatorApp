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
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

export default function CreateProject() {
  const [priority, setPriority] = useState('Medium');

  return (
    <View style={styles.container}>
      {/* Teal Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        <Text style={styles.pageTitle}>New Project</Text>

        {/* Title */}
        <View style={styles.fieldGroup}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor={Colors.text.secondary}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Description"
            placeholderTextColor={Colors.text.secondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Start & Due Date */}
        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.fieldLabel}>Start date</Text>
            <View style={styles.dateInput}>
              <Text style={styles.datePlaceholder}>DD/MM/YYYY</Text>
              <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
            </View>
          </View>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Due date</Text>
            <View style={styles.dateInput}>
              <Text style={styles.datePlaceholder}>DD/MM/YYYY</Text>
              <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
            </View>
          </View>
        </View>

        {/* Priority */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Priority</Text>
          <View style={styles.priorityRow}>
            {['Low', 'Medium', 'High'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityPill,
                  priority === p && styles.priorityPillActive,
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === p && styles.priorityTextActive,
                ]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Documents */}
        <View style={styles.fieldGroup}>
          <Text style={styles.sectionLabel}>Documents</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="add-circle-outline" size={28} color={Colors.text.secondary} />
            <Text style={styles.uploadText}>Add documents</Text>
          </TouchableOpacity>
        </View>

        {/* Members */}
        <View style={styles.fieldGroup}>
          <Text style={styles.sectionLabel}>Members</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="add-circle-outline" size={28} color={Colors.text.secondary} />
            <Text style={styles.uploadText}>Add members</Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push('/project/tasks')}
        >
          <Text style={styles.nextText}>Next</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>

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
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    padding: Colors.spacing.screen,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: Colors.radius.input,
    padding: 12,
    fontSize: 14,
    color: Colors.text.primary,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
  },
  rowFields: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: Colors.radius.input,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  datePlaceholder: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  priorityPillActive: {
    backgroundColor: '#EF9F27',
    borderColor: '#EF9F27',
  },
  priorityText: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  priorityTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderRadius: Colors.radius.card,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  uploadText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 25,
    gap: 6,
    marginTop: 10,
    marginBottom: 40,
  },
  nextText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});