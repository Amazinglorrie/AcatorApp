import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Share,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS, SIZES } from "../constants/theme";

// A simple deterministic QR-like SVG rendered as a data URI image.
// In production you would use: expo install react-native-qrcode-svg
// and render: <QRCode value="acator://user/sarah-johnson" size={200} />

const QR_PLACEHOLDER_URI =
  "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=acator%3A%2F%2Fuser%2Fsarah-johnson&bgcolor=ffffff&color=000000&qzone=1";

export default function QRAddFriendScreen() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(1)).current;

  // Subtle pulse on the QR card
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.02,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Add me on Acator! acator://user/sarah-johnson",
      });
    } catch (_) {}
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Teal background top portion */}
      <View style={styles.topBg}>
        {/* App brand */}
        <Image
          source={require("../assets/logo_full.png")}
          style={styles.brandLogo}
          resizeMode="contain"
        />

        {/* Prompt text */}
        <Text style={styles.prompt}>
          Scan QR code to add{" "}
          <Text style={styles.promptHighlight}>Sarah J</Text>
          {"\n"}as your friend!
        </Text>

        {/* QR card */}
        <Animated.View
          style={[styles.qrCard, { transform: [{ scale: pulse }] }]}
        >
          {/* Corner decorators */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          <Image
            source={{ uri: QR_PLACEHOLDER_URI }}
            style={styles.qrImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomSection}>
        {/* Share link */}
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Ionicons
            name="share-social-outline"
            size={18}
            color={COLORS.primary}
          />
          <Text style={styles.shareBtnText}>Share Link Instead</Text>
        </TouchableOpacity>

        {/* Return button */}
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={18} color={COLORS.white} />
          <Text style={styles.returnBtnText}>Return</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  topBg: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: SIZES.padding.xl,
  },
  brandLogo: {
    width: 160,
    height: 60,
    marginBottom: 20,
  },
  prompt: {
    fontSize: SIZES.xl,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 32,
  },
  promptHighlight: {
    color: "#7fffd4",
  },
  qrCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.xl,
    padding: 20,
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    position: "relative",
  },
  qrImage: {
    width: 190,
    height: 190,
  },
  // Corner bracket decorations
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: COLORS.primary,
  },
  cornerTL: {
    top: 8,
    left: 8,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 8,
    right: 8,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 8,
    left: 8,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 8,
    right: 8,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  bottomSection: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    padding: SIZES.padding.xl,
    paddingBottom: 30,
    gap: 12,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: SIZES.radius.full,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 8,
  },
  shareBtnText: {
    fontSize: SIZES.md,
    fontWeight: "600",
    color: COLORS.primary,
  },
  returnBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: SIZES.radius.full,
    gap: 6,
  },
  returnBtnText: {
    fontSize: SIZES.md,
    fontWeight: "600",
    color: COLORS.white,
  },
});
