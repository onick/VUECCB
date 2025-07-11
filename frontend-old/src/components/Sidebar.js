import React from 'react';

const Sidebar = ({ currentView, setCurrentView, user, onLogout, onShowAuthModal }) => {
  
  const navigationItems = [
    {
      id: 'events',
      label: 'Eventos',
      icon: 'bx-calendar-event',
      description: 'Ver eventos disponibles',
      requiresAuth: false
    },
    {
      id: 'reservations',
      label: 'Mis Reservas',
      icon: 'bx-bookmark',
      description: 'Gestionar mis reservas',
      requiresAuth: true
    },
    {
      id: 'checkin',
      label: 'Check-in',
      icon: 'bx-check-circle',
      description: 'Confirmar asistencia',
      requiresAuth: true
    }
  ];

  const adminItems = [
    {
      id: 'users',
      label: 'Usuarios',
      icon: 'bx-group',
      description: 'Gestión de usuarios',
      requiresAdmin: true
    },
    {
      id: 'reservationsManagement',
      label: 'Reservas',
      icon: 'bx-list-ul',
      description: 'Gestión de reservas',
      requiresAdmin: true
    },
    {
      id: 'attendanceReports',
      label: 'Reportes',
      icon: 'bx-file-blank',
      description: 'Reportes de asistencia',
      requiresAdmin: true
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'bx-bar-chart-alt-2',
      description: 'Métricas en tiempo real',
      requiresAdmin: true
    },
    {
      id: 'create-event',
      label: 'Crear Evento',
      icon: 'bx-plus-circle',
      description: 'Nuevo evento',
      requiresAdmin: true
    }
  ];

  const handleNavigation = (itemId) => {
    if (itemId === 'create-event') {
      setCurrentView('admin'); // Redirect create-event to admin view
    } else {
      setCurrentView(itemId);
    }
  };

  const isItemVisible = (item) => {
    if (item.requiresAdmin) {
      return user && user.is_admin;
    }
    if (item.requiresAuth) {
      return !!user;
    }
    return true;
  };

  const NavItem = ({ item, isActive }) => {
    if (!isItemVisible(item)) return null;

    return (
      <button
        onClick={() => handleNavigation(item.id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
        }`}
      >
        <i className={`bx ${item.icon} text-xl`}></i>
        <div className="flex-1 text-left">
          <div className="font-medium">{item.label}</div>
          <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
            {item.description}
          </div>
        </div>
        {isActive && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </button>
    );
  };

  return (
    <div className="w-64 bg-white shadow-xl flex flex-col h-full border-r border-gray-200">
      {/* Header/Logo */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white shadow-sm">
              <img 
                src="/logo.png" 
                alt="Centro Cultural Banreservas Logo" 
                className="h-8 w-8 object-contain rounded-full"
                style={{
                  filter: 'drop-shadow(0 0 1px rgba(255, 255, 255, 0.6))'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span 
                className="text-blue-600 font-bold text-lg hidden"
                style={{ 
                  display: 'none',
                  filter: 'drop-shadow(0 0 1px rgba(255, 255, 255, 0.6))'
                }}
              >
                CCB
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-gray-800 leading-tight">Centro Cultural</h1>
            <p className="text-sm text-gray-600 font-medium">Banreservas</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={currentView === item.id} 
            />
          ))}
        </div>

        {/* Admin Section */}
        {user && user.is_admin && (
          <>
            <div className="pt-6 pb-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <i className="bx bx-cog"></i>
                <span>Administración</span>
              </div>
            </div>
            <div className="space-y-1">
              {adminItems.map((item) => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  isActive={item.id === 'create-event' ? currentView === 'admin' : currentView === item.id} 
                />
              ))}
            </div>
          </>
        )}

        {/* Auth Required Message for Guest Users */}
        {!user && (
          <div className="pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-700 mb-2">
                <i className="bx bx-lock-alt"></i>
                <span className="font-medium text-sm">Acceso Completo</span>
              </div>
              <p className="text-xs text-blue-600 mb-3">
                Inicia sesión para acceder a reservas, check-in y más funciones.
              </p>
              <button
                onClick={onShowAuthModal}
                className="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <span className="text-sm font-medium text-gray-600">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                {user.is_admin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Admin
                  </span>
                )}
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
            >
              <i className="bx bx-log-out"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2">
                <i className="bx bx-user text-gray-400 text-xl"></i>
              </div>
              <p className="text-sm text-gray-500">Usuario Invitado</p>
            </div>
            <button
              onClick={onShowAuthModal}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 