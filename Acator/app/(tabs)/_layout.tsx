import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  name,
  activeName,
  label,
  focused,
}: {
  name: IoniconsName;
  activeName: IoniconsName;
  label: string;
  focused: boolean;
}) {
  if (focused) {
    return (
      <View style={styles.activeWrap}>
        <View style={styles.activeBubble}>
          <Ionicons
            name={activeName}
            size={22}
            color={theme.colors.textOnTeal}
          />
        </View>
        <Text style={styles.activeLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.inactiveWrap}>
      <Ionicons name={name} size={22} color={theme.colors.textOnTealFaint} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="home-outline"
              activeName="home"
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="chatbubble-outline"
              activeName="chatbubble"
              label="Chat"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="notifications-outline"
              activeName="notifications"
              label="Alerts"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="person-outline"
              activeName="person"
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const BAR_HEIGHT = 64;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.primary,
    borderTopWidth: 0,
    borderRadius: 36,
    marginHorizontal: 16,
    marginBottom: 16,
    height: BAR_HEIGHT,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    paddingBottom: 0,
    paddingTop: 0,
  },
  tabItem: {
    height: BAR_HEIGHT,
    paddingTop: 0,
    paddingBottom: 0,
  },
  activeWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22,
    gap: 3,
  },
  activeBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  activeLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: theme.colors.textOnTeal,
  },
  inactiveWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
