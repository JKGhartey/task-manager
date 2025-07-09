import api from "./axiosInstance";

export interface Department {
  _id: string;
  name: string;
  description?: string;
  manager?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  status: "active" | "inactive" | "archived";
  code?: string;
  location?: string;
  budget?: number;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  manager?: string;
  status?: "active" | "inactive" | "archived";
  code?: string;
  location?: string;
  budget?: number;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  manager?: string;
  status?: "active" | "inactive" | "archived";
  code?: string;
  location?: string;
  budget?: number;
}

export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  statusBreakdown: Array<{
    _id: string;
    count: number;
    totalEmployees: number;
    avgBudget: number;
  }>;
  topDepartments: Department[];
  recentDepartments: number;
}

export interface DepartmentResponse {
  success: boolean;
  data: {
    departments: Department[];
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

export interface SingleDepartmentResponse {
  success: boolean;
  data: {
    department: Department;
    employees?: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      position?: string;
      avatar?: string;
    }>;
  };
}

export interface DepartmentStatsResponse {
  success: boolean;
  data: DepartmentStats;
}

// Get all departments with pagination and filtering (Admin only)
export const getDepartments = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string
): Promise<DepartmentResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append("search", search);
  if (status) params.append("status", status);

  const response = await api.get(`/departments?${params.toString()}`);
  return response.data;
};

// Get all departments with pagination and filtering (All authenticated users)
export const getPublicDepartments = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string
): Promise<DepartmentResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append("search", search);
  if (status) params.append("status", status);

  const response = await api.get(`/departments/public?${params.toString()}`);
  return response.data;
};

// Get department by ID
export const getDepartmentById = async (
  id: string
): Promise<SingleDepartmentResponse> => {
  const response = await api.get(`/departments/${id}`);
  return response.data;
};

// Create new department
export const createDepartment = async (
  data: CreateDepartmentRequest
): Promise<SingleDepartmentResponse> => {
  const response = await api.post("/departments", data);
  return response.data;
};

// Update department
export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentRequest
): Promise<SingleDepartmentResponse> => {
  const response = await api.put(`/departments/${id}`, data);
  return response.data;
};

// Delete department
export const deleteDepartment = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};

// Get department statistics
export const getDepartmentStats =
  async (): Promise<DepartmentStatsResponse> => {
    const response = await api.get("/departments/stats");
    return response.data;
  };

// Get active departments for dropdown (Admin only)
export const getActiveDepartments = async (): Promise<{
  success: boolean;
  data: { departments: Department[] };
}> => {
  const response = await api.get("/departments/active");
  return response.data;
};

// Get active departments for dropdown (All authenticated users)
export const getPublicActiveDepartments = async (): Promise<{
  success: boolean;
  data: { departments: Department[] };
}> => {
  const response = await api.get("/departments/public/active");
  return response.data;
};
