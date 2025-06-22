export interface User {
  id: number;
  name: string;
  email: string;
  isAuthenticated: boolean;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
