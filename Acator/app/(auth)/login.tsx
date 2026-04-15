import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        Alert.alert(
          "Email not verified",
          "Please check your inbox and confirm your email before logging in.",
          [
            {
              text: "Resend email",
              onPress: () =>
                router.push({
                  pathname: "/(auth)/verify-email",
                  params: { email: email.trim() },
                }),
            },
            { text: "OK", style: "cancel" },
          ],
        );
      } else {
        Alert.alert("Login failed", error.message);
      }
    };
  };

  const handleGoogleLogin = async () => {
    Alert.alert(
      "Google Sign-In",
      "Configure OAuth in your Supabase dashboard to enable this.",
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
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoMark}>
              <View style={styles.logoLeft} />
              <View style={styles.logoCrossbar} />
            </View>
            <Text style={styles.appName}>Acator</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Sign in</Text>

            <Text style={styles.fieldLabel}>Username or Email</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="rgba(255,255,255,0.6)"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Create account */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/signup")}
              style={styles.createAccountBtn}
            >
              <Text style={styles.createAccountText}>Create an account</Text>
            </TouchableOpacity>

            {/* Google */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleLogin}
            >
              <View style={styles.googleIcon}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.teal} />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Login</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.teal}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.teal },
  scroll: { flexGrow: 1, paddingBottom: 40 },
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
    backgroundColor: "#fff",
    borderRadius: 3,
    transform: [{ rotate: "15deg" }],
  },
  logoCrossbar: {
    position: "absolute",
    bottom: 14,
    left: 1,
    width: 22,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 2,
    transform: [{ rotate: "15deg" }],
  },
  appName: { fontSize: 30, fontWeight: "600", color: "#fff", letterSpacing: 1 },
  formCard: { paddingHorizontal: 28 },
  formTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    marginBottom: 28,
  },
  fieldLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
    height: 48,
  },
  input: { flex: 1, fontSize: 15, color: "#fff" },
  forgotBtn: { alignSelf: "flex-end", marginTop: -10, marginBottom: 20 },
  forgotText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    textDecorationLine: "underline",
  },
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
  dividerText: { fontSize: 13, color: "rgba(255,255,255,0.6)" },
  createAccountBtn: { alignItems: "center", marginVertical: 10 },
  createAccountText: {
    fontSize: 14,
    color: "#fff",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.teal,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: { fontSize: 13, fontWeight: "700", color: "#4285F4" },
  googleText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 4,
  },
  loginBtnText: { fontSize: 15, fontWeight: "600", color: Colors.teal },
});
