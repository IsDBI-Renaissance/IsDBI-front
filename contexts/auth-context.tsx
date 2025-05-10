"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';
import axios from 'axios';

export interface User {
  id: string
  name: string
  email: string
  method: "email" | "google" | "github"
  createdAt: string
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
    setUser(userData);
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
          const response = await axios.get('http://localhost:3000/api/auth/me');
          setUser(response.data.user);
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
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const { access_token, user: userData } = response.data;
      
      // Store token in cookie
      Cookies.set('token', access_token, { expires: 7 });
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
    } finally {
      setLoading(false)
    }
  }

  // Signup function - This will be called by the backend after successful registration
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name,
        email,
        password,
      });

      const { access_token, user: userData } = response.data;
      
      // Store token in cookie
      Cookies.set('token', access_token, { expires: 7 });
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
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
      const response = await axios.patch('http://localhost:3000/api/auth/profile', data);
      setUser(response.data.user);
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
