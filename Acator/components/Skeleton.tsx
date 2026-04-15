import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Colors, theme } from "../constants/theme";

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: Colors.separator },
        { opacity },
        style,
      ]}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <SkeletonBox width="60%" height={14} borderRadius={6} />
        <SkeletonBox width={70} height={20} borderRadius={99} />
      </View>
      <SkeletonBox
        width="40%"
        height={11}
        borderRadius={4}
        style={{ marginTop: 6 }}
      />
      <SkeletonBox
        width="100%"
        height={3}
        borderRadius={99}
        style={{ marginTop: 12 }}
      />
      <View style={[styles.row, { marginTop: 6 }]}>
        <SkeletonBox width={50} height={10} borderRadius={4} />
        <SkeletonBox width={30} height={10} borderRadius={4} />
      </View>
    </View>
  );
}

export function TaskRowSkeleton() {
  return (
    <View style={styles.taskRow}>
      <SkeletonBox width={22} height={22} borderRadius={11} />
      <View style={{ flex: 1, gap: 4 }}>
        <SkeletonBox width="70%" height={13} borderRadius={4} />
        <SkeletonBox width="40%" height={11} borderRadius={4} />
      </View>
      <SkeletonBox width={40} height={11} borderRadius={4} />
    </View>
  );
}

export function StatTileSkeleton() {
  return (
    <View style={styles.statTile}>
      <SkeletonBox width="60%" height={11} borderRadius={4} />
      <SkeletonBox
        width="40%"
        height={20}
        borderRadius={4}
        style={{ marginTop: 6 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskRow: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card - 2,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statTile: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card - 2,
    padding: 12,
  },
});
