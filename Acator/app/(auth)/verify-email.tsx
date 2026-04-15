import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [resendStatus, setResendStatus] = useState<"idle" | "sent" | "error">(
    "idle",
  );

  const handleResend = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResendStatus(error ? "error" : "sent");
    setTimeout(() => setResendStatus("idle"), 4000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.inner}>
        {/* ── Icon ── */}
        <View style={styles.iconCircle}>
          <Ionicons
            name="mail-outline"
            size={48}
            color={theme.colors.textOnTeal}
          />
        </View>

        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a confirmation link to{"\n"}
          <Text style={styles.emailText}>{email}</Text>
        </Text>
        <Text style={styles.instruction}>
          Click the link in the email to activate your account, then come back
          and sign in.
        </Text>

        {/* ── Resend feedback ── */}
        {resendStatus === "sent" && (
          <View style={styles.feedbackBanner}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={theme.colors.textOnTeal}
            />
            <Text style={styles.feedbackText}>
              Email resent! Check your inbox.
            </Text>
          </View>
        )}
        {resendStatus === "error" && (
          <View style={[styles.feedbackBanner, styles.feedbackBannerError]}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={theme.colors.error}
            />
            <Text style={[styles.feedbackText, styles.feedbackTextError]}>
              Failed to resend. Please try again.
            </Text>
          </View>
        )}

        {/* ── Go to login ── */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.loginBtnText}>Go to login</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        {/* ── Resend ── */}
        <TouchableOpacity style={styles.resendBtn} onPress={handleResend}>
          <Text style={styles.resendText}>Didn't receive it? Resend email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: theme.spacing.gap,
  },
  iconCircle: {
    width: theme.icon.circleSize + 10,
    height: theme.icon.circleSize + 10,
    borderRadius: theme.radius.pill + 5,
    backgroundColor: theme.icon.circleBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    ...theme.typography.title,
    fontSize: 26,
    color: theme.colors.textOnTeal,
    textAlign: "center",
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textOnTealMuted,
    textAlign: "center",
  },
  emailText: {
    fontWeight: "700",
    color: theme.colors.textOnTeal,
  },
  instruction: {
    ...theme.typography.body,
    color: theme.colors.textOnTealFaint,
    textAlign: "center",
    marginTop: 4,
  },
  feedbackBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: theme.radius.input,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "100%",
  },
  feedbackBannerError: {
    backgroundColor: "#fef2f2",
  },
  feedbackText: {
    ...theme.typography.body,
    color: theme.colors.textOnTeal,
    flex: 1,
  },
  feedbackTextError: {
    color: theme.colors.error,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 16,
  },
  loginBtnText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
  resendBtn: {
    marginTop: 12,
  },
  resendText: {
    ...theme.typography.link,
    color: theme.colors.textOnTealFaint,
    textDecorationLine: "underline",
  },
});
