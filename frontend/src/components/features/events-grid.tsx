"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Filter } from "lucide-react";
import { useEventsStore } from "@/stores/events";
import { Event } from "@/types";
import { formatDate, formatTime, getCategoryIcon } from "@/lib/utils";
import Link from "next/link";
import { EVENT_CATEGORIES } from "@/lib/constants";

export function EventsGrid() {
  const { events, isLoading, fetchEvents, setFilters, filters } = useEventsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCategoryFilter = (category: string) => {
    const newCategory = category === selectedCategory ? "" : category;
    setSelectedCategory(newCategory);
    setFilters({ category: newCategory || undefined });
    fetchEvents();
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Próximos Eventos
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
                <CardHeader>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Próximos Eventos
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Descubre nuestra programación cultural
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryFilter("")}
            className="flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Todas las categorías
          </Button>
          {EVENT_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(category)}
              className="flex items-center"
            >
              <span className="mr-2">{getCategoryIcon(category)}</span>
              {category}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.slice(0, 6).map((event: Event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay eventos disponibles en este momento.</p>
              </div>
            </div>
          )}
        </div>

        {events.length > 6 && (
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/events">Ver todos los eventos</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: Event }) {
  const isAvailable = event.reservas_actuales < event.capacidad_maxima;
  const spotsLeft = event.capacidad_maxima - event.reservas_actuales;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="relative overflow-hidden">
        {event.imagen_url ? (
          <img
            src={event.imagen_url}
            alt={event.titulo}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-ccb-blue to-ccb-lightblue flex items-center justify-center">
            <span className="text-6xl">{getCategoryIcon(event.categoria)}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-ccb-blue">
            {event.categoria}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge 
            variant={isAvailable ? "success" : "destructive"}
            className="bg-white/90"
          >
            {isAvailable ? `${spotsLeft} cupos` : "Agotado"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg group-hover:text-ccb-blue transition-colors">
          {event.titulo}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {event.descripcion}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2 text-ccb-blue" />
          {formatDate(event.fecha_inicio)}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2 text-ccb-blue" />
          {formatTime(event.hora_inicio)} - {formatTime(event.hora_fin)}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2 text-ccb-blue" />
          {event.ubicacion}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4 mr-2 text-ccb-blue" />
          {event.reservas_actuales}/{event.capacidad_maxima} asistentes
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          disabled={!isAvailable}
          asChild={isAvailable}
        >
          {isAvailable ? (
            <Link href={`/events/${event.id}`}>
              {event.es_gratuito ? "Reservar Gratis" : `Reservar - $${event.precio}`}
            </Link>
          ) : (
            "No disponible"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
