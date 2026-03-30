import { Text, View } from "react-native";
import { Colors } from "../constants/theme";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background, // now using your theme color
      }}
    >
      <Text>Welcome to Acator App.</Text>
    </View>
  );
}
