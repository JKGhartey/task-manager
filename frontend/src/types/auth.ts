export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  position?: string;
  dateOfBirth?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      status: string;
      isEmailVerified: boolean;
      avatar?: string;
      department?: string;
      position?: string;
    };
    token: string;
    emailVerificationToken?: string; // Optional for development/testing
  };
}
