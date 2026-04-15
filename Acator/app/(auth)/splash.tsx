import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo in
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Check session then navigate
    const timer = setTimeout(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/onboarding");
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          {/* A-shaped logo mark */}
          <View style={styles.logoMark}>
            <View style={styles.logoLeft} />
            <View style={styles.logoCrossbar} />
          </View>
        </Animated.View>
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          Acator
        </Animated.Text>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  // ── Logo mark ──
  logoWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  logoMark: {
    width: 48,
    height: 56,
    position: "relative",
  },
  logoLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 6,
    height: 48,
    backgroundColor: theme.colors.textOnTeal,
    borderRadius: 3,
    transform: [{ rotate: "15deg" }],
  },
  logoCrossbar: {
    position: "absolute",
    bottom: 20,
    left: 2,
    width: 28,
    height: 5,
    backgroundColor: theme.colors.textOnTealMuted,
    borderRadius: 3,
    transform: [{ rotate: "15deg" }],
  },

  // ── App name ──
  appName: {
    fontSize: 36,
    fontWeight: "600",
    color: theme.colors.textOnTeal,
    letterSpacing: 1,
  },
});
