import React, { useState, useEffect } from 'react';
import './App.css';
import RealTimeDashboard from './components/RealTimeDashboard';
import AuthModal from './components/AuthModal';
import UserManagement from './components/UserManagement';
import ReservationsManagement from './components/ReservationsManagement';
import AttendanceReports from './components/AttendanceReports';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import EventCalendar from './components/EventCalendar';
import TimeSelector from './components/TimeSelector';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [currentView, setCurrentView] = useState('events');
  const [loading, setLoading] = useState(false);
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingReservationEvent, setPendingReservationEvent] = useState(null);
  
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication forms
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    location: ''
  });

  // Event creation form
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    capacity: '',
    location: '',
    image_url: ''
  });

  // QR Scanner
  const [qrInput, setQrInput] = useState('');

  const categories = [
    "Dominican Cinema",
    "Classic Cinema", 
    "General Cinema",
    "Workshops",
    "Concerts",
    "Talks/Conferences",
    "Art Exhibitions",
    "3D Immersive Experiences"
  ];

  // Analytics tracking function
  const trackEvent = async (eventType, metadata = {}) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !user) return;

      await fetch(`${BACKEND_URL}/api/analytics/track-event?event_type=${eventType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(metadata)
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  useEffect(() => {
    // Always load events first - no authentication required for viewing
    fetchEvents();
    
    // Check for existing authentication on component mount
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Checking auth status - Token:', token ? 'present' : 'not found');
      console.log('Checking auth status - User:', userData ? 'present' : 'not found');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user data:', parsedUser);
          setUser(parsedUser);
          await fetchReservations();
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Track page views when view changes
  useEffect(() => {
    if (user && currentView) {
      trackEvent('page_view', { 
        page: currentView,
        timestamp: new Date().toISOString()
      });
    }
  }, [currentView, user]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        // Token is invalid or expired, logout user
        handleLogout();
        return;
      }
      
      const data = await response.json();
      // Ensure data is an array
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]); // Set empty array on error
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
      const payload = authMode === 'login' 
        ? { email: authData.email, password: authData.password }
        : authData;

      console.log('Making auth request to:', `${BACKEND_URL}${endpoint}`);
      console.log('Payload:', payload);

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('Authentication successful, storing token and user data');
        
        // Store token and user data
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Token stored:', localStorage.getItem('token'));
        console.log('User stored:', localStorage.getItem('user'));
        
        // Update state
        setUser(data.user);
        console.log('User state updated:', data.user);
        
        // Fetch data
        await fetchEvents();
        await fetchReservations();
        
        // Clear form
        setAuthData({ name: '', email: '', password: '', phone: '', age: '', location: '' });
        
        // Show success message
        alert(`Welcome ${data.user.name}! You are now logged in.`);
      } else {
        console.error('Authentication failed:', data);
        alert(data.detail || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setEvents([]);
    setReservations([]);
    setCurrentView('events');
  };

  // Modal authentication handlers
  const handleModalLogin = async (email, password) => {
    const response = await fetch(`${BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      await fetchReservations();
      
      // If there's a pending reservation, complete it
      if (pendingReservationEvent) {
        await handleReservation(pendingReservationEvent.id);
        setPendingReservationEvent(null);
      }
      
      // Close modal after successful login
      setShowAuthModal(false);
    } else {
      throw new Error(data.detail || 'Login failed');
    }
  };

  const handleModalRegister = async (formData) => {
    // Prepare data to match backend schema
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      age: parseInt(formData.age),
      location: formData.location
    };

    const response = await fetch(`${BACKEND_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      await fetchReservations();
      
      // If there's a pending reservation, complete it
      if (pendingReservationEvent) {
        await handleReservation(pendingReservationEvent.id);
        setPendingReservationEvent(null);
      }
      
      // Close modal after successful registration
      setShowAuthModal(false);
    } else {
      throw new Error(data.detail || 'Registration failed');
    }
  };

  // Handle reservation request - check if user is logged in
  const handleReservationRequest = async (event) => {
    if (!user) {
      // User not logged in, show auth modal
      setPendingReservationEvent(event);
      setShowAuthModal(true);
    } else {
      // User is logged in, proceed with reservation
      await handleReservation(event.id);
    }
  };

  // Actual reservation function (called after authentication)
  const handleReservation = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.id || storedUser.id;
      
      if (!userId) {
        console.error('No user ID found');
        alert('Error: Usuario no identificado. Por favor inicie sesión nuevamente.');
        return;
      }
      
      const response = await fetch(`${BACKEND_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ event_id: eventId, user_id: userId }),
      });

      if (response.status === 401) {
        // Token is invalid or expired, logout user
        handleLogout();
        alert('Su sesión ha expirado. Por favor inicie sesión nuevamente.');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        alert('¡Reserva confirmada! Revise su sección de reservas para ver su código de check-in.');
        trackEvent('reservation_created', { event_id: eventId });
        await fetchEvents();
        await fetchReservations();
      } else {
        alert(data.detail || 'Error en la reserva');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Error de conexión. Por favor intente nuevamente.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...eventData,
          capacity: parseInt(eventData.capacity)
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Event created successfully!');
        await fetchEvents();
        setEventData({
          title: '',
          description: '',
          category: '',
          date: '',
          time: '',
          capacity: '',
          location: '',
          image_url: ''
        });
      } else {
        alert(data.detail || 'Event creation failed');
      }
    } catch (error) {
      console.error('Event creation error:', error);
      alert('Event creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    if (!qrInput.trim()) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: qrInput.trim()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
                        alert(`✓ Check-in exitoso!\n\nParticipante: ${data.user_name}\nEvento: ${data.event_title}\nReserva: ${data.reservation_id}`);
        setQrInput('');
        await fetchReservations();
      } else {
        const error = await response.json();
        let errorMessage = '';
        
        if (error.detail === "No valid reservation found for this identifier") {
          errorMessage = "❌ No se encontró una reserva válida para este identificador.\n\nVerifica que:\n• El código sea correcto\n• El email esté registrado\n• El teléfono sea válido\n• La reserva esté confirmada";
        } else if (error.detail === "Already checked in") {
          errorMessage = "⚠️ Esta persona ya hizo check-in anteriormente.";
        } else if (error.detail === "Cannot check in to a cancelled reservation") {
          errorMessage = "❌ No se puede hacer check-in de una reserva cancelada.";
        } else {
          errorMessage = `❌ Error: ${error.detail}`;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('❌ Error de conexión. Por favor intenta nuevamente.');
    }
  };

  const handleCancelReservation = async (reservationId, eventTitle) => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres cancelar tu reserva para "${eventTitle}"? Esta acción no se puede deshacer.`
      );
      
      if (!confirmed) {
        return; // User canceled the action
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token is invalid or expired, logout user
        handleLogout();
        alert('Su sesión ha expirado. Por favor inicie sesión nuevamente.');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        alert('¡Reserva cancelada exitosamente! Se ha enviado una confirmación por email.');
        trackEvent('reservation_cancelled', { reservation_id: reservationId });
        await fetchEvents(); // Refresh events to update available spots
        await fetchReservations(); // Refresh reservations
      } else {
        alert(data.detail || 'Error al cancelar la reserva');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      alert('Error de conexión. Por favor intente nuevamente.');
    }
  };

  // Removed blocking authentication - events are now publicly accessible

  // Determinar si mostrar el sidebar (solo para usuarios autenticados)
  const shouldShowSidebar = user !== null;

  // Si no hay usuario autenticado, mostrar solo la página pública
  if (!shouldShowSidebar) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Público */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-600 to-blue-700 shadow-md">
                    <img 
                      src="/logo.png" 
                      alt="Centro Cultural Banreservas Logo" 
                      className="h-6 w-6 object-contain rounded-full"
                      style={{
                        filter: 'drop-shadow(0 0 1px rgba(255, 255, 255, 0.6)) brightness(0) invert(1)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span 
                      className="text-white font-bold text-sm hidden"
                      style={{ 
                        display: 'none',
                        filter: 'drop-shadow(0 0 1px rgba(255, 255, 255, 0.6))'
                      }}
                    >
                      CCB
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800 leading-tight">Centro Cultural</h1>
                  <p className="text-sm text-gray-600 font-medium">Banreservas</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Contenido Principal Público */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentView === 'events' && (
            <div>
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Descubre la Cultura
                  </h1>
                  <p className="text-xl mb-6 text-blue-100">
                    Explora nuestra selección de eventos culturales únicos. 
                    Inicia sesión para reservar tu lugar.
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Iniciar Sesión para Reservar
                  </button>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-6">Eventos Disponibles</h2>
              {events.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {events.map(event => (
                  <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {event.image_url && (
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{event.title}</h3>
                        <div className="flex flex-col space-y-1">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {event.category}
                          </span>
                          {event.available_spots <= 5 && event.available_spots > 0 && (
                            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              ¡Últimas plazas!
                            </span>
                          )}
                          {event.available_spots === 0 && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Agotado
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {event.date} at {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 01-4.25 5.197M6 8a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {event.available_spots} lugares disponibles
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                      >
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Iniciar Sesión para Reservar
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-600 mb-4">Próximamente nuevos eventos</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Estamos preparando increíbles experiencias culturales para ti. 
                    ¡Mantente atento a nuestras próximas publicaciones!
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            setPendingReservationEvent(null);
          }}
          onLogin={handleModalLogin}
          onRegister={handleModalRegister}
          eventTitle={pendingReservationEvent?.title}
        />
      </div>
    );
  }

  // Layout administrativo con sidebar (solo para usuarios autenticados)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          onLogout={handleLogout}
          onShowAuthModal={() => setShowAuthModal(true)}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setSidebarOpen(false); // Close sidebar after navigation
        }}
        user={user}
        onLogout={handleLogout}
        onShowAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center" style={{marginLeft: '10px', marginRight: '10px'}}>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span className="text-gray-600 text-xl">☰</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800">Centro Cultural</h1>
            <span className="text-sm text-blue-600">Banreservas</span>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Content Container */}
        <main className="flex-1 overflow-auto" style={{marginLeft: '10px', marginRight: '10px'}}>
          <div className={(currentView === 'users' || currentView === 'analytics') ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'} style={(currentView === 'users' || currentView === 'analytics') ? {margin: 0, padding: '5px'} : {}}>
        {currentView === 'events' && (
          <div>
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Descubre la Cultura
                </h1>
                <p className="text-xl mb-6 text-blue-100">
                  Explora nuestra selección de eventos culturales únicos. 
                  Reserva tu lugar con un solo clic.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Eventos en vivo
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reserva instantánea
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Entrada digital
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Eventos Disponibles</h2>
            {events.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image_url && (
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{event.title}</h3>
                      <div className="flex flex-col space-y-1">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {event.category}
                        </span>
                        {event.available_spots <= 5 && event.available_spots > 0 && (
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            ¡Últimas plazas!
                          </span>
                        )}
                        {event.available_spots === 0 && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Agotado
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 01-4.25 5.197M6 8a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.available_spots} lugares disponibles
                      </div>
                    </div>
                    <button
                      onClick={() => handleReservationRequest(event)}
                      disabled={event.available_spots === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                        event.available_spots > 0
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {event.available_spots > 0 ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Reservar Ahora
                        </span>
                      ) : (
                        'Agotado'
                      )}
                    </button>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-600 mb-4">Próximamente nuevos eventos</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Estamos preparando increíbles experiencias culturales para ti. 
                  ¡Mantente atento a nuestras próximas publicaciones!
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === 'reservations' && user &&
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <i className="bx bx-bookmark mr-2"></i>
                    Mis Reservas
                  </h2>
                  <p className="text-gray-600">Gestiona y revisa todas tus reservas de eventos</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {Array.isArray(reservations) ? reservations.length : 0} reserva{Array.isArray(reservations) && reservations.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setCurrentView('events')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <i className="bx bx-plus mr-2"></i>
                    Nueva Reserva
                  </button>
                </div>
              </div>
            </div>

            {/* Reservations Content - NUEVO DISEÑO GRID */}
            <div>
              {Array.isArray(reservations) && reservations.length > 0 ? (
                <div className="reservation-grid">
                  {reservations.map(item => (
                    <div key={item.reservation.id} className="reservation-card bg-white rounded-xl shadow-md hover:shadow-lg flex flex-col">
                      {/* Header de la tarjeta */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">{item.event.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                            item.reservation.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : item.reservation.status === 'checked_in'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.reservation.status === 'confirmed' ? 'Confirmada' :
                             item.reservation.status === 'checked_in' ? 'Registrado' :
                             'Cancelada'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 line-clamp-1">{item.event.category}</p>
                        <p className="text-sm text-gray-500 flex items-center mb-1">
                          <i className="bx bx-calendar mr-1"></i>
                          {item.event.date}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center mb-1">
                          <i className="bx bx-time mr-1"></i>
                          {item.event.time}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <i className="bx bx-map mr-1"></i>
                          <span className="line-clamp-1">{item.event.location}</span>
                        </p>
                      </div>
                      
                      {/* Contenido principal de la tarjeta */}
                      <div className="p-4 flex-1 flex flex-col">
                        {item.reservation.status !== 'cancelled' && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center flex items-center justify-center">
                              {item.reservation.status === 'confirmed' 
                                ? <><i className="bx bx-mobile mr-1"></i>Check-in</> 
                                : <><i className="bx bx-check-circle mr-1"></i>Completado</>}
                            </h4>
                            
                            {/* Check-in Code */}
                            {item.reservation.checkin_code && (
                              <div className="text-center">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mb-2">
                                  <div className="text-xl font-bold text-blue-700 font-mono tracking-wider mb-1">
                                    {item.reservation.checkin_code}
                                  </div>
                                  <p className="text-xs text-blue-600">
                                    📱 Código de reserva
                                  </p>
                                </div>
                                <p className="text-xs text-gray-600 text-center">
                                  {item.reservation.status === 'confirmed' 
                                    ? 'Presenta este código en el evento' 
                                    : 'Asistencia registrada exitosamente'}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {item.reservation.status === 'cancelled' && (
                          <div className="mb-4">
                            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-center">
                              <p className="text-red-700 font-medium text-sm">Reserva Cancelada</p>
                              <p className="text-xs text-red-600 mt-1">
                                Cancelada el {new Date(item.reservation.cancelled_at || Date.now()).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Botón de acción en la parte inferior */}
                        {item.reservation.status === 'confirmed' && (
                          <div className="mt-auto">
                            <button
                              onClick={() => handleCancelReservation(item.reservation.id, item.event.title)}
                              className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                            >
                              <i className="bx bx-x mr-1"></i>
                              Cancelar Reserva
                            </button>
                          </div>
                        )}
                        
                        {item.reservation.status === 'cancelled' && (
                          <div className="mt-auto">
                            <button
                              onClick={() => setCurrentView('events')}
                              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                              <i className="bx bx-plus mr-1"></i>
                              Nueva Reserva
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-500 mb-2">Aún no tienes reservas</h3>
                  <p className="text-gray-400">Tus reservas de eventos aparecerán aquí</p>
                </div>
              )}
            </div>
          </div>
        }

        {currentView === 'checkin' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <i className="bx bx-check-circle mr-2"></i>
                    Check-in Station
                  </h2>
                  <p className="text-gray-600">Confirma la asistencia de los participantes a eventos</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Sistema Activo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Check-in Content */}
            <div className="bg-white rounded-xl shadow-md p-8 max-w-lg mx-auto">
              <div className="mb-6 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Check-in de Participantes</h3>
                <p className="text-gray-600">Utiliza cualquiera de estos métodos para confirmar la asistencia</p>
              </div>

              {/* Check-in Methods */}
              <div className="space-y-6">
                {/* Method Options */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                      <i className="bx bx-mobile mr-2"></i>
                      Métodos de Check-in disponibles:
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Código de Reserva:</strong> 8 caracteres (ej: ABC123XY)</li>
                      <li>• <strong>Email:</strong> Dirección de correo del participante</li>
                      <li>• <strong>Teléfono:</strong> Número de teléfono registrado</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-green-800 mb-1 flex items-center">
                      <i className="bx bx-check-circle mr-2"></i>
                      Método recomendado
                    </h4>
                    <p className="text-sm text-green-700">
                      El <strong>código de 8 caracteres</strong> es el método más rápido y confiable para hacer check-in.
                    </p>
                  </div>
                </div>

                {/* Input Field */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Código de reserva, email o teléfono"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <button
                    onClick={handleCheckin}
                    disabled={!qrInput.trim()}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <i className="bx bx-check mr-2"></i>
                    Confirmar Check-in
                  </button>
                </div>

                {/* Examples */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <i className="bx bx-info-circle mr-2"></i>
                    Ejemplos de entrada:
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Código:</strong> XY47P9QR</div>
                    <div><strong>Email:</strong> usuario@ejemplo.com</div>
                    <div><strong>Teléfono:</strong> +1-809-555-0123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'admin' && user.is_admin && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center">
                    <i className="bx bx-plus-circle mr-3 text-4xl"></i>
                    Crear Nuevo Evento
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Diseña experiencias culturales únicas para nuestra comunidad
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <span className="text-sm font-semibold">
                      {categories.length} Categorías
                    </span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <span className="text-sm font-semibold">
                      {events.length} Eventos Activos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Event Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <i className="bx bx-edit mr-3 text-blue-600"></i>
                    Información del Evento
                  </h3>
                  
                  <form onSubmit={handleCreateEvent} className="space-y-6">
                    {/* Title and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Título del Evento *
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Noche de Cine Dominicano"
                          value={eventData.title}
                          onChange={(e) => setEventData({...eventData, title: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <select
                          value={eventData.category}
                          onChange={(e) => setEventData({...eventData, category: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          required
                        >
                          <option value="">Selecciona una categoría</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción del Evento *
                      </label>
                      <textarea
                        placeholder="Describe detalladamente el evento, qué pueden esperar los asistentes..."
                        value={eventData.description}
                        onChange={(e) => setEventData({...eventData, description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        rows="4"
                        required
                      />
                    </div>

                    {/* Time, Capacity, Location */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Hora *
                        </label>
                        <div className="relative">
                          <i className="bx bx-time absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                          <input
                            type="time"
                            value={eventData.time}
                            onChange={(e) => setEventData({...eventData, time: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Capacidad *
                        </label>
                        <div className="relative">
                          <i className="bx bx-group absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                          <input
                            type="number"
                            placeholder="50"
                            value={eventData.capacity}
                            onChange={(e) => setEventData({...eventData, capacity: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            min="1"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ubicación *
                        </label>
                        <div className="relative">
                          <i className="bx bx-map absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                          <input
                            type="text"
                            placeholder="Sala Principal"
                            value={eventData.location}
                            onChange={(e) => setEventData({...eventData, location: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        URL de Imagen (opcional)
                      </label>
                      <div className="relative">
                        <i className="bx bx-image absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="url"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={eventData.image_url}
                          onChange={(e) => setEventData({...eventData, image_url: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || !eventData.date}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                      >
                        {loading ? (
                          <>
                            <i className="bx bx-loader-alt animate-spin mr-2"></i>
                            Creando Evento...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-check mr-2"></i>
                            Crear Evento
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column - Calendar and Preview */}
              <div className="space-y-6">
                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <i className="bx bx-calendar mr-2 text-blue-600"></i>
                    Selecciona la Fecha
                  </h4>
                  <EventCalendar
                    selectedDate={eventData.date}
                    onDateSelect={(date) => setEventData({...eventData, date})}
                    existingEvents={events}
                  />
                </div>

                {/* Time Selector */}
                {eventData.date && (
                  <div className="bg-white rounded-xl shadow-md p-6 form-field-enter">
                    <TimeSelector
                      selectedTime={eventData.time}
                      onTimeSelect={(time) => setEventData({...eventData, time})}
                      existingEvents={events}
                      selectedDate={eventData.date}
                    />
                  </div>
                )}

                {/* Event Preview */}
                {(eventData.title || eventData.description || eventData.date) && (
                  <div className="bg-white rounded-xl shadow-md p-6 preview-card">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <i className="bx bx-show mr-2 text-green-600"></i>
                      Vista Previa del Evento
                    </h4>
                    
                    {/* Card Preview - Como se verá en la app */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      {/* Event Image */}
                      {eventData.image_url && (
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                          <img 
                            src={eventData.image_url} 
                            alt={eventData.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center" style={{display: 'none'}}>
                            <i className="bx bx-image text-white text-4xl opacity-50"></i>
                          </div>
                        </div>
                      )}
                      {!eventData.image_url && (
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <i className="bx bx-image text-white text-4xl opacity-50"></i>
                        </div>
                      )}
                      
                      {/* Event Content */}
                      <div className="p-4 space-y-3">
                        {eventData.title && (
                          <h5 className="font-bold text-gray-900 text-xl leading-tight">{eventData.title}</h5>
                        )}
                        
                        {eventData.category && (
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {eventData.category}
                            </span>
                          </div>
                        )}
                        
                        {eventData.description && (
                          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{eventData.description}</p>
                        )}
                        
                        {/* Date and Time */}
                        {eventData.date && (
                          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg p-3">
                            <i className="bx bx-calendar text-blue-600 text-lg"></i>
                            <div>
                              <div className="font-medium">
                                {new Date(eventData.date).toLocaleDateString('es-ES', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              {eventData.time && (
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                  <i className="bx bx-time-five"></i>
                                  {eventData.time}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Location and Capacity */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          {eventData.location && (
                            <div className="flex items-center gap-1">
                              <i className="bx bx-map text-blue-600"></i>
                              <span className="font-medium">{eventData.location}</span>
                            </div>
                          )}
                          {eventData.capacity && (
                            <div className="flex items-center gap-1">
                              <i className="bx bx-group text-blue-600"></i>
                              <span>{eventData.capacity} personas</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Status Indicators */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {eventData.date && eventData.time && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Horario confirmado</span>
                              </div>
                            )}
                            {eventData.title && eventData.description && eventData.category && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Info completa</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            Vista previa
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="mt-4 bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso del evento</span>
                        <span className="text-sm text-gray-600">
                          {[eventData.title, eventData.category, eventData.date, eventData.time, eventData.location, eventData.capacity].filter(Boolean).length}/6
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${([eventData.title, eventData.category, eventData.date, eventData.time, eventData.location, eventData.capacity].filter(Boolean).length / 6) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Información básica</span>
                        <span>Listo para publicar</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
                    <i className="bx bx-lightbulb mr-2"></i>
                    Consejos
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <i className="bx bx-check text-yellow-600 mt-0.5"></i>
                      <span>Revisa el calendario para evitar conflictos de fechas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="bx bx-check text-yellow-600 mt-0.5"></i>
                      <span>Asegúrate de que la capacidad sea realista para el espacio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="bx bx-check text-yellow-600 mt-0.5"></i>
                      <span>Una buena descripción ayuda a atraer más asistentes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'users' && user.is_admin && (
          <UserManagement user={user} />
        )}

        {currentView === 'reservationsManagement' && user.is_admin && (
          <ReservationsManagement token={localStorage.getItem('token')} />
        )}

        {currentView === 'attendanceReports' && user.is_admin && (
          <AttendanceReports token={localStorage.getItem('token')} />
        )}

        {currentView === 'analytics' && user.is_admin && (
          <RealTimeDashboard user={user} />
        )}
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingReservationEvent(null);
        }}
        onLogin={handleModalLogin}
        onRegister={handleModalRegister}
        eventTitle={pendingReservationEvent?.title}
      />
    </div>
  );
}

export default App;