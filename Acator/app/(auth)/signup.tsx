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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (error) {
      Alert.alert("Sign up failed", error.message);
    } else {
      router.replace({
        pathname: "/(auth)/verify-email",
        params: { email: email.trim() },
      });
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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.logoArea}>
            <View style={styles.logoMark}>
              <View style={styles.logoLeft} />
              <View style={styles.logoCrossbar} />
            </View>
            <Text style={styles.appName}>Acator</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create account</Text>

            <Text style={styles.fieldLabel}>Full name</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
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
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSignup}
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

            <TouchableOpacity
              style={[styles.signupBtn, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.teal} />
              ) : (
                <>
                  <Text style={styles.signupBtnText}>Create account</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.teal}
                  />
                </>
              )}
            </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.teal },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  backBtn: { position: "absolute", top: 52, left: 20, zIndex: 10 },
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
  signupBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
  },
  signupBtnText: { fontSize: 15, fontWeight: "600", color: Colors.teal },
  loginLink: { alignItems: "center", marginTop: 20 },
  loginLinkText: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
});
