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

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginForm = z.infer<typeof loginSchema>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);
      await signIn(data.email, data.password);
      // No manual navigation needed — AuthGuard in _layout.tsx watches the
      // session and redirects to /(tabs) once session becomes non-null.
    } catch (e: any) {
      const msg: string = e?.message ?? "";
      if (msg.toLowerCase().includes("email not confirmed")) {
        setAuthError(
          "Email not verified. Check your inbox or resend the confirmation email.",
        );
      } else {
        setAuthError(
          e instanceof Error ? e.message : "Sign in failed. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setAuthError(
      "Google Sign-In: configure OAuth in your Supabase dashboard to enable this.",
    );
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
          {/* ── Logo ── */}
          <View style={styles.logoArea}>
            <View style={styles.logoMark}>
              <View style={styles.logoLeft} />
              <View style={styles.logoCrossbar} />
            </View>
            <Text style={styles.appName}>Acator</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Sign in</Text>

            {/* ── Auth error banner ── */}
            {authError && (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={theme.colors.error}
                />
                <Text style={styles.errorBannerText}>{authError}</Text>
                {authError.includes("not verified") && (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/(auth)/verify-email",
                        params: { email: getValues("email").trim() },
                      })
                    }
                  >
                    <Text style={styles.errorBannerLink}>Resend</Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* ── Email ── */}
            <Text style={styles.fieldLabel}>Username or Email</Text>
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
                    placeholderTextColor={theme.colors.placeholderOnTeal}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    returnKeyType="next"
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
                    placeholderTextColor={theme.colors.placeholderOnTeal}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    autoComplete="current-password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
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

            {/* ── Forgot password ── */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* ── Divider ── */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* ── Create account ── */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/signup")}
              style={styles.createAccountBtn}
            >
              <Text style={styles.createAccountText}>Create an account</Text>
            </TouchableOpacity>

            {/* ── Google ── */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleLogin}
            >
              <View style={styles.googleIcon}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* ── Login button ── */}
            <Pressable
              style={[styles.loginBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Login</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.colors.primary}
                  />
                </>
              )}
            </Pressable>
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

  // ── Logo ──
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 80,
    paddingBottom: 48,
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
  errorBannerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.error,
    textDecorationLine: "underline",
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

  // ── Forgot ──
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 20,
  },
  forgotText: {
    ...theme.typography.link,
    color: theme.colors.textOnTealFaint,
    textDecorationLine: "underline",
  },

  // ── Divider ──
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dividerText: {
    fontSize: 13,
    color: theme.colors.textOnTealFaint,
  },

  // ── Create account ──
  createAccountBtn: {
    alignItems: "center",
    marginVertical: 10,
  },
  createAccountText: {
    ...theme.typography.link,
    color: theme.colors.textOnTeal,
    textDecorationLine: "underline",
    fontWeight: "500",
  },

  // ── Google ──
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: theme.radius.input,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: theme.spacing.gap,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: { fontSize: 13, fontWeight: "700", color: "#4285F4" },
  googleText: {
    ...theme.typography.link,
    fontWeight: "500",
    color: theme.colors.textOnTeal,
  },

  // ── Login button ──
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    paddingVertical: 14,
    marginTop: 4,
  },
  loginBtnText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
});
