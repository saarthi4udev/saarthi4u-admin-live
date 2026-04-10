// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface User {
  id: string;
  email: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { token } = response.data;

      // ✅ Set default header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,{
          withCredentials: true,
        }
      );

      const user = userResponse.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
