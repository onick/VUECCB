import React, { useState, useEffect } from 'react';

const EventCalendar = ({ selectedDate, onDateSelect, existingEvents = [], readOnly = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventDate, setSelectedEventDate] = useState(selectedDate ? new Date(selectedDate) : null);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Update selected date when prop changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedEventDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return days;
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const hasExistingEvent = (date) => {
    return existingEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getConflictWarning = (date) => {
    const eventsOnDate = getEventsForDate(date);
    if (eventsOnDate.length === 0) return null;
    
    if (eventsOnDate.length >= 3) {
      return "¡Día muy ocupado! Considera otra fecha para mejor experiencia.";
    } else if (eventsOnDate.length >= 2) {
      return "Múltiples eventos programados. Verifica horarios para evitar conflictos.";
    } else {
      return `Ya existe: ${eventsOnDate[0].title} a las ${eventsOnDate[0].time}`;
    }
  };

  const getEventsForDate = (date) => {
    return existingEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isSelectedDate = (date) => {
    if (!selectedEventDate) return false;
    return selectedEventDate.toDateString() === date.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleDateClick = (date) => {
    if (readOnly || isPastDate(date)) return;
    
    setSelectedEventDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    onDateSelect(formattedDate);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDayClasses = (date) => {
    let classes = 'relative flex flex-col items-center justify-center h-12 w-12 text-sm cursor-pointer transition-all duration-200 rounded-lg ';
    
    if (!isCurrentMonth(date)) {
      classes += 'text-gray-300 ';
    } else if (isPastDate(date)) {
      classes += 'text-gray-400 cursor-not-allowed bg-gray-50 ';
    } else if (isSelectedDate(date)) {
      classes += 'bg-blue-600 text-white font-semibold shadow-md ';
    } else if (hasExistingEvent(date)) {
      classes += 'bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200 ';
    } else {
      classes += 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 ';
    }

    return classes;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          type="button"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          type="button"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const eventsForDate = getEventsForDate(date);
          
          return (
            <div
              key={index}
              className={getDayClasses(date)}
              onClick={() => handleDateClick(date)}
            >
              <span className="text-center">
                {date.getDate()}
              </span>
              
              {/* Event indicators */}
              {eventsForDate.length > 0 && (
                <div className="absolute bottom-1 flex space-x-0.5">
                  {eventsForDate.slice(0, 3).map((event, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                      title={event.title}
                    />
                  ))}
                  {eventsForDate.length > 3 && (
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" title={`+${eventsForDate.length - 3} más`} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-gray-600">Fecha seleccionada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
          <span className="text-gray-600">Eventos existentes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-50 rounded"></div>
          <span className="text-gray-600">No disponible</span>
        </div>
      </div>

      {/* Selected date info */}
      {selectedEventDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-blue-800">
              Fecha seleccionada: {selectedEventDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          {/* Show existing events for selected date */}
          {getEventsForDate(selectedEventDate).length > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">Eventos existentes:</p>
              {getEventsForDate(selectedEventDate).map((event, idx) => (
                <div key={idx} className="text-xs text-blue-600 flex items-center gap-1">
                  <span>•</span>
                  <span>{event.title} - {event.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendar; 