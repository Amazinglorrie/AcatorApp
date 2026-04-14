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
import { Colors } from "../../constants/theme";
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
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="lock-open-outline" size={40} color="#fff" />
          </View>

          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </Text>

          {sent ? (
            <View style={styles.sentCard}>
              <Ionicons name="checkmark-circle" size={40} color={Colors.teal} />
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
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>

              <TouchableOpacity
                style={[styles.resetBtn, loading && { opacity: 0.7 }]}
                onPress={handleReset}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.teal} />
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
  container: { flex: 1, backgroundColor: Colors.teal },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    alignItems: "center",
  },
  backBtn: { position: "absolute", top: 52, left: 0 },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  fieldLabel: {
    alignSelf: "flex-start",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 15, color: "#fff" },
  resetBtn: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  resetBtnText: { fontSize: 15, fontWeight: "600", color: Colors.teal },
  cancelLink: { marginTop: 8 },
  cancelLinkText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textDecorationLine: "underline",
  },
  sentCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  sentTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },
  sentBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  backToLoginBtn: {
    marginTop: 8,
    backgroundColor: Colors.teal,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backToLoginText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});
