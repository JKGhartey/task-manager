import api from "./axiosInstance";

export interface Team {
  _id: string;
  name: string;
  description?: string;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  members?: string[];
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  members?: string[];
}

export interface TeamFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface TeamResponse {
  success: boolean;
  data: {
    teams: Team[];
  };
}

export interface SingleTeamResponse {
  success: boolean;
  data: {
    team: Team;
  };
}

export interface PaginatedTeamResponse {
  success: boolean;
  data: {
    teams: Team[];
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

// Get all teams
export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.get<TeamResponse>("/teams");
    return response.data.data.teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }
};

// Get team by ID
export const getTeamById = async (id: string): Promise<Team> => {
  try {
    const response = await api.get<SingleTeamResponse>(`/teams/${id}`);
    return response.data.data.team;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw new Error("Failed to fetch team");
  }
};

// Create new team
export const createTeam = async (data: CreateTeamRequest): Promise<Team> => {
  try {
    const response = await api.post<SingleTeamResponse>("/teams", data);
    return response.data.data.team;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Failed to create team");
  }
};

// Update team
export const updateTeam = async (
  id: string,
  data: UpdateTeamRequest
): Promise<Team> => {
  try {
    const response = await api.put<SingleTeamResponse>(`/teams/${id}`, data);
    return response.data.data.team;
  } catch (error) {
    console.error("Error updating team:", error);
    throw new Error("Failed to update team");
  }
};

// Delete team
export const deleteTeam = async (id: string): Promise<void> => {
  try {
    await api.delete(`/teams/${id}`);
  } catch (error) {
    console.error("Error deleting team:", error);
    throw new Error("Failed to delete team");
  }
};

// Assign user to team
export const assignUserToTeam = async (
  teamId: string,
  userId: string
): Promise<Team> => {
  try {
    const response = await api.post<SingleTeamResponse>(
      `/teams/${teamId}/assign-user`,
      { userId }
    );
    return response.data.data.team;
  } catch (error) {
    console.error("Error assigning user to team:", error);
    throw new Error("Failed to assign user to team");
  }
};

// Remove user from team
export const removeUserFromTeam = async (
  teamId: string,
  userId: string
): Promise<Team> => {
  try {
    const response = await api.post<SingleTeamResponse>(
      `/teams/${teamId}/remove-user`,
      { userId }
    );
    return response.data.data.team;
  } catch (error) {
    console.error("Error removing user from team:", error);
    throw new Error("Failed to remove user from team");
  }
};
