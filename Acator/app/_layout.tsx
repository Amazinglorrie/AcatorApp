import { Session } from "@supabase/supabase-js";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import {
  registerForPushNotifications,
  scheduleDueTaskNotifications,
} from "../store/notifications";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const router = useRouter();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setupNotifications();
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setupNotifications();
    });

    // Handle notification taps — navigate to the right project
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.projectId) {
          router.push(`/project/${data.projectId}`);
        }
      });

    return () => {
      subscription.unsubscribe();
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const setupNotifications = async () => {
    const token = await registerForPushNotifications();
    if (token) {
      // Optionally save token to Supabase for server-side push
      console.log("Push token:", token);
    }
    await scheduleDueTaskNotifications();
  };

  if (session === undefined) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="project" />
            <Stack.Screen name="task" />
          </>
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
