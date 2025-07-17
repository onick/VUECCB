import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verificar si el token es válido haciendo una petición a los usuarios
      const response = await fetch('http://localhost:8004/api/admin/users?skip=0&limit=1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // El token es válido, pero necesitamos obtener los datos del usuario actual
        // Por ahora, simplemente marcar como autenticado
        setIsAuthenticated(true);
        
        // Intentar obtener datos del usuario del localStorage
        const userData = localStorage.getItem('user_data');
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      } else {
        // Token inválido, remover del localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8004/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };
}
