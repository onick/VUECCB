"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  MapPin,
  Users,
  Download,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { Event, EventCategory, EventStatus } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const categories: EventCategory[] = [
    "Cinema Dominicano",
    "Cine Clásico", 
    "Cine General",
    "Talleres",
    "Conciertos",
    "Charlas/Conferencias",
    "Exposiciones de Arte",
    "Experiencias 3D Inmersivas"
  ];

  const statuses: EventStatus[] = ["activo", "cancelado", "completado", "borrador"];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Concierto de Jazz Latino',
          description: 'Una noche mágica con los mejores exponentes del jazz dominicano y latinoamericano.',
          category: 'Conciertos',
          date: '2025-01-20',
          time: '20:00',
          capacity: 200,
          location: 'Auditorio Principal',
          image_url: '/images/jazz-concert.jpg',
          available_spots: 15,
          created_at: '2025-01-10T10:00:00Z'
        },
        {
          id: '2',
          title: 'Exposición: Arte Moderno Dominicano',
          description: 'Muestra colectiva de artistas contemporáneos dominicanos con obras de pintura, escultura y arte digital.',
          category: 'Exposiciones de Arte',
          date: '2025-01-18',
          time: '10:00',
          capacity: 150,
          location: 'Galería Principal',
          image_url: '/images/art-exhibition.jpg',
          available_spots: 35,
          created_at: '2025-01-08T14:30:00Z'
        },
        {
          id: '3',
          title: 'Taller de Fotografía Digital',
          description: 'Aprende las técnicas básicas y avanzadas de fotografía digital con equipos profesionales.',
          category: 'Talleres',
          date: '2025-01-16',
          time: '09:00',
          capacity: 25,
          location: 'Aula 103',
          image_url: '/images/photography-workshop.jpg',
          available_spots: 7,
          created_at: '2025-01-05T16:20:00Z'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    const eventDate = new Date(event.date);
    const today = new Date();
    const eventStatus: EventStatus = eventDate < today ? 'completado' : 'activo';
    const matchesStatus = selectedStatus === 'all' || eventStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOccupancyPercentage = (event: Event) => {
    const occupied = event.capacity - (event.available_spots || 0);
    return ((occupied / event.capacity) * 100).toFixed(1);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const EventCard = ({ event }: { event: Event }) => {
    const occupancyPercentage = parseFloat(getOccupancyPercentage(event));
    const isSelected = selectedEvents.includes(event.id);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
          isSelected ? 'border-ccb-blue' : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelectEvent(event.id)}
                className="mt-1 h-4 w-4 text-ccb-blue border-gray-300 rounded focus:ring-ccb-blue"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {event.title}
                </h3>
                <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {event.category}
                </span>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(event.date)} • {event.time}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2" />
              {event.location}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              {event.capacity - (event.available_spots || 0)}/{event.capacity} asistentes
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ocupación</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${getOccupancyColor(occupancyPercentage)}`}>
                {occupancyPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-ccb-blue to-ccb-lightblue h-2 rounded-full transition-all duration-300"
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Link 
              href={`/admin/events/${event.id}`}
              className="flex-1 px-3 py-2 text-sm font-medium text-ccb-blue bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Ver
            </Link>
            <Link 
              href={`/admin/events/${event.id}/edit`}
              className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <Edit className="w-4 h-4 inline mr-1" />
              Editar
            </Link>
            <button className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <Trash2 className="w-4 h-4 inline mr-1" />
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>
    );
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Eventos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Administra todos los eventos del Centro Cultural Banreservas
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="px-4 py-2 text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Importar</span>
          </button>
          
          <button className="px-4 py-2 text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          
          <Link 
            href="/admin/events/create" 
            className="px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Evento</span>
          </Link>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value as EventStatus | 'all')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Barra de selección múltiple */}
      {selectedEvents.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ccb-blue/10 border border-ccb-blue/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-ccb-blue">
                {selectedEvents.length} eventos seleccionados
              </span>
              <button
                onClick={() => setSelectedEvents([])}
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

      {/* Controles de selección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-ccb-blue border-gray-300 rounded focus:ring-ccb-blue"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Seleccionar todos ({filteredEvents.length})
            </span>
          </label>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {filteredEvents.length} de {events.length} eventos
        </div>
      </div>

      {/* Grid de eventos */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron eventos
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No hay eventos que coincidan con los filtros seleccionados.
          </p>
          <Link 
            href="/admin/events/create"
            className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear primer evento
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}