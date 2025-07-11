import React, { useState, useEffect, useRef } from 'react';
import BulkUserImport from './BulkUserImport';
import UserEditModal from './UserEditModal';

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Estados para dropdowns expandibles
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Referencias para dropdowns
  const statusDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  
  const [filters, setFilters] = useState({
    status: 'all',
    location: '',
    ageMin: '',
    ageMax: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Efecto para cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch users list
  const fetchUsers = async (page = 1, search = '', filterParams = filters) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const skip = (page - 1) * 20;
      
      let url = `${BACKEND_URL}/api/admin/users?skip=${skip}&limit=20`;
      if (search.trim()) url += `&search=${encodeURIComponent(search)}`;
      if (filterParams.status !== 'all') url += `&status_filter=${filterParams.status}`;
      if (filterParams.location) url += `&location_filter=${encodeURIComponent(filterParams.location)}`;
      if (filterParams.ageMin) url += `&age_min=${filterParams.ageMin}`;
      if (filterParams.ageMax) url += `&age_max=${filterParams.ageMax}`;
      url += `&sort_by=${filterParams.sortBy}&sort_order=${filterParams.sortOrder}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user metrics
  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/admin/users-metrics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Fetch detailed user profile
  const fetchUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchUsers(currentPage, searchTerm, filters);
        fetchMetrics();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    const userIds = Array.from(selectedUsers);
    if (userIds.length === 0) {
      alert('Selecciona al menos un usuario');
      return;
    }

    const actionNames = {
      delete: 'eliminar',
      make_admin: 'hacer administradores a',
      remove_admin: 'quitar privilegios de administrador a',
      activate: 'activar'
    };

    if (!window.confirm(`¿Estás seguro de que quieres ${actionNames[action]} ${userIds.length} usuario(s)?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/admin/users/bulk-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_ids: userIds, action })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.message}: ${result.affected_count} usuarios procesados`);
        setSelectedUsers(new Set());
        setShowBulkActions(false);
        fetchUsers(currentPage, searchTerm, filters);
        fetchMetrics();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error in bulk action:', error);
      alert('Error en la acción masiva');
    }
  };

  // Handle user selection
  const handleUserSelect = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // Select all users
  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMetrics();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(1, searchTerm, filters);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchUsers(1, searchTerm, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchUsers(page, searchTerm, filters);
  };

  // Handle import completion
  const handleImportComplete = (result) => {
    fetchUsers(currentPage, searchTerm, filters);
    fetchMetrics();
    if (result.successful_imports > 0) {
      alert(`¡Importación exitosa! ${result.successful_imports} usuarios importados correctamente.`);
    }
  };

  // Handle user edit
  const handleUserEdit = (userId) => {
    const userToEdit = users.find(u => u.id === userId);
    setSelectedUser(userToEdit);
    setShowEditModal(true);
  };

  // Handle user save after edit
  const handleUserSave = (updatedUser) => {
    // Update user in the list
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
    fetchMetrics(); // Refresh metrics in case admin status changed
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (userStatus, attendanceRate) => {
    const badges = {
      deleted: <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">🗑️ Eliminado</span>,
      admin: <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">👑 Admin</span>,
      active: attendanceRate >= 80 
        ? <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">🌟 VIP</span>
        : attendanceRate >= 50
        ? <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
            <i className="bx bx-check mr-1"></i>
            Activo
          </span>
        : <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">⚠️ Irregular</span>,
      inactive: <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">😴 Inactivo</span>
    };
    return badges[userStatus] || badges.inactive;
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <i className="bx bx-group mr-2"></i>
              Gestión de Usuarios
            </h2>
            <p className="text-gray-600">Administra y monitorea la actividad de todos los usuarios</p>
          </div>
          <div className="flex space-x-3">
            {selectedUsers.size > 0 && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <i className="bx bx-cog mr-2"></i>
                Acciones ({selectedUsers.size})
              </button>
            )}
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <i className="bx bx-upload mr-2"></i>
              Importar Usuarios
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-3">Acciones Masivas ({selectedUsers.size} usuarios seleccionados)</h4>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleBulkAction('make_admin')} className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center">
              <i className="bx bx-crown mr-1"></i>
              Hacer Admin
            </button>
            <button onClick={() => handleBulkAction('remove_admin')} className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center">
              <i className="bx bx-user mr-1"></i>
              Quitar Admin
            </button>
            <button onClick={() => handleBulkAction('activate')} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center">
              <i className="bx bx-check mr-1"></i>
              Activar
            </button>
            <button onClick={() => handleBulkAction('delete')} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center">
              <i className="bx bx-trash mr-1"></i>
              Eliminar
            </button>
            <button onClick={() => setShowBulkActions(false)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.total_users || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.active_users || 0}</p>
              <p className="text-xs text-green-600">{metrics.activity_rate || 0}% del total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nuevos (30 días)</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.recent_registrations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administradores</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.admin_users || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, email o ubicación..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div ref={statusDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
            >
              <span className={filters.status !== 'all' ? 'text-gray-900' : 'text-gray-500'}>
                {(() => {
                  switch(filters.status) {
                    case 'all': return 'Todos los estados';
                    case 'active': return 'Activos';
                    case 'inactive': return 'Inactivos';
                    case 'admin': return 'Administradores';
                    case 'deleted': return 'Eliminados';
                    default: return 'Todos los estados';
                  }
                })()}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Options */}
            {showStatusDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <div className="py-2">
                  <button
                    onClick={() => {
                      handleFilterChange('status', 'all');
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'all' ? 'bg-gray-100 text-gray-900 font-medium border-l-4 border-gray-500' : 'text-gray-500'
                    }`}
                  >
                    Todos los estados
                  </button>
                  <button
                    onClick={() => {
                      handleFilterChange('status', 'active');
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'active' ? 'bg-green-100 text-green-900 font-medium border-l-4 border-green-500' : 'text-gray-900'
                    }`}
                  >
                    Activos
                  </button>
                  <button
                    onClick={() => {
                      handleFilterChange('status', 'inactive');
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-yellow-50 focus:bg-yellow-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'inactive' ? 'bg-yellow-100 text-yellow-900 font-medium border-l-4 border-yellow-500' : 'text-gray-900'
                    }`}
                  >
                    Inactivos
                  </button>
                  <button
                    onClick={() => {
                      handleFilterChange('status', 'admin');
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'admin' ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' : 'text-gray-900'
                    }`}
                  >
                    Administradores
                  </button>
                  <button
                    onClick={() => {
                      handleFilterChange('status', 'deleted');
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'deleted' ? 'bg-red-100 text-red-900 font-medium border-l-4 border-red-500' : 'text-gray-900'
                    }`}
                  >
                    Eliminados
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Ciudad..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
            <div className="flex space-x-1">
              <input
                type="number"
                value={filters.ageMin}
                onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                placeholder="Min"
                className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={filters.ageMax}
                onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                placeholder="Max"
                className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sort */}
          <div ref={sortDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar</label>
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
            >
              <span className="text-gray-900">
                {(() => {
                  const sortValue = `${filters.sortBy}-${filters.sortOrder}`;
                  switch(sortValue) {
                    case 'created_at-desc': return 'Más recientes';
                    case 'created_at-asc': return 'Más antiguos';
                    case 'name-asc': return 'Nombre A-Z';
                    case 'name-desc': return 'Nombre Z-A';
                    case 'age-asc': return 'Edad (menor)';
                    case 'age-desc': return 'Edad (mayor)';
                    default: return 'Más recientes';
                  }
                })()}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Options */}
            {showSortDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'created_at', sortOrder: 'desc' }));
                      fetchUsers(1, searchTerm, { ...filters, sortBy: 'created_at', sortOrder: 'desc' });
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'created_at' && filters.sortOrder === 'desc' ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' : 'text-gray-900'
                    }`}
                  >
                    Más recientes
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'created_at', sortOrder: 'asc' }));
                      fetchUsers(1, searchTerm, { ...filters, sortBy: 'created_at', sortOrder: 'asc' });
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'created_at' && filters.sortOrder === 'asc' ? 'bg-green-100 text-green-900 font-medium border-l-4 border-green-500' : 'text-gray-900'
                    }`}
                  >
                    Más antiguos
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'name', sortOrder: 'asc' }));
                      fetchUsers(1, searchTerm, { ...filters, sortBy: 'name', sortOrder: 'asc' });
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'name' && filters.sortOrder === 'asc' ? 'bg-purple-100 text-purple-900 font-medium border-l-4 border-purple-500' : 'text-gray-900'
                    }`}
                  >
                    Nombre A-Z
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'name', sortOrder: 'desc' }));
                      fetchUsers(1, searchTerm, { ...filters, sortBy: 'name', sortOrder: 'desc' });
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'name' && filters.sortOrder === 'desc' ? 'bg-indigo-100 text-indigo-900 font-medium border-l-4 border-indigo-500' : 'text-gray-900'
                    }`}
                  >
                    Nombre Z-A
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'age', sortOrder: 'asc' }));
                      fetchUsers(1, searchTerm, { ...filters, sortBy: 'age', sortOrder: 'asc' });
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-orange-50 focus:bg-orange-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'age' && filters.sortOrder === 'asc' ? 'bg-orange-100 text-orange-900 font-medium border-l-4 border-orange-500' : 'text-gray-900'
                    }`}
                  >
                    Edad (menor)
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'age', sortOrder: 'desc' }));
                      fetchUsers(1, searchTerm, { ...filters, sortBy: 'age', sortOrder: 'desc' });
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'age' && filters.sortOrder === 'desc' ? 'bg-red-100 text-red-900 font-medium border-l-4 border-red-500' : 'text-gray-900'
                    }`}
                  >
                    Edad (mayor)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Lista de Usuarios ({users.length} de {metrics.total_users || 0})
            </h3>
            {users.length > 0 && (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                Seleccionar todos
              </label>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="sr-only">Seleccionar</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userItem) => (
                <tr key={userItem.id} className={`hover:bg-gray-50 ${selectedUsers.has(userItem.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(userItem.id)}
                      onChange={() => handleUserSelect(userItem.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {userItem.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                        <div className="text-sm text-gray-500">{userItem.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{userItem.phone}</div>
                    <div className="text-sm text-gray-500">{userItem.location} • {userItem.age} años</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(userItem.status, userItem.attendance_rate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>📅 {userItem.total_reservations} reservas</div>
                                    <div className="flex items-center">
                  <i className="bx bx-check mr-1"></i>
                  {userItem.attended_events} asistencias
                </div>
                <div className="flex items-center">
                  <i className="bx bx-bar-chart mr-1"></i>
                  {userItem.attendance_rate}% participación
                </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(userItem.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => fetchUserProfile(userItem.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      👁️ Ver
                    </button>
                    <button
                      onClick={() => handleUserEdit(userItem.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => deleteUser(userItem.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Página <span className="font-medium">{currentPage}</span> de{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUserModal && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleUserSave}
        />
      )}

      {showImportModal && (
        <BulkUserImport
          onImportComplete={handleImportComplete}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

// User Profile Modal Component
const UserProfileModal = ({ user, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">📅 Confirmado</span>,
      checked_in: <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
      <i className="bx bx-check mr-1"></i>
      Asistió
    </span>,
      cancelled: <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">❌ Cancelado</span>
    };
    return badges[status] || <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">❓ Desconocido</span>;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <i className="bx bx-user mr-2"></i>
          Perfil de Usuario
        </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="mx-auto h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-600">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <h4 className="mt-2 text-xl font-semibold text-gray-900">{user.name}</h4>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Edad:</span>
                  <p className="text-gray-900">{user.age} años</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ubicación:</span>
                  <p className="text-gray-900">{user.location}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Registrado:</span>
                  <p className="text-gray-900">{formatDate(user.created_at)}</p>
                </div>
                {user.is_admin && (
                  <div className="bg-purple-100 border border-purple-200 rounded p-2">
                    <span className="text-purple-800 font-medium">👑 Usuario Administrador</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg">
              <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="bx bx-bar-chart mr-2"></i>
              Estadísticas
            </h5>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{user.statistics?.total_reservations || 0}</p>
                  <p className="text-sm text-gray-600">Total Reservas</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{user.statistics?.attended_events || 0}</p>
                  <p className="text-sm text-gray-600">Asistencias</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{user.statistics?.upcoming_events || 0}</p>
                  <p className="text-sm text-gray-600">Próximos</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{user.statistics?.attendance_rate || 0}%</p>
                  <p className="text-sm text-gray-600">Asistencia</p>
                </div>
              </div>

              {user.statistics?.favorite_category && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Categoría Favorita:</p>
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded">
                    {user.statistics.favorite_category}
                  </span>
                </div>
              )}

              {/* Recent Reservations */}
              <div>
                <h6 className="text-md font-semibold text-gray-900 mb-3">📅 Reservas Recientes</h6>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {user.reservations?.slice(0, 10).map((reservation, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-900">
                          {reservation.event_details?.title || 'Evento sin título'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {reservation.event_details?.date} • {reservation.event_details?.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          Reservado: {formatDate(reservation.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(reservation.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {reservation.event_details?.category}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!user.reservations || user.reservations.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No hay reservas registradas</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 