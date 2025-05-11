import { Task, Priority, Status, User, Notification } from '@/types';

// Mock users for development
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
  },
];

// Mock tasks for development
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft the initial project proposal for client review',
    dueDate: '2025-05-10',
    priority: 'high' as Priority,
    status: 'in-progress' as Status,
    createdBy: '1',
    assignedTo: '2',
    createdAt: '2025-05-01T10:00:00Z',
    updatedAt: '2025-05-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Review design mockups',
    description: 'Review and provide feedback on the UI/UX design mockups',
    dueDate: '2025-05-08',
    priority: 'medium' as Priority,
    status: 'todo' as Status,
    createdBy: '1',
    assignedTo: '3',
    createdAt: '2025-05-01T11:00:00Z',
    updatedAt: '2025-05-01T11:00:00Z',
  },
  {
    id: '3',
    title: 'Set up development environment',
    description: 'Configure local development environment and necessary tools',
    dueDate: '2025-05-05',
    priority: 'low' as Priority,
    status: 'done' as Status,
    createdBy: '2',
    assignedTo: '1',
    createdAt: '2025-05-01T12:00:00Z',
    updatedAt: '2025-05-02T09:00:00Z',
  },
  {
    id: '4',
    title: 'Weekly team meeting',
    description: 'Discuss project progress and next steps',
    dueDate: '2025-05-06',
    priority: 'medium' as Priority,
    status: 'todo' as Status,
    createdBy: '1',
    assignedTo: null,
    createdAt: '2025-05-02T08:00:00Z',
    updatedAt: '2025-05-02T08:00:00Z',
  },
  {
    id: '5',
    title: 'Client presentation',
    description: 'Prepare slides for the upcoming client presentation',
    dueDate: '2025-05-12',
    priority: 'high' as Priority,
    status: 'todo' as Status,
    createdBy: '2',
    assignedTo: '1',
    createdAt: '2025-05-02T14:00:00Z',
    updatedAt: '2025-05-02T14:00:00Z',
  },
];

// Mock notifications for development
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    message: 'You have been assigned a new task: Set up development environment',
    read: false,
    createdAt: '2025-05-01T12:00:00Z',
    taskId: '3',
  },
  {
    id: '2',
    userId: '2',
    message: 'You have been assigned a new task: Complete project proposal',
    read: true,
    createdAt: '2025-05-01T10:00:00Z',
    taskId: '1',
  },
  {
    id: '3',
    userId: '3',
    message: 'You have been assigned a new task: Review design mockups',
    read: false,
    createdAt: '2025-05-01T11:00:00Z',
    taskId: '2',
  },
  {
    id: '4',
    userId: '1',
    message: 'You have been assigned a new task: Client presentation',
    read: false,
    createdAt: '2025-05-02T14:00:00Z',
    taskId: '5',
  },
];

// Mock API functions
export const getTasks = () => {
  return Promise.resolve(mockTasks);
};

export const getTasksByUser = (userId: string) => {
  return Promise.resolve(
    mockTasks.filter((task) => task.assignedTo === userId || task.createdBy === userId)
  );
};

export const getTasksByAssignee = (userId: string) => {
  return Promise.resolve(mockTasks.filter((task) => task.assignedTo === userId));
};

export const getTasksByCreator = (userId: string) => {
  return Promise.resolve(mockTasks.filter((task) => task.createdBy === userId));
};

export const getOverdueTasks = (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  return Promise.resolve(
    mockTasks.filter(
      (task) =>
        (task.assignedTo === userId || task.createdBy === userId) &&
        task.dueDate < today &&
        task.status !== 'done'
    )
  );
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newTask: Task = {
    ...task,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTasks.push(newTask);
  return Promise.resolve(newTask);
};

export const updateTask = (taskId: string, updates: Partial<Task>) => {
  const index = mockTasks.findIndex((task) => task.id === taskId);
  if (index !== -1) {
    mockTasks[index] = {
      ...mockTasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(mockTasks[index]);
  }
  return Promise.reject(new Error('Task not found'));
};

export const deleteTask = (taskId: string) => {
  const index = mockTasks.findIndex((task) => task.id === taskId);
  if (index !== -1) {
    const deletedTask = mockTasks.splice(index, 1)[0];
    return Promise.resolve(deletedTask);
  }
  return Promise.reject(new Error('Task not found'));
};

export const getUsers = () => {
  return Promise.resolve(mockUsers);
};

export const getUserById = (userId: string) => {
  const user = mockUsers.find((user) => user.id === userId);
  if (user) {
    return Promise.resolve(user);
  }
  return Promise.reject(new Error('User not found'));
};

export const getNotificationsByUser = (userId: string) => {
  return Promise.resolve(
    mockNotifications.filter((notification) => notification.userId === userId)
  );
};

export const markNotificationAsRead = (notificationId: string) => {
  const index = mockNotifications.findIndex(
    (notification) => notification.id === notificationId
  );
  if (index !== -1) {
    mockNotifications[index] = {
      ...mockNotifications[index],
      read: true,
    };
    return Promise.resolve(mockNotifications[index]);
  }
  return Promise.reject(new Error('Notification not found'));
};

export const createNotification = (
  userId: string,
  message: string,
  taskId?: string
) => {
  const newNotification: Notification = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    taskId,
  };
  mockNotifications.push(newNotification);
  return Promise.resolve(newNotification);
};