import api from "./axiosInstance";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  tasks: Task[];
  team?: Team;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee?: User;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  members?: User[];
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  team?: string;
  tasks?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  team?: string;
  tasks?: string[];
}

export interface ProjectFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProjectResponse {
  success: boolean;
  data: {
    projects: Project[];
  };
}

export interface SingleProjectResponse {
  success: boolean;
  data: {
    project: Project;
  };
}

export interface PaginatedProjectResponse {
  success: boolean;
  data: {
    projects: Project[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get<ProjectResponse>("/projects");
    return response.data.data.projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};

// Get project by ID
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await api.get<SingleProjectResponse>(`/projects/${id}`);
    return response.data.data.project;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("Failed to fetch project");
  }
};

// Create new project
export const createProject = async (
  data: CreateProjectRequest
): Promise<Project> => {
  try {
    const response = await api.post<SingleProjectResponse>("/projects", data);
    return response.data.data.project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
};

// Update project
export const updateProject = async (
  id: string,
  data: UpdateProjectRequest
): Promise<Project> => {
  try {
    const response = await api.put<SingleProjectResponse>(
      `/projects/${id}`,
      data
    );
    return response.data.data.project;
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
};

// Assign task to project
export const assignTaskToProject = async (
  projectId: string,
  taskId: string
): Promise<Project> => {
  try {
    const response = await api.post<SingleProjectResponse>(
      `/projects/${projectId}/assign-task`,
      { taskId }
    );
    return response.data.data.project;
  } catch (error) {
    console.error("Error assigning task to project:", error);
    throw new Error("Failed to assign task to project");
  }
};

// Remove task from project
export const removeTaskFromProject = async (
  projectId: string,
  taskId: string
): Promise<Project> => {
  try {
    const response = await api.post<SingleProjectResponse>(
      `/projects/${projectId}/remove-task`,
      { taskId }
    );
    return response.data.data.project;
  } catch (error) {
    console.error("Error removing task from project:", error);
    throw new Error("Failed to remove task from project");
  }
};
