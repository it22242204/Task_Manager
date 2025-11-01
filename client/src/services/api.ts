import axios from 'axios';
import { Task, TaskFormData, User, ApiResponse } from '../types';
import { UpdateTaskData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TaskService = {
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>('/tasks');
      console.log('GET /tasks →', response.data); // DEBUG
      return response.data;
    } catch (error: any) {
      console.error('GET /tasks error:', error.response?.data);
      throw error;
    }
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

 // src/services/api.ts
createTask: async (task: {
  title: string;
  description: string;
  assigneeId?: number | null;
  creatorId: number;       
  dueDate?: string | null;
}): Promise<Task> => {
  try {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  } catch (error: any) {
    console.error('api.ts createTask error:', error.response?.data);
    throw error;
  }
},


updateTask: async (id: number, task: UpdateTaskData): Promise<Task> => {
  try {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  } catch (error: any) {
    console.error('updateTask error:', error.response?.data);
    throw error;
  }
},

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggleTaskCompletion: async (id: number): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
    return response.data.data;
  },
};

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users');
    //   console.log('Raw API response:', response.data); // ← DEBUG
      return response.data; // ← Just return the array!
    } catch (error: any) {
      console.error('Error fetching users:', error.response?.data || error.message);
      throw error;
    }
  },

  getUser: async (id: number): Promise<User & { tasks: Task[]; createdTasks: Task[] }> => {
    const response = await api.get<ApiResponse<User & { tasks: Task[]; createdTasks: Task[] }>>(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (userData: { name: string; email: string }): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  },

  updateUser: async (id: number, userData: { name: string; email: string }): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

deleteUser: async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
    console.log(`User ${id} deleted`);
  } catch (error: any) {
    console.error('DELETE USER ERROR:', error.response?.data);
    throw error;
  }
},
};