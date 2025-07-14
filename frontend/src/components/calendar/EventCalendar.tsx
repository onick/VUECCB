"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Grid3X3,
  List,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface EventData {
  id: string;
  title: string;
  date: number;
  time: string;
  category: string;
  type: 'cinema' | 'concert' | 'workshop' | 'exhibition' | 'conference' | 'experience';
  status: 'confirmed' | 'pending' | 'critical';
  color: string;
  location: string;
  attendees: number;
  capacity: number;
}

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6)); // Julio 2025
  const [selectedView, setSelectedView] = useState('Month');
  const [searchTerm, setSearchTerm] = useState('');

  // Eventos de ejemplo para CCB
  const events: EventData[] = [
    {
      id: '1',
      title: 'Cinema Dominicano: Nueba Yol',
      date: 8,
      time: '19:00',
      category: 'Cinema Dominicano',
      type: 'cinema',
      status: 'confirmed',
      color: 'bg-red-100 border-red-300 text-red-800',
      location: 'Sala Principal',
      attendees: 145,
      capacity: 180
    },
    {
      id: '2', 
      title: 'Concierto Jazz Fusión',
      date: 10,
      time: '20:00',
      category: 'Conciertos',
      type: 'concert',
      status: 'confirmed',
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      location: 'Auditorio',
      attendees: 89,
      capacity: 120
    },
    {
      id: '3',
      title: 'Taller Fotografía Digital',
      date: 14,
      time: '09:00',
      category: 'Talleres',
      type: 'workshop',
      status: 'pending',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      location: 'Aula 103',
      attendees: 12,
      capacity: 25
    },
    {
      id: '4',
      title: 'Exposición Arte Moderno',
      date: 18,
      time: '10:00',
      category: 'Exposiciones de Arte',
      type: 'exhibition',
      status: 'confirmed',
      color: 'bg-green-100 border-green-300 text-green-800',
      location: 'Galería Principal',
      attendees: 234,
      capacity: 300
    },
    {
      id: '5',
      title: 'Charla: Historia DR',
      date: 22,
      time: '16:00',
      category: 'Charlas/Conferencias',
      type: 'conference',
      status: 'critical',
      color: 'bg-orange-100 border-orange-300 text-orange-800',
      location: 'Salón de Conferencias',
      attendees: 67,
      capacity: 80
    },
    {
      id: '6',
      title: 'Experiencia 3D Inmersiva',
      date: 25,
      time: '15:00',
      category: 'Experiencias 3D',
      type: 'experience',
      status: 'confirmed',
      color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
      location: 'Sala VR',
      attendees: 28,
      capacity: 30
    }
  ];

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    for (let i = startDate - 1; i >= 0; i--) {
      const prevMonth = new Date(year, month - 1, 0);
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Días del mes actual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getFullYear() === year && 
                     today.getMonth() === month && 
                     today.getDate() === day;
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday
      });
    }

    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const getEventsForDate = (date: number) => {
    return events.filter(event => event.date === date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'pending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
    }
  };

  const upcomingEvents = events
    .filter(event => event.date >= new Date().getDate())
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Panel Principal del Calendario */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header del Calendario */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Botón Crear Evento */}
            <Link 
              href="/admin/events/create"
              className="px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Crear evento</span>
            </Link>
          </div>

          {/* Controles de Navegación */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Hoy
            </button>

            <div className="flex items-center space-x-4">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} - {currentDate.getFullYear()}
              </h2>
              
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Selector de Vista */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['Day', 'Week', 'Month', 'Year'].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedView === view
                      ? 'bg-ccb-blue text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {view === 'Day' ? 'Día' : view === 'Week' ? 'Semana' : view === 'Month' ? 'Mes' : 'Año'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid del Calendario */}
        <div className="p-6">
          {/* Encabezados de días */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day, index) => (
              <div key={day} className="text-center py-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {dayNames[index]}
                </span>
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((day, index) => {
              const dayEvents = day.isCurrentMonth ? getEventsForDate(day.date) : [];
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`min-h-[120px] p-2 rounded-lg border-2 transition-colors ${
                    day.isCurrentMonth
                      ? day.isToday
                        ? 'bg-ccb-blue/10 border-ccb-blue'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                      : 'bg-gray-25 dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-50'
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    day.isCurrentMonth 
                      ? day.isToday 
                        ? 'text-ccb-blue' 
                        : 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {day.date}
                  </div>

                  {/* Eventos del día */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.05 }}
                        className={`text-xs p-1 rounded border cursor-pointer ${event.color}`}
                        title={`${event.title} - ${event.time} - ${event.location}`}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="flex items-center justify-between">
                          <span className="opacity-75">{event.time}</span>
                          {getStatusIcon(event.status)}
                        </div>
                      </motion.div>
                    ))}
                    
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel Lateral de Eventos */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Filtros rápidos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Filtros</h3>
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Cinema', 'Conciertos', 'Talleres'].map((filter) => (
                <button
                  key={filter}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filter === 'Todos'
                      ? 'bg-ccb-blue text-white border-ccb-blue'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Próximos Eventos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Próximos Eventos
          </h3>
          
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                {getStatusIcon(event.status)}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {event.title}
                  </h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {event.date} de {monthNames[currentDate.getMonth()]}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {event.attendees}/{event.capacity}
                    </div>
                  </div>
                </div>
                
                <div className={`px-2 py-1 text-xs rounded-full ${
                  event.status === 'critical' ? 'bg-red-100 text-red-800' :
                  event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.status === 'critical' ? 'Crítico' :
                   event.status === 'pending' ? 'Pendiente' : 'Confirmado'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;