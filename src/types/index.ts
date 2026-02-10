export type TaskStatus = 'todo' | 'in-progress' | 'pending-approval' | 'completed';
export type ActivityType = 'agent' | 'human' | 'system';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: 'agent' | 'human';
  assigneeName: string;
  createdAt: string;
  frequency: 'one-time' | 'recurring';
  schedule?: string;
  isPaused?: boolean;
  promptQueue?: Array<{ id: string; text: string; executed: boolean }>;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  taskId?: string;
  taskTitle?: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}
