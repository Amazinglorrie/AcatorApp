import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

// ── Validation schema ─────────────────────────────────────────────────────────

const signupSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignupForm = z.infer<typeof signupSchema>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);
      await signUp(data.email, data.password);
      // Navigate to verify-email after successful sign-up
      router.replace({
        pathname: "/(auth)/verify-email",
        params: { email: data.email.trim() },
      });
    } catch (e) {
      setAuthError(
        e instanceof Error ? e.message : "Sign up failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back button ── */}
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

          {/* ── Logo ── */}
          <View style={styles.logoArea}>
            <View style={styles.logoMark}>
              <View style={styles.logoLeft} />
              <View style={styles.logoCrossbar} />
            </View>
            <Text style={styles.appName}>Acator</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create account</Text>

            {/* ── Auth error banner ── */}
            {authError && (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={theme.colors.error}
                />
                <Text style={styles.errorBannerText}>{authError}</Text>
              </View>
            )}

            {/* ── Full name ── */}
            <Text style={styles.fieldLabel}>Full name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputWrap,
                    errors.name && styles.inputWrapError,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    autoComplete="name"
                    returnKeyType="next"
                    placeholderTextColor={theme.colors.placeholderOnTeal}
                  />
                </View>
              )}
            />
            {errors.name && (
              <Text style={styles.fieldError}>{errors.name.message}</Text>
            )}

            {/* ── Email ── */}
            <Text style={styles.fieldLabel}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputWrap,
                    errors.email && styles.inputWrapError,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    returnKeyType="next"
                    placeholderTextColor={theme.colors.placeholderOnTeal}
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text style={styles.fieldError}>{errors.email.message}</Text>
            )}

            {/* ── Password ── */}
            <Text style={styles.fieldLabel}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputWrap,
                    errors.password && styles.inputWrapError,
                  ]}
                >
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    placeholderTextColor={theme.colors.placeholderOnTeal}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={theme.colors.textOnTealMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text style={styles.fieldError}>{errors.password.message}</Text>
            )}

            {/* ── Submit button ── */}
            <Pressable
              style={[styles.signupBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <>
                  <Text style={styles.signupBtnText}>Create account</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.colors.primary}
                  />
                </>
              )}
            </Pressable>

            {/* ── Sign in link ── */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.loginLinkText}>
                Already have an account?{" "}
                <Text style={{ textDecorationLine: "underline" }}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // ── Back ──
  backBtn: {
    position: "absolute",
    top: 52,
    left: 20,
    zIndex: 10,
  },

  // ── Logo ──
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoMark: { width: 36, height: 42, position: "relative" },
  logoLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 5,
    height: 36,
    backgroundColor: theme.colors.card,
    borderRadius: 3,
    transform: [{ rotate: "15deg" }],
  },
  logoCrossbar: {
    position: "absolute",
    bottom: 14,
    left: 1,
    width: 22,
    height: 4,
    backgroundColor: theme.colors.textOnTealMuted,
    borderRadius: 2,
    transform: [{ rotate: "15deg" }],
  },
  appName: {
    fontSize: 30,
    fontWeight: "600",
    color: theme.colors.textOnTeal,
    letterSpacing: 1,
  },

  // ── Form ──
  formCard: {
    paddingHorizontal: theme.spacing.screen,
  },
  formTitle: {
    ...theme.typography.subtitle,
    fontWeight: "500",
    color: theme.colors.textOnTeal,
    textAlign: "center",
    marginBottom: 28,
  },

  // ── Error banner ──
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: theme.radius.input,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.error,
  },

  // ── Fields ──
  fieldLabel: {
    ...theme.typography.label,
    color: theme.colors.textOnTealMuted,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 14,
    marginBottom: theme.spacing.gap,
    height: theme.spacing.inputH,
  },
  inputWrapError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textOnTeal,
  },
  fieldError: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: -8,
    marginBottom: theme.spacing.gap,
  },

  // ── Submit ──
  signupBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    paddingVertical: 14,
    marginTop: 8,
  },
  signupBtnText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },

  // ── Sign in link ──
  loginLink: {
    alignItems: "center",
    marginTop: 20,
  },
  loginLinkText: {
    ...theme.typography.link,
    color: theme.colors.textOnTealMuted,
  },
});
