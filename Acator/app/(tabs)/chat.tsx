import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>
      <View style={styles.empty}>
        <View style={styles.iconWrap}>
          <Ionicons name="chatbubbles-outline" size={40} color={Colors.teal} />
        </View>
        <Text style={styles.emptyTitle}>No messages yet</Text>
        <Text style={styles.emptyBody}>Team chat will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: "500", color: Colors.textPrimary, letterSpacing: -0.5 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingBottom: 80 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.badgeBg.teal,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  emptyTitle: { fontSize: 17, fontWeight: "500", color: Colors.textPrimary },
  emptyBody: { fontSize: 14, color: Colors.textSecondary },
});
