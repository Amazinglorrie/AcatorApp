import { ProjectColor } from './types';

export const Colors = {
  blue: '#378ADD',
  amber: '#BA7517',
  green: '#639922',
  red: '#E24B4A',
  purple: '#7F77DD',
  teal: '#1D9E75',

  badgeBg: {
    blue: '#E6F1FB',
    amber: '#FAEEDA',
    green: '#EAF3DE',
    red: '#FCEBEB',
    purple: '#EEEDFE',
    teal: '#E1F5EE',
  },
  badgeText: {
    blue: '#0C447C',
    amber: '#633806',
    green: '#27500A',
    red: '#791F1F',
    purple: '#3C3489',
    teal: '#085041',
  },

  background: '#F2F2F7',
  card: '#FFFFFF',
  label: '#6E6E73',
  separator: 'rgba(0,0,0,0.1)',
  accent: '#007AFF',
  destructive: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  textPrimary: '#1A1A1A',
  textSecondary: '#6E6E73',
  textTertiary: '#AEAEB2',
};

export const colorBarFill: Record<ProjectColor, string> = {
  blue: Colors.blue,
  amber: Colors.amber,
  green: Colors.green,
  red: Colors.red,
  purple: Colors.purple,
  teal: Colors.teal,
};

export const PROJECT_SUBJECTS = [
  'Science',
  'Mathematics',
  'Humanities',
  'Computer Science',
  'English',
  'Art',
  'History',
  'Geography',
  'Languages',
  'Physical Education',
  'Other',
];

export const PROJECT_COLORS: ProjectColor[] = [
  'blue',
  'amber',
  'green',
  'red',
  'purple',
  'teal',
];
