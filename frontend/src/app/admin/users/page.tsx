'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Shield,
  UserCheck,
  UserX,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { User, apiService } from '@/services/api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadUsers();
  }, [searchTerm, statusFilter, sortBy, sortOrder, page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getUsers({
        skip: page * limit,
        limit,
        search: searchTerm || undefined,
        status_filter: statusFilter === 'all' ? undefined : statusFilter,
        sort_by: sortBy,
        sort_order: sortOrder
      });
      
      console.log('Usuarios cargados:', response);
      setUsers(response.users || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error al cargar usuarios. Verifica la conexión con el servidor.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el usuario "${userName}"?`)) {
      try {
        await apiService.deleteUser(userId);
        alert('Usuario eliminado exitosamente');
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert(`Error al eliminar usuario: ${errorMessage}`);
      }
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'active':
        return <UserCheck className="w-4 h-4" />;
      case 'inactive':
        return <UserX className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Administra los usuarios del sistema y sus permisos
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="px-4 py-2 text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Importar
          </button>
          <button className="px-4 py-2 text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Exportar
          </button>
          <Link
            href="/admin/users/create"
            className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Link>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="admin">Administradores</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <select 
            value={`${sortBy}-${sortOrder}`} 
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
          >
            <option value="created_at-desc">Más recientes</option>
            <option value="created_at-asc">Más antiguos</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
          </select>
        </div>
      </motion.div>

      {/* Bulk actions */}
      {selectedUsers.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ccb-blue/10 border border-ccb-blue/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-ccb-blue">
                {selectedUsers.length} usuarios seleccionados
              </span>
              <button
                onClick={() => setSelectedUsers([])}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Deseleccionar todos
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors">
                Eliminar seleccionados
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                Exportar seleccionados
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-ccb-blue" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Administradores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.status === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Promedio Asistencia</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.length > 0 ? 
                  Math.round(users.reduce((acc, u) => acc + (u.attendance_rate || 0), 0) / users.length) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selection controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length && users.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-ccb-blue border-gray-300 rounded focus:ring-ccb-blue"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Seleccionar todos ({users.length})
            </span>
          </label>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {page * limit + 1} - {Math.min((page + 1) * limit, total)} de {total} usuarios
        </div>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron usuarios
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No hay usuarios que coincidan con los filtros seleccionados.
          </p>
          <Link 
            href="/admin/users/create"
            className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Crear primer usuario
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-ccb-blue border-gray-300 rounded focus:ring-ccb-blue"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estadísticas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Registrado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => {
                  const isSelected = selectedUsers.includes(user.id);
                  return (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectUser(user.id)}
                          className="h-4 w-4 text-ccb-blue border-gray-300 rounded focus:ring-ccb-blue"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-ccb-blue flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-xs text-gray-400">
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1">
                            {user.status === 'admin' ? 'Administrador' :
                             user.status === 'active' ? 'Activo' :
                             user.status === 'inactive' ? 'Inactivo' : 
                             user.status === 'deleted' ? 'Eliminado' : 'Inactivo'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="space-y-1">
                          <div>{user.total_reservations || 0} reservas</div>
                          <div>{user.attended_events || 0} asistencias</div>
                          <div className="text-xs">
                            {user.attendance_rate ? `${user.attendance_rate.toFixed(1)}%` : '0%'} tasa
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          {user.location || 'No especificada'}
                        </div>
                        {user.age && (
                          <div className="text-xs text-gray-400">
                            {user.age} años
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(user.created_at)}
                        </div>
                        {user.last_activity && (
                          <div className="text-xs text-gray-400">
                            Última: {formatDate(user.last_activity)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="text-ccb-blue hover:text-ccb-blue/80 p-1 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="text-green-600 hover:text-green-500 p-1 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-500 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-700">
            Página {page + 1} de {Math.ceil(total / limit)}
          </span>
          
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={(page + 1) * limit >= total}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
