/**
 * API Service - Central API client for CCB Platform
 * Handles all communication with the FastAPI backend
 */

import { categoryToEnglish, categoryToSpanish } from '@/utils/eventUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8004';

interface ApiResponse<T = any> {
  message: string;
  data?: T;
  success?: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  capacity: number;
  location: string;
  image_url?: string;
  price?: number;
  tags?: string[];
  requirements?: string;
  contact_info?: any;
  published?: boolean;
  available_spots?: number;
  created_at: string;
  updated_at?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  location?: string;
  is_admin: boolean;
  created_at: string;
  updated_at?: string;
  total_reservations?: number;
  attended_events?: number;
  attendance_rate?: number;
  last_activity?: string;
  status?: 'active' | 'inactive' | 'admin' | 'deleted';
}

interface UserCreate {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
  location?: string;
  is_admin?: boolean;
}

interface UserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  age?: number;
  location?: string;
  is_admin?: boolean;
}

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

interface EventCreate {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  capacity: number;
  location: string;
  image_url?: string;
  price?: number;
  tags?: string[];
  requirements?: string;
  contact_info?: any;
  published?: boolean;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    // Get token from localStorage if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
      console.log('Using token for', endpoint, ':', token.substring(0, 20) + '...');
    } else {
      console.log('No token found for', endpoint);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
          throw new Error('Unauthorized');
        }
        
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Events API
  async getEvents(): Promise<Event[]> {
    try {
      const response = await this.request<Event[]>('/api/events');
      // Handle both direct array response and wrapped response
      const events = Array.isArray(response) ? response : response.data || [];
      
      // Convert English categories to Spanish for display
      return events.map(event => ({
        ...event,
        category: categoryToSpanish(event.category)
      }));
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }

  async getEvent(id: string): Promise<Event> {
    const response = await this.request<Event>(`/api/events/${id}`);
    return response.data || response;
  }

  async createEvent(eventData: EventCreate): Promise<Event> {
    // Convert Spanish category to English for API
    const apiEventData = {
      ...eventData,
      category: categoryToEnglish(eventData.category),
      contact_info: typeof eventData.contact_info === 'object' 
        ? `${eventData.contact_info.email} | ${eventData.contact_info.phone}`
        : eventData.contact_info
    };

    const response = await this.request<Event>('/api/events', {
      method: 'POST',
      body: JSON.stringify(apiEventData)
    });
    
    const event = response.data || response;
    // Convert category back to Spanish for frontend
    return {
      ...event,
      category: categoryToSpanish(event.category)
    };
  }

  async updateEvent(id: string, eventData: Partial<EventCreate>): Promise<Event> {
    const response = await this.request<Event>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
    return response.data || response;
  }

  async deleteEvent(id: string): Promise<void> {
    await this.request(`/api/events/${id}`, {
      method: 'DELETE'
    });
  }

  // Auth API
  async login(email: string, password: string): Promise<{ access_token: string; user: any }> {
    const response = await this.request<{ access_token: string; user: any }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Backend returns token directly, not wrapped in data
    const result = response.data || response;
    
    if (result.access_token) {
      localStorage.setItem('auth_token', result.access_token);
      console.log('Token saved:', result.access_token.substring(0, 20) + '...');
    } else {
      console.error('No access_token in response:', result);
    }
    
    return result;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    // Note: No logout endpoint in current backend, just remove token
  }

  async getProfile(): Promise<any> {
    const response = await this.request('/api/me');
    return response.data || response;
  }

  // Dashboard API
  async getDashboardStats(): Promise<any> {
    const response = await this.request('/api/dashboard/stats');
    return response.data || response;
  }

  // Categories API
  async getEventCategories(): Promise<string[]> {
    const response = await this.request<{ categories: string[] }>('/api/events/categories/list');
    return response.data?.categories || [];
  }

  // Users API
  async getUsers(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    status_filter?: string;
    location_filter?: string;
    age_min?: number;
    age_max?: number;
    sort_by?: string;
    sort_order?: string;
  }): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
      if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status_filter) queryParams.append('status_filter', params.status_filter);
      if (params.location_filter) queryParams.append('location_filter', params.location_filter);
      if (params.age_min !== undefined) queryParams.append('age_min', params.age_min.toString());
      if (params.age_max !== undefined) queryParams.append('age_max', params.age_max.toString());
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    }

    const url = `/api/admin/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await this.request<UsersResponse>(url);
    return response.data || response;
  }

  async getUser(id: string): Promise<User> {
    const response = await this.request<User>(`/api/admin/users/${id}`);
    return response.data || response;
  }

  async createUser(userData: UserCreate): Promise<User> {
    const response = await this.request<User>('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response.data || response;
  }

  async updateUser(id: string, userData: UserUpdate): Promise<User> {
    const response = await this.request<User>(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return response.data || response;
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/api/admin/users/${id}`, {
      method: 'DELETE'
    });
  }

  async bulkUserAction(action: string, userIds: string[]): Promise<any> {
    const response = await this.request('/api/admin/users/bulk-action', {
      method: 'POST',
      body: JSON.stringify({
        action,
        user_ids: userIds
      })
    });
    return response.data || response;
  }

  // Dashboard Analytics Methods
  async getDashboardStats(): Promise<any> {
    const response = await this.request('/api/dashboard/stats');
    return response.data;
  }

  async getQuickStats(): Promise<any> {
    const response = await this.request('/api/dashboard/quick-stats');
    return response.data;
  }

  async getSystemStatus(): Promise<any> {
    const response = await this.request('/api/dashboard/system-status');
    return response.data;
  }

  async getActivityFeed(limit: number = 20): Promise<any> {
    const response = await this.request(`/api/dashboard/activity-feed?limit=${limit}`);
    return response.data;
  }

  async getMonthlyAttendanceChart(): Promise<any> {
    const response = await this.request('/api/dashboard/charts/monthly-attendance');
    return response.data;
  }

  async getCategoriesDistributionChart(): Promise<any> {
    const response = await this.request('/api/dashboard/charts/categories-distribution');
    return response.data;
  }

  async getWeeklyTrendsChart(): Promise<any> {
    const response = await this.request('/api/dashboard/charts/weekly-trends');
    return response.data;
  }

  async getOccupancyRatesChart(): Promise<any> {
    const response = await this.request('/api/dashboard/charts/occupancy-rates');
    return response.data;
  }
}

export const apiService = new ApiService();
export type { Event, EventCreate, User, UserCreate, UserUpdate, UsersResponse, ApiResponse };
