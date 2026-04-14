import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS, SIZES } from "../../constants/theme";

// ─── Types ────────────────────────────────────────────────────────────────────
type InfoRowProps = {
  label: string;
  value: string;
  isLink?: boolean;
  onEdit?: () => void;
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function InfoRow({ label, value, isLink, onEdit }: InfoRowProps) {
  const handlePress = () => {
    if (isLink && value.startsWith("http")) Linking.openURL(value);
    else if (isLink && value.includes("@")) Linking.openURL(`mailto:${value}`);
    else if (isLink && value.startsWith("(")) Linking.openURL(`tel:${value}`);
  };

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Text style={styles.infoLabel}>{label}</Text>
        <TouchableOpacity onPress={handlePress} disabled={!isLink}>
          <Text
            style={[styles.infoValue, isLink && styles.infoValueLink]}
            numberOfLines={1}
          >
            {value}
          </Text>
        </TouchableOpacity>
      </View>
      {onEdit && (
        <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
          <Ionicons name="create-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function AnalyticsCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.analyticsCard}>
      <Text style={styles.analyticsValue}>{value}</Text>
      <Text style={styles.analyticsLabel}>{label}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Image
          source={require("../../assets/logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => router.push("/qr-add-friend")}>
            <Ionicons name="qr-code-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <Image
            source={{ uri: "https://i.pravatar.cc/160?img=25" }}
            style={styles.avatar}
          />
          <View style={styles.heroText}>
            <Text style={styles.heroName}>Sarah Johnson</Text>
            <Text style={styles.heroRole}>Student</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Info</Text>
          </View>

          <InfoRow
            label="Primary Email"
            value="S.Johnson@email.com"
            isLink
            onEdit={() => {}}
          />
          <InfoRow label="Phone" value="(123) 456-789" isLink />
          <InfoRow label="School" value="University Institution" />
          <InfoRow
            label="School Email"
            value="S.Johnson@university.ca"
            isLink
          />
          <InfoRow
            label="LinkedIn"
            value="https://www.linkedin.com/mynetwork"
            isLink
          />
        </View>

        {/* Analytics Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Analytics</Text>
            <TouchableOpacity>
              <Ionicons
                name="create-outline"
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.analyticsGrid}>
            <AnalyticsCard label="Current Projects Open" value={4} />
            <AnalyticsCard label="Upcoming Due Submissions" value={2} />
            <AnalyticsCard label="Tasks Completed" value={18} />
            <AnalyticsCard label="Team Members" value={7} />
          </View>
        </View>

        {/* Settings Button */}
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.8}>
          <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
          <Text style={styles.settingsBtnText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding.lg,
    paddingVertical: 4,
    paddingBottom: 0,
    paddingTop: 16,
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerSide: {
    width: 40,
    alignItems: "flex-end",
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  heroText: { marginLeft: 16 },
  heroName: {
    fontSize: SIZES.xl,
    fontWeight: "700",
    color: COLORS.primary,
  },
  heroRole: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    marginHorizontal: SIZES.padding.md,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLeft: { flex: 1 },
  infoLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
  },
  infoValueLink: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  editBtn: {
    padding: 6,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SIZES.padding.sm,
  },
  analyticsCard: {
    width: "50%",
    padding: SIZES.padding.sm,
    alignItems: "center",
  },
  analyticsValue: {
    fontSize: SIZES.xxxl,
    fontWeight: "800",
    color: COLORS.primary,
  },
  analyticsLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  settingsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    marginHorizontal: SIZES.padding.md,
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  settingsBtnText: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 10,
  },
});
