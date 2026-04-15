import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Email required", "Please enter your email address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: "acator://reset-password",
      },
    );
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inner}>
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.textOnTeal}
            />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconCircle}>
            <Ionicons
              name="lock-open-outline"
              size={40}
              color={theme.colors.textOnTeal}
            />
          </View>

          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </Text>

          {sent ? (
            <View style={styles.sentCard}>
              <Ionicons
                name="checkmark-circle"
                size={40}
                color={theme.colors.success}
              />
              <Text style={styles.sentTitle}>Email sent!</Text>
              <Text style={styles.sentBody}>
                Check your inbox for a password reset link. It may take a minute
                to arrive.
              </Text>
              <TouchableOpacity
                style={styles.backToLoginBtn}
                onPress={() => router.replace("/(auth)/login")}
              >
                <Text style={styles.backToLoginText}>Back to login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.fieldLabel}>Email address</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="send"
                  onSubmitEditing={handleReset}
                  placeholderTextColor={theme.colors.placeholderOnTeal}
                />
              </View>

              <TouchableOpacity
                style={[styles.resetBtn, loading && { opacity: 0.7 }]}
                onPress={handleReset}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Text style={styles.resetBtnText}>Send reset link</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.cancelLink}
              >
                <Text style={styles.cancelLinkText}>Back to login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  inner: {
    flex: 1,
    paddingHorizontal: theme.spacing.screen,
    paddingTop: 80,
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 52,
    left: 0,
  },
  iconCircle: {
    width: theme.icon.circleSize,
    height: theme.icon.circleSize,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.icon.circleBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textOnTeal,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textOnTealMuted,
    textAlign: "center",
    marginBottom: 32,
  },
  fieldLabel: {
    alignSelf: "flex-start",
    ...theme.typography.label,
    color: theme.colors.textOnTealMuted,
    marginBottom: 8,
  },
  inputWrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.radius.input,
    paddingHorizontal: 14,
    height: theme.spacing.inputH,
    marginBottom: theme.spacing.gap,
  },
  input: {
    flex: 1,
    ...theme.typography.subtitle,
    color: theme.colors.textOnTeal,
  },
  resetBtn: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: theme.spacing.gap,
  },
  resetBtnText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
  cancelLink: {
    marginTop: 8,
  },
  cancelLinkText: {
    ...theme.typography.link,
    color: theme.colors.textOnTealFaint,
    textDecorationLine: "underline",
  },
  sentCard: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing.card,
    alignItems: "center",
    gap: theme.spacing.gap,
  },
  sentTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  sentBody: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: "center",
  },
  backToLoginBtn: {
    marginTop: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.input,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backToLoginText: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.textOnTeal,
  },
});
