import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleResend = async () => {
    if (!email) return;
    await supabase.auth.resend({ type: "signup", email });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.inner}>
        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={48} color="#fff" />
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

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.loginBtnText}>Go to login</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.teal} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendBtn} onPress={handleResend}>
          <Text style={styles.resendText}>Didn't receive it? Resend email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.teal },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  emailText: { fontWeight: "700", color: "#fff" },
  instruction: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 4,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 16,
  },
  loginBtnText: { fontSize: 15, fontWeight: "600", color: Colors.teal },
  resendBtn: { marginTop: 12 },
  resendText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textDecorationLine: "underline",
  },
});
