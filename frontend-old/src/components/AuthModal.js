import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister, eventTitle }) => {
  const [mode, setMode] = useState('choose'); // 'choose', 'login', 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    location: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      if (mode === 'login') {
        await onLogin(formData.email, formData.password);
      } else if (mode === 'register') {
        // Convertir age a número
        const userData = {
          ...formData,
          age: parseInt(formData.age)
        };
        await onRegister(userData);
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      // Manejar error específico de email ya registrado
      if (error.response?.status === 500 && error.response?.data?.detail?.includes('Email already registered')) {
        setErrors({ 
          general: `El email ${formData.email} ya está registrado. ¿Ya tienes cuenta?`,
          showLoginButton: true
        });
      } else if (error.response?.status === 401) {
        setErrors({ general: 'Email o contraseña incorrectos' });
      } else {
        setErrors({ 
          general: error.response?.data?.detail || 'Error en el proceso. Intenta nuevamente.' 
        });
      }
    }
  };

  const resetModal = () => {
    setMode('choose');
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      age: '',
      location: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {mode === 'choose' && '¡Ya casi tienes tu lugar!'}
                {mode === 'login' && 'Inicia Sesión'}
                {mode === 'register' && 'Crear Cuenta'}
              </h2>
              {eventTitle && (
                <p className="text-gray-600 mt-1">Reservando: <span className="font-semibold">{eventTitle}</span></p>
              )}
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Choose Mode */}
          {mode === 'choose' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Para completar tu reserva, por favor inicia sesión o crea una cuenta rápida
              </p>
              
              <button
                onClick={() => setMode('register')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
              >
                🎯 Crear Cuenta Nueva
              </button>
              
              <button
                onClick={() => setMode('login')}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                Ya tengo cuenta
              </button>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>✨ Proceso rápido - menos de 1 minuto</p>
                <p>📧 Recibirás tu QR por email</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {errors.general && (
                <div className="text-red-600 text-sm">{errors.general}</div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setMode('choose')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Iniciar Sesión
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ¿No tienes cuenta? Crear una
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Santo Domingo, Santiago, etc."
                  required
                />
              </div>

              {errors.general && (
                <div className="text-red-600 text-sm">
                  {errors.general}
                  {errors.showLoginButton && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrors({});
                        }}
                        className="text-blue-600 hover:text-blue-700 underline text-sm"
                      >
                        Iniciar sesión con esta cuenta
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setMode('choose')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Crear Cuenta
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 