"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';
import axios from 'axios';

export interface User {
  id: string
  name?: string
  username?: string
  email?: string
  method?: "email" | "google" | "github"
  loginMethod?: string
  login_method?: string
  authMethod?: string
  auth_method?: string
  provider?: string
  createdAt?: string
  created_at?: string
  joinedAt?: string
  joined_at?: string
  registeredAt?: string
  registered_at?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<void>
  initializeUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  initializeUser: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Function to initialize user data
  const initializeUser = (userData: User) => {
    // Normalize user data to ensure it has all expected properties
    setUser({
      id: userData.id,
      name: userData.name || userData.username || "",
      email: userData.email || "",
      method: userData.method || userData.loginMethod || userData.login_method || userData.authMethod || userData.auth_method || userData.provider || "email",
      createdAt: userData.createdAt || userData.created_at || userData.joinedAt || userData.joined_at || userData.registeredAt || userData.registered_at || new Date().toISOString()
    });
    setLoading(false);
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch user data
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`);
          const userData = response.data.user;

          // Normalize user data to ensure it has all expected properties
          setUser({
            id: userData.id,
            name: userData.name || userData.username || "",
            email: userData.email || "",
            method: userData.method || userData.loginMethod || userData.login_method || userData.authMethod || userData.auth_method || userData.provider || "email",
            createdAt: userData.createdAt || userData.created_at || userData.joinedAt || userData.joined_at || userData.registeredAt || userData.registered_at || new Date().toISOString()
          });
        } catch (error) {
          // If token is invalid, remove it
          Cookies.remove('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    }

    checkAuth();
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token, user: userData } = response.data;

      // Store token in cookie
      Cookies.set('token', access_token, { expires: 7 });

      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Normalize user data to ensure it has all expected properties
      setUser({
        id: userData.id,
        name: userData.name || userData.username || "",
        email: userData.email || "",
        method: userData.method || userData.loginMethod || userData.login_method || userData.authMethod || userData.auth_method || userData.provider || "email",
        createdAt: userData.createdAt || userData.created_at || userData.joinedAt || userData.joined_at || userData.registeredAt || userData.registered_at || new Date().toISOString()
      });
    } finally {
      setLoading(false)
    }
  }

  // Signup function - This will be called by the backend after successful registration
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      const { access_token, user: userData } = response.data;

      // Store token in cookie
      Cookies.set('token', access_token, { expires: 7 });

      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Normalize user data to ensure it has all expected properties
      setUser({
        id: userData.id,
        name: userData.name || userData.username || "",
        email: userData.email || "",
        method: userData.method || userData.loginMethod || userData.login_method || userData.authMethod || userData.auth_method || userData.provider || "email",
        createdAt: userData.createdAt || userData.created_at || userData.joinedAt || userData.joined_at || userData.registeredAt || userData.registered_at || new Date().toISOString()
      });
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    router.push("/");
  }

  // Update profile function
  const updateProfile = async (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => {
    setLoading(true)
    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, data);
      const userData = response.data.user;

      // Normalize user data to ensure it has all expected properties
      setUser({
        id: userData.id,
        name: userData.name || userData.username || "",
        email: userData.email || "",
        method: userData.method || userData.loginMethod || userData.login_method || userData.authMethod || userData.auth_method || userData.provider || "email",
        createdAt: userData.createdAt || userData.created_at || userData.joinedAt || userData.joined_at || userData.registeredAt || userData.registered_at || new Date().toISOString()
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, initializeUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
