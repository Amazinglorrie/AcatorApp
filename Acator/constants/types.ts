export type TaskStatus = 'pending' | 'done';

export type ProjectStatus =
  | 'not-started'
  | 'in-progress'
  | 'completed'
  | 'overdue';

export interface Task {
  id: string;
  projectId: string;
  name: string;
  dueDate: string; 
  status: TaskStatus;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  subject: string;
  description: string;
  dueDate: string; 
  status: ProjectStatus;
  color: ProjectColor;
  createdAt: string;
}

export type ProjectColor = 'blue' | 'amber' | 'green' | 'red' | 'purple' | 'teal';
