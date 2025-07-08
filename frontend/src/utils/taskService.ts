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

export interface Task {
  _id: string;
  title: string;
  description: string;
  type: "feature" | "bug" | "improvement" | "documentation" | "maintenance";
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "pending"
    | "in_progress"
    | "review"
    | "testing"
    | "done"
    | "cancelled";
  assignee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    department?: string;
    position?: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    department?: string;
    position?: string;
  };
  project?: string;
  department?: string;
  dueDate?: string;
  startDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments: string[];
  comments: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
    content: string;
    timestamp: string;
  }>;
  subtasks: Array<{
    title: string;
    description?: string;
    completed: boolean;
    completedBy?: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    completedAt?: string;
  }>;
  dependencies: string[];
  relatedTasks: string[];
  progress: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  type?: "feature" | "bug" | "improvement" | "documentation" | "maintenance";
  priority?: "low" | "medium" | "high" | "urgent";
  assignee: string;
  project?: string;
  department?: string;
  dueDate?: string;
  estimatedHours?: number;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface TaskFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  type?: string;
  assignee?: string;
  project?: string;
  department?: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationResponse;
}

export const taskService = {
  // Get task statistics
  async getTaskStats(): Promise<TaskStats> {
    const response = await api.get("/tasks/stats");
    return response.data.data;
  },

  // Get all tasks
  async getAllTasks(params: TaskFilters = {}): Promise<TasksResponse> {
    const response = await api.get("/tasks", { params });
    return response.data.data;
  },

  // Get my tasks (assigned to current user)
  async getMyTasks(params: TaskFilters = {}): Promise<TasksResponse> {
    const response = await api.get("/tasks/my-tasks", { params });
    return response.data.data;
  },

  // Get tasks created by me
  async getTasksCreatedByMe(params: TaskFilters = {}): Promise<TasksResponse> {
    const response = await api.get("/tasks/created-by-me", { params });
    return response.data.data;
  },

  // Get task by ID
  async getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data.task;
  },

  // Create new task
  async createTask(taskData: CreateTaskData): Promise<Task> {
    const response = await api.post("/tasks", taskData);
    return response.data.data.task;
  },

  // Update task
  async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.data.task;
  },

  // Delete task
  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Update task status
  async updateTaskStatus(id: string, status: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data.data.task;
  },

  // Add comment to task
  async addComment(id: string, content: string): Promise<Task> {
    const response = await api.post(`/tasks/${id}/comments`, { content });
    return response.data.data.task;
  },

  // Add subtask to task
  async addSubtask(
    id: string,
    title: string,
    description?: string
  ): Promise<Task> {
    const response = await api.post(`/tasks/${id}/subtasks`, {
      title,
      description,
    });
    return response.data.data.task;
  },

  // Complete subtask
  async completeSubtask(id: string, subtaskIndex: number): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/subtasks/${subtaskIndex}`);
    return response.data.data.task;
  },
};
