import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project, Task } from "../constants/types";

const PROJECTS_KEY = "studydesk:projects";
const TASKS_KEY = "studydesk:tasks";

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  try {
    const raw = await AsyncStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveProject(project: Project): Promise<void> {
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.unshift(project);
  }
  await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export async function deleteProject(id: string): Promise<void> {
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
  // Also delete associated tasks
  const tasks = await getTasks();
  const remainingTasks = tasks.filter((t) => t.projectId !== id);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(remainingTasks));
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function getTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getTasksForProject(projectId: string): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter((t) => t.projectId === projectId);
}

export async function saveTask(task: Task): Promise<void> {
  const tasks = await getTasks();
  const idx = tasks.findIndex((t) => t.id === task.id);
  if (idx >= 0) {
    tasks[idx] = task;
  } else {
    tasks.unshift(task);
  }
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = await getTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
}

export async function toggleTask(id: string): Promise<void> {
  const tasks = await getTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx >= 0) {
    tasks[idx].status = tasks[idx].status === "done" ? "pending" : "done";
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
}

// ── Seed data ─────────────────────────────────────────────────────────────────

export async function seedDataIfEmpty(): Promise<void> {
  const projects = await getProjects();
  if (projects.length > 0) return;

  const today = new Date();
  const addDays = (d: number) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().split("T")[0];
  };

  const seedProjects: Project[] = [
    {
      id: "p1",
      name: "Biology lab report",
      subject: "Science",
      description: "Enzyme activity experiment write-up with data analysis.",
      dueDate: addDays(6),
      status: "in-progress",
      color: "blue",
      createdAt: new Date().toISOString(),
    },
    {
      id: "p2",
      name: "History essay",
      subject: "Humanities",
      description:
        "1500-word essay on Cold War policy and its long-term effects.",
      dueDate: addDays(2),
      status: "in-progress",
      color: "amber",
      createdAt: new Date().toISOString(),
    },
    {
      id: "p3",
      name: "Math problem set",
      subject: "Mathematics",
      description: "Chapter 9 differential equations — all 20 problems.",
      dueDate: addDays(-2),
      status: "completed",
      color: "green",
      createdAt: new Date().toISOString(),
    },
    {
      id: "p4",
      name: "CS group project",
      subject: "Computer Science",
      description: "Build a simple CRUD web app with authentication.",
      dueDate: addDays(-1),
      status: "overdue",
      color: "red",
      createdAt: new Date().toISOString(),
    },
  ];

  const seedTasks: Task[] = [
    {
      id: "t1",
      projectId: "p1",
      name: "Write abstract section",
      dueDate: addDays(1),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t2",
      projectId: "p1",
      name: "Analyze enzyme data",
      dueDate: addDays(3),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t3",
      projectId: "p1",
      name: "Create figures and charts",
      dueDate: addDays(4),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t4",
      projectId: "p1",
      name: "Write methodology section",
      dueDate: addDays(5),
      status: "done",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t5",
      projectId: "p1",
      name: "Literature review",
      dueDate: addDays(-1),
      status: "done",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t6",
      projectId: "p2",
      name: "Gather Cold War sources",
      dueDate: addDays(1),
      status: "done",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t7",
      projectId: "p2",
      name: "Outline essay structure",
      dueDate: addDays(2),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t8",
      projectId: "p2",
      name: "Write introduction",
      dueDate: addDays(2),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t9",
      projectId: "p4",
      name: "Set up project repo",
      dueDate: addDays(-1),
      status: "done",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t10",
      projectId: "p4",
      name: "Design ER diagram",
      dueDate: addDays(0),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t11",
      projectId: "p4",
      name: "Implement login screen",
      dueDate: addDays(1),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const p of seedProjects) await saveProject(p);
  for (const t of seedTasks) await saveTask(t);
}
