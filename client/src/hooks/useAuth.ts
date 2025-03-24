import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const MOCK_USER: User = {
  id: "mock-user-123",
  name: "Demo User",
  email: "demo@monopoly.com",
  avatar: "https://i.pravatar.cc/150?img=3",
};

export default function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    // Load from localStorage on initial load
    const savedUser = localStorage.getItem("mockAuth");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("mockAuth", JSON.stringify(user));
    } else {
      localStorage.removeItem("mockAuth");
    }
  }, [user]);

  const login = () => {
    // Simulate async OAuth flow
    setTimeout(() => {
      setUser(MOCK_USER);
    }, 300);
  };
  const register = () => {
    // Simulate async registration flow
    setTimeout(() => {
      setUser(MOCK_USER);
    }, 300);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
