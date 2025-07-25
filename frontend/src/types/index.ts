export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  cedula?: string;
  fecha_nacimiento?: string;
  ocupacion?: string;
  empresa?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  capacity: number;
  location: string;
  image_url?: string;
  available_spots?: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  event_id: string;
  codigo_reserva: string;
  codigo_qr: string;
  numero_asistentes: number;
  estado: ReservationStatus;
  fecha_checkin?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  event?: Event;
}

export interface CheckInData {
  codigo?: string;
  email?: string;
  telefono?: string;
  event_id?: string;
}

export interface AdminStats {
  total_users: number;
  total_events: number;
  total_reservations: number;
  events_today: number;
  checkins_today: number;
  popular_categories: CategoryStats[];
  recent_activities: Activity[];
}

export interface CategoryStats {
  categoria: string;
  total_events: number;
  total_reservations: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user_email?: string;
}

export type EventCategory = 
  | "Cinema Dominicano"
  | "Cine Clásico" 
  | "Cine General"
  | "Talleres"
  | "Conciertos"
  | "Charlas/Conferencias"
  | "Exposiciones de Arte"
  | "Experiencias 3D Inmersivas";

export type EventStatus = "activo" | "cancelado" | "completado" | "borrador";

export type ReservationStatus = "confirmada" | "cancelada" | "asistio" | "no_asistio";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  cedula?: string;
  fecha_nacimiento?: string;
  ocupacion?: string;
  empresa?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// Global error logging interface
declare global {
  interface Window {
    logError?: (error: string, context: string, additionalInfo?: any) => void;
  }
}
