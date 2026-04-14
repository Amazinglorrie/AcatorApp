import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/theme";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface TabIconProps {
  name: IoniconsName;
  activeName: IoniconsName;
  label: string;
  focused: boolean;
}

function TabIcon({ name, activeName, label, focused }: TabIconProps) {
  if (focused) {
    return (
      <View style={styles.activeWrap}>
        <View style={styles.activeBubble}>
          <Ionicons name={activeName} size={22} color="#fff" />
        </View>
        <Text style={styles.activeLabel}>{label}</Text>
      </View>
    );
  }
  return (
    <View style={styles.inactiveWrap}>
      <Ionicons name={name} size={21} color="rgba(255,255,255,0.65)" />
      <Text style={styles.inactiveLabel}>{label}</Text>
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
        name="projects"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="folder-outline"
              activeName="folder"
              label="Projects"
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
              label="Notifications"
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.teal,
    borderTopWidth: 0,
    borderRadius: 36,
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 24 : 12,
    height: 64,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    paddingBottom: 0,
    paddingTop: 0,
  },

  activeWrap: {
    alignItems: "center",
    marginTop: -22,
  },
  activeBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.teal,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  activeLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#fff",
  },

  inactiveWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 6,
  },
  inactiveLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
  },
});
