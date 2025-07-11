import React, { useState, useEffect } from 'react';

const AttendanceReports = ({ token }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [summaryReport, setSummaryReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'summary'
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  
  // Filters for summary report
  const [summaryFilters, setSummaryFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: ''
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    fetchEvents();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEventDropdown && !event.target.closest('.relative')) {
        setShowEventDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEventDropdown]);

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

  const generateIndividualReport = async () => {
    if (!selectedEvent) {
      alert('Por favor selecciona un evento');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/admin/events/${selectedEvent}/attendance-report`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceReport(data);
      } else {
        alert('Error al generar el reporte');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const generateSummaryReport = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (summaryFilters.dateFrom) queryParams.append('date_from', summaryFilters.dateFrom);
      if (summaryFilters.dateTo) queryParams.append('date_to', summaryFilters.dateTo);
      if (summaryFilters.category) queryParams.append('category', summaryFilters.category);

      const response = await fetch(`${BACKEND_URL}/api/admin/reports/attendance-summary?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSummaryReport(data);
      } else {
        alert('Error al generar el reporte resumen');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el reporte resumen');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportIndividualReport = () => {
    if (!attendanceReport) return;
    
    const exportData = attendanceReport.attendance_list.map(item => ({
      'Nombre': item.user_name,
      'Email': item.user_email,
      'Teléfono': item.user_phone,
      'Edad': item.user_age,
      'Ubicación': item.user_location,
      'Código Check-in': item.checkin_code,
      'Estado': item.status === 'checked_in' ? 'Asistió' : 
               item.status === 'confirmed' ? 'Confirmado' : 
               item.status === 'cancelled' ? 'Cancelado' : item.status,
      'Fecha Reserva': new Date(item.reserved_at).toLocaleDateString('es-ES'),
      'Fecha Check-in': item.checked_in_at ? new Date(item.checked_in_at).toLocaleDateString('es-ES') : '',
      'Asistió': item.attended ? 'Sí' : 'No'
    }));

    const eventTitle = attendanceReport.event.title.replace(/[^a-zA-Z0-9]/g, '_');
    exportToCSV(exportData, `Asistencia_${eventTitle}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportSummaryReport = () => {
    if (!summaryReport) return;
    
    const exportData = summaryReport.events.map(event => ({
      'Evento': event.event_title,
      'Fecha': event.event_date,
      'Hora': event.event_time,
      'Categoría': event.event_category,
      'Capacidad': event.capacity,
      'Total Reservas': event.total_reservations,
      'Total Asistentes': event.total_attended,
      'Total Cancelados': event.total_cancelled,
      'Tasa de Asistencia (%)': event.attendance_rate,
      'Utilización Capacidad (%)': event.capacity_utilization
    }));

    exportToCSV(exportData, `Reporte_Asistencia_Resumen_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // ==================== REPORTES PROFESIONALES ====================
  
  const generateProfessionalEventReport = async () => {
    if (!selectedEvent) {
      alert('Por favor selecciona un evento');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/admin/reports/professional/event/${selectedEvent}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Extraer nombre del archivo de los headers o usar uno por defecto
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'Reporte_Evento_Profesional.pdf';
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Error al generar el reporte profesional');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el reporte profesional');
    } finally {
      setLoading(false);
    }
  };

  const generateProfessionalMonthlyReport = async () => {
    try {
      setLoading(true);
      
      // Usar la fecha actual por defecto
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      
      const response = await fetch(`${BACKEND_URL}/api/admin/reports/professional/monthly?month=${month}&year=${year}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Extraer nombre del archivo de los headers o usar uno por defecto
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'Reporte_Mensual_Profesional.pdf';
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Error al generar el reporte mensual profesional');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el reporte mensual profesional');
    } finally {
      setLoading(false);
    }
  };

  const uniqueCategories = [...new Set(events.map(event => event.category))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <i className="bx bx-bar-chart-alt-2 mr-2 text-blue-600"></i>
          Reportes de Asistencia
        </h2>
        <p className="text-gray-600">Genera reportes detallados de asistencia a eventos</p>
      </div>

      {/* Professional Reports Info */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow p-6 border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-600 rounded-full p-3">
            <i className="bx bx-file-pdf text-white text-2xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🎯 Reportes Profesionales PDF
            </h3>
            <p className="text-gray-600 mb-3">
              Genera reportes profesionales con diseño corporativo del Centro Cultural Banreservas, 
              perfectos para presentaciones ejecutivas y reuniones directivas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <i className="bx bx-check-circle text-green-600"></i>
                <span>Logo y diseño corporativo</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="bx bx-check-circle text-green-600"></i>
                <span>Gráficos y visualizaciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="bx bx-check-circle text-green-600"></i>
                <span>Análisis demográfico completo</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="bx bx-check-circle text-green-600"></i>
                <span>Métricas de rendimiento</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('individual')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'individual'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="bx bx-file-blank mr-2"></i>
              Reporte Individual
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="bx bx-list-ul mr-2"></i>
              Reporte Resumen
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'individual' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Reporte de Asistencia por Evento</h3>
              
              {/* Event Selection - Custom Dropdown */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Evento
                  </label>
                  <div className="relative">
                    {/* Dropdown Button */}
                    <button
                      type="button"
                      onClick={() => setShowEventDropdown(!showEventDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
                    >
                      <span className={selectedEvent ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedEvent ? 
                          events.find(e => e.id === selectedEvent)?.title || 'Selecciona un evento' 
                          : 'Selecciona un evento'
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
                              setSelectedEvent('');
                              setShowEventDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                          >
                            Selecciona un evento
                          </button>
                          {events.map((event) => (
                            <button
                              key={event.id}
                              onClick={() => {
                                setSelectedEvent(event.id);
                                setShowEventDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 ${
                                selectedEvent === event.id ? 'bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-500' : 'text-gray-900'
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
                </div>
                <div className="flex items-end space-x-3">
                  <button
                    onClick={generateIndividualReport}
                    disabled={loading || !selectedEvent}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <i className="bx bx-loader-alt animate-spin mr-2"></i>
                    ) : (
                      <i className="bx bx-search mr-2"></i>
                    )}
                    Reporte Básico
                  </button>
                  
                  <button
                    onClick={generateProfessionalEventReport}
                    disabled={loading || !selectedEvent}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <i className="bx bx-loader-alt animate-spin mr-2"></i>
                    ) : (
                      <i className="bx bx-file-pdf mr-2"></i>
                    )}
                    Reporte Profesional PDF
                  </button>
                </div>
              </div>

              {/* Individual Report Results */}
              {attendanceReport && (
                <div className="space-y-6">
                  {/* Event Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {attendanceReport.event.title}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Fecha:</span>
                        <p>{new Date(attendanceReport.event.date).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Hora:</span>
                        <p>{attendanceReport.event.time}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Ubicación:</span>
                        <p>{attendanceReport.event.location}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Capacidad:</span>
                        <p>{attendanceReport.event.capacity} personas</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {attendanceReport.summary.total_reservations}
                      </div>
                      <div className="text-sm text-gray-600">Total Reservas</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {attendanceReport.summary.total_attended}
                      </div>
                      <div className="text-sm text-gray-600">Asistieron</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {attendanceReport.summary.total_confirmed}
                      </div>
                      <div className="text-sm text-gray-600">Confirmados</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {attendanceReport.summary.total_cancelled}
                      </div>
                      <div className="text-sm text-gray-600">Cancelados</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {attendanceReport.summary.attendance_rate}%
                      </div>
                      <div className="text-sm text-gray-600">Tasa de Asistencia</div>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age Groups */}
                    <div className="bg-white border rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <i className="bx bx-group mr-2"></i>
                        Grupos de Edad (Asistentes)
                      </h5>
                      {Object.entries(attendanceReport.demographics.age_groups).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(attendanceReport.demographics.age_groups).map(([ageGroup, count]) => (
                            <div key={ageGroup} className="flex justify-between">
                              <span className="text-gray-600">{ageGroup}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No hay datos de edad disponibles</p>
                      )}
                    </div>

                    {/* Locations */}
                    <div className="bg-white border rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <i className="bx bx-map mr-2"></i>
                        Ubicaciones (Asistentes)
                      </h5>
                      {Object.entries(attendanceReport.demographics.locations).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(attendanceReport.demographics.locations).map(([location, count]) => (
                            <div key={location} className="flex justify-between">
                              <span className="text-gray-600">{location}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No hay datos de ubicación disponibles</p>
                      )}
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={exportIndividualReport}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <i className="bx bx-download mr-2"></i>
                      Exportar a CSV
                    </button>
                  </div>

                  {/* Attendance List */}
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <h5 className="font-semibold text-gray-800">Lista Detallada de Asistencia</h5>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Participante
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contacto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Código
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Check-in
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {attendanceReport.attendance_list.map((participant, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {participant.user_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {participant.user_age && `${participant.user_age} años`}
                                  {participant.user_age && participant.user_location && ' • '}
                                  {participant.user_location}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{participant.user_email}</div>
                                <div className="text-sm text-gray-500">{participant.user_phone}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  participant.status === 'checked_in' ? 'bg-green-100 text-green-800' :
                                  participant.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                  participant.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {participant.status === 'checked_in' ? 'Asistió' :
                                   participant.status === 'confirmed' ? 'Confirmado' :
                                   participant.status === 'cancelled' ? 'Cancelado' :
                                   participant.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-mono text-gray-900">
                                  {participant.checkin_code}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {participant.checked_in_at ? 
                                  new Date(participant.checked_in_at).toLocaleString('es-ES') : 
                                  '-'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Reporte Resumen de Asistencia</h3>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={summaryFilters.dateFrom}
                    onChange={(e) => setSummaryFilters({...summaryFilters, dateFrom: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={summaryFilters.dateTo}
                    onChange={(e) => setSummaryFilters({...summaryFilters, dateTo: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={summaryFilters.category}
                    onChange={(e) => setSummaryFilters({...summaryFilters, category: e.target.value})}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">Todas las categorías</option>
                    <option value="Exposición">Exposición</option>
                    <option value="Conferencia">Conferencia</option>
                    <option value="Taller">Taller</option>
                    <option value="Concierto">Concierto</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={generateSummaryReport}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? 'Generando...' : 'Generar Resumen'}
                  </button>
                </div>
              </div>

              {/* Summary Report Results */}
              {summaryReport && (
                <div className="space-y-6">
                  {/* Overall Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {summaryReport.summary.total_events}
                      </div>
                      <div className="text-sm text-gray-600">Total Eventos</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {summaryReport.summary.total_attended}
                      </div>
                      <div className="text-sm text-gray-600">Total Asistentes</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {summaryReport.summary.total_reservations}
                      </div>
                      <div className="text-sm text-gray-600">Total Reservas</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {summaryReport.summary.overall_attendance_rate}%
                      </div>
                      <div className="text-sm text-gray-600">Tasa Promedio</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {summaryReport.summary.overall_capacity_utilization}%
                      </div>
                      <div className="text-sm text-gray-600">Utilización</div>
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={exportSummaryReport}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Exportar a CSV
                    </button>
                    
                    <button
                      onClick={generateProfessionalMonthlyReport}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {loading ? 'Generando...' : 'Reporte Profesional (PDF)'}
                    </button>
                  </div>

                  {/* Events Summary Table */}
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <h5 className="font-semibold text-gray-800">Resumen por Evento</h5>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Evento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Capacidad
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reservas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Asistentes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tasa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Utilización
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {summaryReport.events.map((event, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {event.event_title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {event.event_category}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(event.event_date).toLocaleDateString('es-ES')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {event.capacity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {event.total_reservations}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {event.total_attended}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  event.attendance_rate >= 80 ? 'bg-green-100 text-green-800' :
                                  event.attendance_rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {event.attendance_rate}%
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {event.capacity_utilization}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports; 