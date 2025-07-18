"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SystemStatus from '@/components/SystemStatus';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Ticket, 
  TrendingUp, 
  Clock, 
  Eye,
  Plus,
  Settings,
  Bell,
  Download,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { AdminStats, Activity, Event } from '@/types';
import { apiService } from '@/services/api';

interface DashboardMetrics {
  totalEvents: number;
  totalUsers: number;
  totalReservations: number;
  todayCheckIns: number;
  activeEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  occupancyRate: number;
}

interface TopEvent {
  id: string;
  title: string;
  category: string;
  reservations: number;
  capacity: number;
  date: string;
  status: 'activo' | 'proximo' | 'completado';
  occupancyRate: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalEvents: 0,
    totalUsers: 0,
    totalReservations: 0,
    todayCheckIns: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    occupancyRate: 0
  });

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  // Cargar datos del dashboard
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🎯 AdminDashboard: Loading dashboard data...');
      
      // Hacer llamadas reales a la API
      const [adminStats, events] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getEvents()
      ]);
      
      console.log('✅ AdminDashboard: Admin stats:', adminStats);
      console.log('✅ AdminDashboard: Events:', events);
      
      // Calcular métricas del dashboard
      const activeEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        return eventDate >= today;
      }).length;
      
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return eventDate > today && eventDate <= nextWeek;
      }).length;
      
      const completedEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        return eventDate < today;
      }).length;
      
      const metrics: DashboardMetrics = {
        totalEvents: adminStats.total_events || events.length,
        totalUsers: adminStats.total_users || 0,
        totalReservations: adminStats.total_reservations || 0,
        todayCheckIns: adminStats.total_checkins || 0,
        activeEvents,
        upcomingEvents,
        completedEvents,
        occupancyRate: adminStats.total_reservations > 0 ? 
          (adminStats.total_checkins / adminStats.total_reservations * 100) : 0
      };
      
      console.log('✅ AdminDashboard: Calculated metrics:', metrics);
      
      // Actividad reciente mock (por ahora)
      const mockActivity: Activity[] = [
        {
          id: '1',
          type: 'event_created',
          description: 'Dashboard cargado con datos reales',
          timestamp: new Date().toISOString(),
          user_email: 'admin@culturalcenter.com'
        },
        {
          id: '2',
          type: 'reservation',
          description: 'Nueva reserva para "Exposición de Arte Moderno"',
          timestamp: '2025-01-15T09:45:00Z',
          user_email: 'maria.rodriguez@email.com'
        },
        {
          id: '3',
          type: 'check_in',
          description: 'Check-in realizado para "Taller de Fotografía"',
          timestamp: '2025-01-15T08:20:00Z',
          user_email: 'carlos.martinez@email.com'
        },
        {
          id: '4',
          type: 'user_registered',
          description: 'Nuevo usuario registrado en la plataforma',
          timestamp: '2025-01-15T07:15:00Z',
          user_email: 'ana.garcia@email.com'
        }
      ];

      // Generar top events basados en los eventos reales
      const topEvents: TopEvent[] = events.slice(0, 4).map(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        const reservations = Math.floor(Math.random() * event.capacity * 0.8) + 5; // Simulado
        
        return {
          id: event.id,
          title: event.title,
          category: event.category,
          reservations,
          capacity: event.capacity,
          date: event.date,
          status: eventDate > today ? 'proximo' : 'activo',
          occupancyRate: Math.round((reservations / event.capacity) * 100)
        };
      });

      console.log('✅ AdminDashboard: Top events:', topEvents);

      setMetrics(metrics);
      setRecentActivity(mockActivity);
      setTopEvents(topEvents);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error loading dashboard data';
      console.error('🚨 AdminDashboard: Error loading dashboard data:', error);
      
      // Log error to our error logger
      if (window.logError) {
        window.logError(errorMsg, 'AdminDashboard - loadDashboardData()', {
          error: error instanceof Error ? error.stack : error,
          timestamp: new Date().toISOString(),
          location: 'AdminDashboard.loadDashboardData'
        });
      }
      
      // Set fallback data on error
      setMetrics({
        totalEvents: 0,
        totalUsers: 0,
        totalReservations: 0,
        todayCheckIns: 0,
        activeEvents: 0,
        upcomingEvents: 0,
        completedEvents: 0,
        occupancyRate: 0
      });
      setRecentActivity([]);
      setTopEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'event_created':
        return <Plus className="w-4 h-4" />;
      case 'reservation':
        return <Ticket className="w-4 h-4" />;
      case 'check_in':
        return <CheckCircle className="w-4 h-4" />;
      case 'user_registered':
        return <Users className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'event_created':
        return 'text-green-600 bg-green-50';
      case 'reservation':
        return 'text-blue-600 bg-blue-50';
      case 'check_in':
        return 'text-purple-600 bg-purple-50';
      case 'user_registered':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'activo':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'proximo':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completado':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ccb-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Vista general del sistema de gestión cultural
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue"
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 3 meses</option>
          </select>
          
          <button className="px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* System Status */}
      <SystemStatus className="mb-6" />

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Eventos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalEvents}</p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +12% vs mes anterior
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-8 h-8 text-ccb-blue" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +8% vs mes anterior
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reservas</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalReservations}</p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +15% vs mes anterior
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Ticket className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Check-ins Hoy</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.todayCheckIns}</p>
              <p className="text-sm text-orange-600 mt-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Últimas 24 horas
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Estado de Eventos y Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado de Eventos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estado de Eventos</h3>
            <Link href="/admin/events" className="text-ccb-blue hover:text-ccb-blue/80 text-sm font-medium">
              Ver todos →
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.activeEvents}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.upcomingEvents}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Próximos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{metrics.completedEvents}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completados</div>
            </div>
          </div>

          {/* Gráfico de ocupación */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tasa de Ocupación General</span>
              <span className="text-sm font-bold text-ccb-blue">{metrics.occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-ccb-blue to-ccb-lightblue h-3 rounded-full transition-all duration-500"
                style={{ width: `${metrics.occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Acciones Rápidas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
          
          <div className="space-y-3">
            <Link 
              href="/admin/events/create" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                <Plus className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Crear Evento</span>
            </Link>

            <Link 
              href="/admin/users" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gestionar Usuarios</span>
            </Link>

            <Link 
              href="/admin/reports" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ver Reportes</span>
            </Link>

            <Link 
              href="/admin/checkin" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Check-in Manual</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Top Events y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Eventos Más Populares</h3>
            <Link href="/admin/events" className="text-ccb-blue hover:text-ccb-blue/80 text-sm font-medium">
              Ver todos →
            </Link>
          </div>

          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-ccb-blue/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-ccb-blue">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={getStatusBadge(event.status)}>{event.status}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {event.reservations}/{event.capacity}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {event.occupancyRate.toFixed(1)}%
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                    <div 
                      className="bg-ccb-blue h-1 rounded-full transition-all duration-300"
                      style={{ width: `${event.occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actividad Reciente */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Actividad Reciente</h3>
            <button className="text-ccb-blue hover:text-ccb-blue/80 text-sm font-medium">
              Ver todas →
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  {activity.user_email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.user_email}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDate(activity.timestamp)} a las {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}