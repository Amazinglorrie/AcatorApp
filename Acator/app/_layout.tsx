// Wraps the entire app in AuthProvider and adds AuthGuard for protected routes.
//
// AuthGuard pattern:
//   - Watches session + current route segments
//   - If no session + inside (tabs) group → redirect to /(auth)
//   - If session exists + on (auth) screens → redirect to /(tabs)
//   This means every protected screen is automatically guarded — no manual
//   checks needed in each tab screen.

import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";
import {
  registerForPushNotifications,
  scheduleDueTaskNotifications,
} from "../store/notifications";

// ── AuthGuard ─────────────────────────────────────────────────────────────────

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const inTabGroup = segments[0] === "(tabs)";
    const inAuthGroup = segments[0] === "(auth)";

    if (!session && inTabGroup) {
      router.replace("/(auth)");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, isLoading, segments]);

  useEffect(() => {
    if (!session) return;

    setupNotifications();

    // Handle notification taps — navigate to the right project
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.projectId) {
          router.push(`/project/${data.projectId}`);
        }
      });

    return () => {
      // SDK 53+: call .remove() directly on the subscription object
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [session]);

  const setupNotifications = async () => {
    const token = await registerForPushNotifications();
    if (token) {
      console.log("Push token:", token);
    }
    await scheduleDueTaskNotifications();
  };

  if (isLoading) return null;

  return <>{children}</>;
};

// ── Root Layout ───────────────────────────────────────────────────────────────

const RootLayout = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="project" />
            <Stack.Screen name="task" />
          </Stack>
        </AuthGuard>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default RootLayout;
