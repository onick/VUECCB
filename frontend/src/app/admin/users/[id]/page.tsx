'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Activity, 
  Edit,
  ArrowLeft,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@/services/api';
import { apiService } from '@/services/api';

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, [params.id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await apiService.getUser(params.id);
      console.log('Usuario cargado:', userData);
      
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name}? Esta acción no se puede deshacer.`)) {
      try {
        await apiService.deleteUser(user.id);
        router.push('/admin/users');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ccb-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar usuario</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a usuarios
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Usuario no encontrado</h2>
          <p className="text-yellow-600 mb-4">El usuario solicitado no existe o ha sido eliminado.</p>
          <Link 
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a usuarios
          </Link>
        </div>
      </div>
    );
  }

  const attendanceRate = user.attendance_rate || 0;
  const statusColor = user.is_admin ? 'bg-purple-100 text-purple-800' : 
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/users"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Perfil de Usuario
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Información completa del usuario
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={handleDeleteUser}
            className="px-4 py-2 text-red-600 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
          >
            <XCircle className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
          
          <Link 
            href={`/admin/users/${user.id}/edit`}
            className="px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main user info */}
        <div className="lg:col-span-2 space-y-6">
          {/* User header card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-ccb-blue to-ccb-lightblue rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* User info */}
                <div className="flex-grow">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h2>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                      {user.is_admin ? 'Administrador' : user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                    {user.is_admin && (
                      <Shield className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {user.location && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* User details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-ccb-blue" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nombre completo</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-ccb-blue" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-ccb-blue" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {user.age && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-ccb-blue" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Edad</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.age} años
                      </p>
                    </div>
                  </div>
                )}
                
                {user.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-ccb-blue" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.location}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-ccb-blue" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Miembro desde</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Historial de Actividad
            </h3>
            
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Historial de reservas próximamente
              </p>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Estadísticas
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-ccb-blue mb-1">
                  {attendanceRate.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tasa de asistencia
                </p>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-ccb-blue to-ccb-lightblue h-3 rounded-full transition-all duration-300"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.total_reservations || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Reservas
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.attended_events || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Asistencias
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h3>
            
            <div className="space-y-3">
              <Link 
                href={`/admin/users/${user.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Usuario
              </Link>
              
              <button className="w-full flex items-center justify-center px-4 py-2 text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Actividad
              </button>
              
              <button 
                onClick={handleDeleteUser}
                className="w-full flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Eliminar Usuario
              </button>
            </div>
          </motion.div>

          {/* User metadata */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Metadatos
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Creado:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(user.created_at).toLocaleDateString('es-ES')}
                </span>
              </div>
              {user.updated_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Actualizado:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(user.updated_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
              {user.last_activity && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Última actividad:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(user.last_activity).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">ID:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs">
                  {user.id}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}