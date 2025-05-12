import { useEffect, useState } from "react";

interface User {
  id?: string;
  name: string;
  username?: string;
  rol?: string; // <-- adaugă aici rolul!

}

export default function useAuth() {
  // Initialize user from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Check token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in useAuth:", token);

    // If we have a token but no user, try to parse user from token
    if (token && !user) {
      try {
        // For JWT, you might want to decode the payload to get user info
        // For now, we'll just use what's in localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error parsing user from token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [user]);

  // Store user in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/jucatori/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data); // Check the actual structure

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      const token = data.token || data.data?.token || data.accessToken;
      if (!token) {
        console.error("No token found in response:", data);
        throw new Error("Authentication token not found in response");
      }
      // Store the JWT token
      localStorage.setItem("token", data.data.token);

      // Create user object from response
      const userData: User = {
        name: username, // or use data.username if provided in response
        // Add other user properties if available in response
      };

      setUser(userData);
      return { success: true, user: userData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/jucator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!localStorage.getItem("token"),
  };
}
