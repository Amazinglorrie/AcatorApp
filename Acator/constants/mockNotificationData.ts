export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "danger";
  createdAt: string;
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Task due soon",
    message: "Write abstract section is due tomorrow.",
    type: "warning",
    createdAt: "2026-04-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Task completed",
    message: "You completed 'Set up project repo'.",
    type: "success",
    createdAt: "2026-04-14T18:30:00Z",
  },
  {
    id: "3",
    title: "New project created",
    message: "Biology lab report has been added.",
    type: "info",
    createdAt: "2026-04-14T12:00:00Z",
  },
  {
    id: "4",
    title: "Deadline missed",
    message: "Math problem set is overdue.",
    type: "danger",
    createdAt: "2026-04-13T09:15:00Z",
  },
  {
    id: "5",
    title: "Reminder",
    message: "Don't forget to review Cold War essay.",
    type: "warning",
    createdAt: "2026-04-12T08:00:00Z",
  },
];