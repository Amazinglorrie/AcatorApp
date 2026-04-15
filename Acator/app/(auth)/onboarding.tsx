import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../constants/theme";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    icon: "albums-outline" as const,
    title: "Organize",
    body: "Stay on top of every project, deadline, and task — all in one beautiful place.",
    bg: theme.colors.primary,        // #1D9E75
  },
  {
    id: "2",
    icon: "people-outline" as const,
    title: "Collaborate",
    body: "Work together with your team, assign tasks, share updates and keep everyone in sync.",
    bg: "#16856A",
  },
  {
    id: "3",
    icon: "trophy-outline" as const,
    title: "Achieve",
    body: "Track your progress, hit your goals, and celebrate every win along the way.",
    bg: "#0F6E56",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = () => router.replace("/(auth)/login");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ── Skip ── */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* ── Slides ── */}
      <Animated.FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={64} color={theme.colors.textOnTeal} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideBody}>{item.body}</Text>
          </View>
        )}
      />

      {/* ── Footer: dots + next button ── */}
      <View style={[styles.footer, { backgroundColor: SLIDES[activeIndex].bg }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.35, 1, 0.35],
              extrapolate: "clamp",
            });
            const scaleX = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [1, 2.4, 1],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { opacity, transform: [{ scaleX }] }]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {activeIndex < SLIDES.length - 1 ? "Next" : "Get Started"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
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

  // ── Skip ──
  skipBtn: {
    position: "absolute",
    top: 56,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    ...theme.typography.link,
    color: theme.colors.textOnTealFaint,
    fontWeight: "500",
  },

  // ── Slide ──
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 120,
    gap: 24,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.icon.circleBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.textOnTeal,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  slideBody: {
    fontSize: 16,
    color: theme.colors.textOnTealMuted,
    textAlign: "center",
    lineHeight: 24,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 48,
    paddingTop: 20,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
  },
  nextBtnText: {
    ...theme.typography.link,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
