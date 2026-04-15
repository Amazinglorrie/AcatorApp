// app/(tabs)/qrcode.tsx
// Shows the user's personal QR code for friends to scan and add them.
// Uses react-native-qrcode-svg — install with:
//   npx expo install react-native-qrcode-svg react-native-svg

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Colors } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

// ─── Mock ID generator (replace with real Supabase user.id later) ───────────
function generateMockId(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash << 5) - hash + email.charCodeAt(i);
    hash |= 0;
  }
  return "USR-" + Math.abs(hash).toString(36).toUpperCase().slice(0, 8);
}

export default function QRCodeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const meta = session.user.user_metadata;
        const name = meta?.full_name || meta?.name || "";
        const email = session.user.email || "";
        const displayName = name || email.split("@")[0];

        setUserName(displayName);

        // Use real user ID from Supabase, fall back to a mock derived from email
        const id = session.user.id
          ? "USR-" + session.user.id.slice(0, 8).toUpperCase()
          : generateMockId(email);
        setUserId(id);

        const parts = displayName.trim().split(" ");
        setUserInitials(
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : displayName.slice(0, 2).toUpperCase() || "U"
        );
      }
      setLoading(false);
    })();
  }, []);

  // The data encoded in the QR code
  const qrPayload = JSON.stringify({ username: userName, id: userId });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Add me on Acator! My user ID is ${userId}`,
        title: "Add me on Acator",
      });
    } catch (e) {
      // user dismissed share sheet
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.accent} />
          <Text style={styles.backLabel}>Profile</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My QR Code</Text>
        <View style={{ width: 70 }} />
      </View>

      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator color={Colors.teal} size="large" />
        ) : (
          <>
            {/* Instruction */}
            <Text style={styles.hint}>
              Let a friend scan this to add you on Acator
            </Text>

            {/* Card */}
            <View style={styles.card}>
              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{userInitials}</Text>
                </View>
                <Text style={styles.name}>{userName}</Text>
                <Text style={styles.userId}>{userId}</Text>
              </View>

              {/* QR Code */}
              <View style={styles.qrWrap}>
                <QRCode
                  value={qrPayload || "acator://user/unknown"}
                  size={200}
                  color={Colors.textPrimary}
                  backgroundColor="#FFFFFF"
                  logo={undefined}
                />
              </View>

              {/* Decorative corner accents */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>

            {/* Share button */}
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShare}
              activeOpacity={0.75}
            >
              <Ionicons name="share-outline" size={18} color="#fff" />
              <Text style={styles.shareBtnText}>Share my ID</Text>
            </TouchableOpacity>

            <Text style={styles.footnote}>
              When you add friends, your chats will appear in Messages.
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const CORNER_SIZE = 18;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  backBtn: { flexDirection: "row", alignItems: "center", width: 70 },
  backLabel: { fontSize: 16, color: Colors.accent, marginLeft: 2 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 20,
  },

  hint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 20,
    width: "100%",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    position: "relative",
    overflow: "hidden",
  },

  avatarWrap: { alignItems: "center", gap: 6 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.badgeBg.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.badgeText.teal,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  userId: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontFamily: "monospace",
    letterSpacing: 1,
  },

  qrWrap: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.separator,
  },

  // Decorative corner brackets
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.teal,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },

  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.teal,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    width: "100%",
    justifyContent: "center",
  },
  shareBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  footnote: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
