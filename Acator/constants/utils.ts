import { Project, Task } from "../constants/types";

function parseDate(dateStr: string): Date {
  // Handles YYYY-MM-DD safely without timezone shift
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDueDate(dateStr: string): string {
  const date = parseDate(dateStr);
  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type DueVariant = "overdue" | "soon" | "ok" | "done";

export function getDueVariant(dateStr: string, done?: boolean): DueVariant {
  if (done) return "done";
  const date = parseDate(dateStr);
  const today = startOfToday();
  if (date < today) return "overdue";
  const diffMs = date.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 2) return "soon";
  return "ok";
}

export function getProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.round(
    (tasks.filter((t) => t.status === "done").length / tasks.length) * 100,
  );
}

export function computeProjectStatus(
  project: Project,
  tasks: Task[],
): Project["status"] {
  if (tasks.length > 0 && tasks.every((t) => t.status === "done"))
    return "completed";
  const date = parseDate(project.dueDate);
  const today = startOfToday();
  if (date < today) return "overdue";
  const diffDays = Math.floor(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 2) return "in-progress";
  return project.status === "not-started" ? "not-started" : "in-progress";
}

export const STATUS_LABELS: Record<Project["status"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
  overdue: "Overdue",
};
