import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, LoginCredentials, RegisterData } from "@/types";

// Constantes locales
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    ME: '/api/me'
  }
};

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data'
};

// Cliente API simple
const API_BASE_URL = 'http://localhost:8004';

const apiClient = {
  post: async (endpoint: string, data: any) => {
    const response = await fetch(API_BASE_URL + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  },
  get: async (endpoint: string) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const response = await fetch(API_BASE_URL + endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          
          const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
          
          if (response.access_token && response.user) {
            const token = response.access_token;
            const user = response.user;
            
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return response; // Retornar la respuesta para poder verificar el rol
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true });
          
          const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
          
          if (response.access_token && response.user) {
            const token = response.access_token;
            const user = response.user;
            
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Limpiar localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        // Limpiar estado de la store
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Limpiar también la persistencia de Zustand
        localStorage.removeItem('auth-storage');
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
          
          if (!token) {
            set({ isAuthenticated: false, user: null, token: null });
            return;
          }

          set({ isLoading: true });
          
          const user = await apiClient.get(API_ENDPOINTS.AUTH.ME);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token is invalid
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: STORAGE_KEYS.USER_DATA,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
