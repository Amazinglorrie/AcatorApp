import { Project, Task } from "../constants/types";
import { supabase } from "../lib/supabase";

// ── Auth helpers ──────────────────────────────────────────────────────────────

async function getUserId(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.user.id;
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(dbToProject);
  } catch {
    return [];
  }
}

export async function saveProject(project: Project): Promise<void> {
  const userId = await getUserId();
  const row = projectToDb(project, userId);
  const { error } = await supabase.from("projects").upsert(row);
  if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function getTasks(): Promise<Task[]> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(dbToTask);
  } catch {
    return [];
  }
}

export async function getTasksForProject(projectId: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(dbToTask);
  } catch {
    return [];
  }
}

export async function saveTask(task: Task): Promise<void> {
  const userId = await getUserId();
  const row = taskToDb(task, userId);
  const { error } = await supabase.from("tasks").upsert(row);
  if (error) throw error;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleTask(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("tasks")
    .select("status")
    .eq("id", id)
    .single();
  if (error || !data) throw error;
  const newStatus = data.status === "done" ? "pending" : "done";
  const { error: updateError } = await supabase
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", id);
  if (updateError) throw updateError;
}

// ── Comments ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  projectId: string;
  author: string;
  initials: string;
  text: string;
  createdAt: string;
}

export async function getComments(projectId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(dbToComment);
  } catch {
    return [];
  }
}

export async function addComment(comment: Comment): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabase.from("comments").insert({
    id: comment.id,
    user_id: userId,
    project_id: comment.projectId,
    author: comment.author,
    initials: comment.initials,
    text: comment.text,
    created_at: comment.createdAt,
  });
  if (error) throw error;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

export async function seedDataIfEmpty(): Promise<void> {
  const projects = await getProjects();
  if (projects.length > 0) return;

  const userId = await getUserId();
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

// ── DB mappers ────────────────────────────────────────────────────────────────

function dbToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject ?? "",
    description: row.description ?? "",
    dueDate: row.due_date ?? "",
    status: row.status,
    color: row.color,
    createdAt: row.created_at,
  };
}

function projectToDb(p: Project, userId: string) {
  return {
    id: p.id,
    user_id: userId,
    name: p.name,
    subject: p.subject,
    description: p.description,
    due_date: p.dueDate,
    status: p.status,
    color: p.color,
    created_at: p.createdAt,
  };
}

function dbToTask(row: any): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    dueDate: row.due_date ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

function taskToDb(t: Task, userId: string) {
  return {
    id: t.id,
    user_id: userId,
    project_id: t.projectId,
    name: t.name,
    due_date: t.dueDate,
    status: t.status,
    created_at: t.createdAt,
  };
}

function dbToComment(row: any): Comment {
  return {
    id: row.id,
    projectId: row.project_id,
    author: row.author,
    initials: row.initials,
    text: row.text,
    createdAt: row.created_at,
  };
}
