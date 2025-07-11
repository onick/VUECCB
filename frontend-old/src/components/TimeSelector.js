import React, { useState, useMemo } from 'react';

const TimeSelector = ({ selectedTime, onTimeSelect, existingEvents = [], selectedDate, disabled = false }) => {
  const [selectedHour, setSelectedHour] = useState(selectedTime ? selectedTime.split(':')[0] : '');
  const [selectedMinute, setSelectedMinute] = useState(selectedTime ? selectedTime.split(':')[1] : '');

  // Horarios disponibles del centro cultural (9 AM - 9 PM)
  const availableHours = useMemo(() => {
    const hours = [];
    for (let i = 9; i <= 21; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }
    return hours;
  }, []);

  const availableMinutes = ['00', '15', '30', '45'];

  // Obtener eventos existentes para la fecha seleccionada
  const eventsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    
    return existingEvents.filter(event => {
      const eventDate = new Date(event.date);
      const currentDate = new Date(selectedDate);
      return eventDate.toDateString() === currentDate.toDateString();
    });
  }, [existingEvents, selectedDate]);

  // Verificar si un horario está ocupado
  const isTimeOccupied = (hour, minute) => {
    const timeString = `${hour}:${minute}`;
    return eventsOnSelectedDate.some(event => event.time === timeString);
  };

  // Obtener eventos cercanos a un horario (±2 horas)
  const getNearbyEvents = (hour, minute) => {
    const targetTime = parseInt(hour) * 60 + parseInt(minute);
    
    return eventsOnSelectedDate.filter(event => {
      const [eventHour, eventMinute] = event.time.split(':');
      const eventTime = parseInt(eventHour) * 60 + parseInt(eventMinute);
      const timeDiff = Math.abs(targetTime - eventTime);
      return timeDiff <= 120 && timeDiff > 0; // Dentro de 2 horas pero no exacto
    });
  };

  const handleTimeChange = (hour, minute) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    
    if (hour && minute) {
      onTimeSelect(`${hour}:${minute}`);
    }
  };

  const getTimeSlotClass = (hour, minute) => {
    let baseClass = "relative p-3 text-center rounded-lg border-2 transition-all duration-200 cursor-pointer ";
    
    if (disabled) {
      return baseClass + "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200";
    }

    const isSelected = selectedHour === hour && selectedMinute === minute;
    const isOccupied = isTimeOccupied(hour, minute);
    const nearbyEvents = getNearbyEvents(hour, minute);
    
    if (isOccupied) {
      return baseClass + "bg-red-100 text-red-700 border-red-300 cursor-not-allowed";
    } else if (isSelected) {
      return baseClass + "bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105";
    } else if (nearbyEvents.length > 0) {
      return baseClass + "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100";
    } else {
      return baseClass + "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300";
    }
  };

  const formatHour = (hour) => {
    const h = parseInt(hour);
    if (h === 12) return '12 PM';
    if (h > 12) return `${h - 12} PM`;
    return `${h} AM`;
  };

  return (
    <div className="time-selector">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="bx bx-time-five mr-2 text-blue-500"></i>
          Seleccionar Horario
        </h3>
        
        {selectedDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700">
              <i className="bx bx-calendar mr-1"></i>
              Fecha seleccionada: {new Date(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {eventsOnSelectedDate.length > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                {eventsOnSelectedDate.length} evento(s) ya programado(s) para este día
              </p>
            )}
          </div>
        )}
      </div>

      {/* Selector de horas */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Hora</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {availableHours.map(hour => (
            <div
              key={hour}
              onClick={() => !disabled && setSelectedHour(hour)}
              className={`p-3 text-center rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                disabled 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : selectedHour === hour
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              <div className="font-medium">{hour}:00</div>
              <div className="text-xs opacity-75">{formatHour(hour)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Selector de minutos */}
      {selectedHour && (
        <div className="mb-6 form-field-enter">
          <h4 className="text-md font-medium text-gray-700 mb-3">Minutos</h4>
          <div className="grid grid-cols-4 gap-2">
            {availableMinutes.map(minute => {
              const timeSlotClass = getTimeSlotClass(selectedHour, minute);
              const isOccupied = isTimeOccupied(selectedHour, minute);
              const nearbyEvents = getNearbyEvents(selectedHour, minute);
              
              return (
                <div key={minute} className="relative">
                  <div
                    onClick={() => !disabled && !isOccupied && handleTimeChange(selectedHour, minute)}
                    className={timeSlotClass}
                  >
                    <div className="font-medium">{selectedHour}:{minute}</div>
                    {isOccupied && (
                      <div className="absolute top-1 right-1">
                        <i className="bx bx-x text-red-500 text-xs"></i>
                      </div>
                    )}
                    {nearbyEvents.length > 0 && !isOccupied && (
                      <div className="absolute top-1 right-1">
                        <i className="bx bx-error-circle text-yellow-500 text-xs"></i>
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip para eventos ocupados o cercanos */}
                  {(isOccupied || nearbyEvents.length > 0) && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {isOccupied 
                          ? `Ocupado: ${eventsOnSelectedDate.find(e => e.time === `${selectedHour}:${minute}`)?.title}`
                          : `Evento cercano: ${nearbyEvents[0]?.title} (${nearbyEvents[0]?.time})`
                        }
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumen de selección */}
      {selectedHour && selectedMinute && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 preview-card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-800">Horario Seleccionado</h4>
              <p className="text-green-700">
                {formatHour(selectedHour)} : {selectedMinute} 
                ({selectedHour}:{selectedMinute})
              </p>
            </div>
            <div className="text-green-500">
              <i className="bx bx-check-circle text-2xl"></i>
            </div>
          </div>
          
          {/* Advertencias de eventos cercanos */}
          {selectedHour && selectedMinute && getNearbyEvents(selectedHour, selectedMinute).length > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-700">
                <i className="bx bx-info-circle mr-1"></i>
                Evento(s) cercano(s): {getNearbyEvents(selectedHour, selectedMinute).map(e => e.title).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSelector; 