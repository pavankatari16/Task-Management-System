export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done' | 'blocked';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
}