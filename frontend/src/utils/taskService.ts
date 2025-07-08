import api from "./axiosInstance";

export interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  priorityStats: Array<{ _id: string; count: number }>;
  typeStats: Array<{ _id: string; count: number }>;
  projectStats: Array<{ _id: string; count: number }>;
}

export const taskService = {
  // Get task statistics
  async getTaskStats(): Promise<TaskStats> {
    const response = await api.get("/tasks/stats");
    return response.data.data;
  },

  // Get all tasks
  async getAllTasks(params = {}) {
    const response = await api.get("/tasks", { params });
    return response.data.data;
  },

  // Get my tasks (assigned to current user)
  async getMyTasks(params = {}) {
    const response = await api.get("/tasks/my-tasks", { params });
    return response.data.data;
  },

  // Get tasks created by me
  async getTasksCreatedByMe(params = {}) {
    const response = await api.get("/tasks/created-by-me", { params });
    return response.data.data;
  },

  // Get task by ID
  async getTaskById(id: string) {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data.task;
  },

  // Create new task
  async createTask(taskData: Record<string, unknown>) {
    const response = await api.post("/tasks", taskData);
    return response.data.data.task;
  },

  // Update task
  async updateTask(id: string, taskData: Record<string, unknown>) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.data.task;
  },

  // Delete task
  async deleteTask(id: string) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Update task status
  async updateTaskStatus(id: string, status: string) {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data.data.task;
  },
};
