import React, { useState, useEffect, useRef } from 'react';

const ReservationsManagement = ({ token }) => {
  const [reservations, setReservations] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estado para dropdown expandible de eventos
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  
  // Estados para dropdowns expandibles adicionales
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortByDropdown, setShowSortByDropdown] = useState(false);
  const [showSortOrderDropdown, setShowSortOrderDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const sortByDropdownRef = useRef(null);
  const sortOrderDropdownRef = useRef(null);

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    event: '',
    userSearch: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  const itemsPerPage = 20;

  // Efecto para cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowEventDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
      if (sortByDropdownRef.current && !sortByDropdownRef.current.contains(event.target)) {
        setShowSortByDropdown(false);
      }
      if (sortOrderDropdownRef.current && !sortOrderDropdownRef.current.contains(event.target)) {
        setShowSortOrderDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchReservations();
    fetchMetrics();
  }, [filters, currentPage]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        skip: currentPage * itemsPerPage,
        limit: itemsPerPage,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder
      });

      if (filters.status) queryParams.append('status_filter', filters.status);
      if (filters.event) queryParams.append('event_filter', filters.event);
      if (filters.userSearch) queryParams.append('user_search', filters.userSearch);

      const response = await fetch(`${BACKEND_URL}/api/admin/reservations?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations);
        setTotalReservations(data.total);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/reservations/metrics`, {
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

  const handleCheckin = async (reservationId) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${BACKEND_URL}/api/admin/reservations/${reservationId}/checkin`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchReservations();
        await fetchMetrics();
        alert('Check-in realizado correctamente');
      } else {
        alert('Error al realizar check-in');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al realizar check-in');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`${BACKEND_URL}/api/admin/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchReservations();
        await fetchMetrics();
        alert('Reserva cancelada correctamente');
      } else {
        alert('Error al cancelar reserva');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cancelar reserva');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectReservation = (reservationId) => {
    if (selectedReservations.includes(reservationId)) {
      setSelectedReservations(selectedReservations.filter(id => id !== reservationId));
    } else {
      setSelectedReservations([...selectedReservations, reservationId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedReservations.length === reservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(reservations.map(r => r.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReservations.length === 0) {
      alert('Selecciona al menos una reserva');
      return;
    }

    const actionNames = {
      checkin: 'hacer check-in de',
      cancel: 'cancelar'
    };

    if (!window.confirm(`¿Estás seguro de que quieres ${actionNames[action]} ${selectedReservations.length} reserva(s)?`)) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`${BACKEND_URL}/api/admin/reservations/bulk-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reservation_ids: selectedReservations,
          action: action
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.message}: ${result.affected_count} reservas procesadas`);
        setSelectedReservations([]);
        setShowBulkActions(false);
        await fetchReservations();
        await fetchMetrics();
      } else {
        alert('Error en la acción masiva');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error en la acción masiva');
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/reservations/export?format=csv`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservas_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar CSV');
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/reservations/export?format=excel`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservas_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Error al exportar Excel');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800',
      checked_in: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    const statusText = {
      confirmed: 'Confirmado',
      checked_in: 'Registrado',
      cancelled: 'Cancelado',
      pending: 'Pendiente'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusText[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header - Consistente con UserManagement */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <i className="bx bx-calendar-check mr-2 text-blue-600"></i>
              Gestión de Reservas
            </h2>
            <p className="text-gray-600">Administra las reservas de eventos ({totalReservations} total)</p>
          </div>
          <div className="flex space-x-3">
            {selectedReservations.length > 0 && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <i className="bx bx-cog mr-2"></i>
                Acciones ({selectedReservations.length})
              </button>
            )}
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <i className="bx bx-download mr-2"></i>
              Exportar CSV
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <i className="bx bx-spreadsheet mr-2"></i>
              Exportar Excel
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel - Consistente con UserManagement */}
      {showBulkActions && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-3">Acciones Masivas ({selectedReservations.length} reservas seleccionadas)</h4>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleBulkAction('checkin')} 
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center"
            >
              <i className="bx bx-check mr-1"></i>
              Check-in Masivo
            </button>
            <button 
              onClick={() => handleBulkAction('cancel')} 
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center"
            >
              <i className="bx bx-x mr-1"></i>
              Cancelar Masivo
            </button>
            <button 
              onClick={() => setShowBulkActions(false)} 
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 flex items-center"
            >
              <i className="bx bx-x mr-1"></i>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <i className="bx bx-calendar text-blue-600 text-lg"></i>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Reservas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {metrics.total_reservations || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <i className="bx bx-check-circle text-green-600 text-lg"></i>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Confirmadas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {metrics.confirmed_reservations || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                <i className="bx bx-user-check text-purple-600 text-lg"></i>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Check-ins
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {metrics.checked_in_reservations || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                <i className="bx bx-x-circle text-red-600 text-lg"></i>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Canceladas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {metrics.cancelled_reservations || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Consistente con UserManagement */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <i className="bx bx-filter mr-2 text-gray-600"></i>
          Filtros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Status Filter */}
          <div ref={statusDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
            >
                             <span className={filters.status ? 'text-gray-900' : 'text-gray-500'}>
                 {filters.status ? 
                   (() => {
                     switch(filters.status) {
                       case 'confirmed': return 'Confirmado';
                       case 'checked_in': return 'Registrado';
                       case 'cancelled': return 'Cancelado';
                       case 'pending': return 'Pendiente';
                       default: return 'Todos los estados';
                     }
                   })()
                   : 'Todos los estados'
                 }
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
                      setFilters(prev => ({ ...prev, status: '' }));
                      setShowStatusDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                  >
                    Todos los estados
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, status: 'confirmed' }));
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'confirmed' ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' : 'text-gray-900'
                    }`}
                  >
                    Confirmado
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, status: 'checked_in' }));
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'checked_in' ? 'bg-green-100 text-green-900 font-medium border-l-4 border-green-500' : 'text-gray-900'
                    }`}
                  >
                    Registrado
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, status: 'cancelled' }));
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'cancelled' ? 'bg-red-100 text-red-900 font-medium border-l-4 border-red-500' : 'text-gray-900'
                    }`}
                  >
                    Cancelado
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, status: 'pending' }));
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-yellow-50 focus:bg-yellow-50 focus:outline-none transition-colors duration-150 ${
                      filters.status === 'pending' ? 'bg-yellow-100 text-yellow-900 font-medium border-l-4 border-yellow-500' : 'text-gray-900'
                    }`}
                  >
                    Pendiente
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Event Filter - Custom Dropdown */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Evento</label>
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowEventDropdown(!showEventDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
            >
              <span className={filters.event ? 'text-gray-900' : 'text-gray-500'}>
                {filters.event ? 
                  events.find(e => e.id === filters.event)?.title || 'Todos los eventos' 
                  : 'Todos los eventos'
                }
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${showEventDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Options */}
            {showEventDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, event: '' }));
                      setShowEventDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                  >
                    Todos los eventos
                  </button>
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, event: event.id }));
                        setShowEventDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 ${
                        filters.event === event.id ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' : 'text-gray-900'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-base">{event.title}</span>
                        <span className="text-sm text-gray-500 mt-1">
                          📅 {new Date(event.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} • 🕐 {event.time} • 📍 {event.location}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          {event.category} • Capacidad: {event.capacity}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              value={filters.userSearch}
              onChange={(e) => setFilters(prev => ({ ...prev, userSearch: e.target.value }))}
              placeholder="Buscar usuario..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Sort By */}
          <div ref={sortByDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowSortByDropdown(!showSortByDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
            >
                             <span className={filters.sortBy ? 'text-gray-900' : 'text-gray-500'}>
                 {filters.sortBy ? 
                   (() => {
                     switch(filters.sortBy) {
                       case 'created_at': return 'Fecha de creación';
                       case 'event_date': return 'Fecha del evento';
                       case 'user_name': return 'Nombre del usuario';
                       case 'status': return 'Estado';
                       default: return 'Fecha de creación';
                     }
                   })()
                   : 'Fecha de creación'
                 }
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${showSortByDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Options */}
            {showSortByDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <div className="py-2">
                                     <button
                     onClick={() => {
                       setFilters(prev => ({ ...prev, sortBy: 'created_at' }));
                       setShowSortByDropdown(false);
                     }}
                     className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 ${
                       filters.sortBy === 'created_at' ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' : 'text-gray-500'
                     }`}
                   >
                     Fecha de creación (por defecto)
                   </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'created_at' }));
                      setShowSortByDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'created_at' ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' : 'text-gray-900'
                    }`}
                  >
                    Fecha de creación
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'event_date' }));
                      setShowSortByDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'event_date' ? 'bg-green-100 text-green-900 font-medium border-l-4 border-green-500' : 'text-gray-900'
                    }`}
                  >
                    Fecha del evento
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'user_name' }));
                      setShowSortByDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'user_name' ? 'bg-purple-100 text-purple-900 font-medium border-l-4 border-purple-500' : 'text-gray-900'
                    }`}
                  >
                    Nombre del usuario
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: 'status' }));
                      setShowSortByDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortBy === 'status' ? 'bg-red-100 text-red-900 font-medium border-l-4 border-red-500' : 'text-gray-900'
                    }`}
                  >
                    Estado
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sort Order */}
          <div ref={sortOrderDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Orden</label>
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowSortOrderDropdown(!showSortOrderDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
            >
              <span className={filters.sortOrder ? 'text-gray-900' : 'text-gray-500'}>
                {filters.sortOrder === 'desc' ? 'Descendente' : 'Ascendente'}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${showSortOrderDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Options */}
            {showSortOrderDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortOrder: 'desc' }));
                      setShowSortOrderDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortOrder === 'desc' ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' : 'text-gray-900'
                    }`}
                  >
                    Descendente
                  </button>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortOrder: 'asc' }));
                      setShowSortOrderDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors duration-150 ${
                      filters.sortOrder === 'asc' ? 'bg-green-100 text-green-900 font-medium border-l-4 border-green-500' : 'text-gray-900'
                    }`}
                  >
                    Ascendente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Lista de Reservas ({reservations.length} de {totalReservations})
            </h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedReservations.length === reservations.length && reservations.length > 0}
                onChange={handleSelectAll}
                className="mr-2"
              />
              Seleccionar todo
            </label>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando reservas...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron reservas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedReservations.length === reservations.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Evento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReservations.includes(reservation.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReservations([...selectedReservations, reservation.id]);
                          } else {
                            setSelectedReservations(selectedReservations.filter(id => id !== reservation.id));
                          }
                        }}
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.user ? reservation.user.name : 'Usuario no encontrado'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.user ? reservation.user.email : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.user ? reservation.user.phone : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.event ? reservation.event.title : 'Evento no encontrado'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Código: {reservation.checkin_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                        reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status === 'confirmed' ? 'Confirmado' :
                         reservation.status === 'checked_in' ? 'Registrado' :
                         reservation.status === 'cancelled' ? 'Cancelado' :
                         reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.event ? (
                        <>
                          {new Date(reservation.event.date + 'T' + reservation.event.time).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </>
                      ) : (
                        'Invalid Date'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleCheckin(reservation.id)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                          disabled={isProcessing}
                        >
                          <i className="bx bx-check mr-1"></i>
                          Check-in
                        </button>
                      )}
                      {(reservation.status === 'confirmed' || reservation.status === 'checked_in') && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                          disabled={isProcessing}
                        >
                          <i className="bx bx-x mr-1"></i>
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{currentPage * itemsPerPage + 1}</span> a{' '}
                  <span className="font-medium">{Math.min((currentPage + 1) * itemsPerPage, totalReservations)}</span> de{' '}
                  <span className="font-medium">{totalReservations}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const page = idx;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page + 1}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsManagement; 