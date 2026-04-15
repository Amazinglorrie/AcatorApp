import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getDueVariant } from "../constants/utils";
import { getProjects, getTasks } from "./storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#1D9E75",
    });
  }

  // Skip push token in Expo Go (SDK 53+) — only works in development/production builds
  const isExpoGo = Constants.appOwnership === "expo";
  if (isExpoGo) {
    console.log("Running in Expo Go — skipping push token registration");
    return null;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return null;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
    return token;
  } catch {
    return null;
  }
}

export async function scheduleDueTaskNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const [projects, tasks] = await Promise.all([getProjects(), getTasks()]);
  const pending = tasks.filter((t) => t.status === "pending");

  for (const task of pending) {
    const variant = getDueVariant(task.dueDate);
    const project = projects.find((p) => p.id === task.projectId);
    const projectName = project?.name ?? "a project";

    if (variant === "overdue") {
      // SDK 53: immediate notifications use { seconds: 1 } instead of null
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⚠️ Task overdue",
          body: `"${task.name}" in ${projectName} is past due.`,
          data: { taskId: task.id, projectId: task.projectId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
        },
      });
    } else if (variant === "soon") {
      // SDK 53: scheduled date notifications use { type: "date", date: Date }
      const fireDate = new Date();
      fireDate.setHours(9, 0, 0, 0);
      if (fireDate <= new Date()) fireDate.setDate(fireDate.getDate() + 1);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Task due soon",
          body: `"${task.name}" in ${projectName} is due soon.`,
          data: { taskId: task.id, projectId: task.projectId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fireDate,
        },
      });
    }
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
