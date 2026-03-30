import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      {/* Correct parent route names */}
      <Stack.Screen name="project" />
      <Stack.Screen name="task" />
      <Stack.Screen name="kanban" />
    </Stack>
  );
}