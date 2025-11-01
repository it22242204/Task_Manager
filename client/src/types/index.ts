export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  assigneeId?: number | null;
  creatorId?: number | null;  
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  userId?: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  assigneeId?: number | null;
}

export interface UpdateTaskData extends TaskFormData {
  completed?: boolean;  // ← Allow for toggle
}