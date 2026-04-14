import { format, isToday, isTomorrow, isPast, differenceInDays, parseISO } from 'date-fns';
import { Project, Task } from '../constants/types';

export function formatDueDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
}

export type DueVariant = 'overdue' | 'soon' | 'ok' | 'done';

export function getDueVariant(dateStr: string, done?: boolean): DueVariant {
  if (done) return 'done';
  const date = parseISO(dateStr);
  if (isPast(date) && !isToday(date)) return 'overdue';
  const days = differenceInDays(date, new Date());
  if (days <= 2) return 'soon';
  return 'ok';
}

export function getProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100);
}

export function computeProjectStatus(project: Project, tasks: Task[]): Project['status'] {
  if (tasks.length > 0 && tasks.every((t) => t.status === 'done')) return 'completed';
  const date = parseISO(project.dueDate);
  if (isPast(date) && !isToday(date)) return 'overdue';
  const days = differenceInDays(date, new Date());
  if (days <= 2) return 'in-progress';
  return project.status === 'not-started' ? 'not-started' : 'in-progress';
}

export const STATUS_LABELS: Record<Project['status'], string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
  overdue: 'Overdue',
};
