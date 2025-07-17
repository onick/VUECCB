'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  ArrowLeft,
  Loader2,
  Shield,
  Lock,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService, UserCreate } from '@/services/api';

// Validation schema
const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  phone: z.string().optional(),
  age: z.number().min(1, 'La edad debe ser mayor a 0').max(120, 'Edad inválida').optional(),
  location: z.string().optional(),
  is_admin: z.boolean().default(false)
});

type UserFormData = z.infer<typeof userSchema>;

// Function to generate secure password
const generateSecurePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function CreateUserPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      age: undefined,
      location: '',
      is_admin: false
    }
  });

  const watchedPassword = watch('password');

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Creando usuario:', data);
      
      // Prepare user data for API
      const userData: UserCreate = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        age: data.age || undefined,
        location: data.location || undefined,
        is_admin: data.is_admin || false
      };

      const newUser = await apiService.createUser(userData);
      
      console.log('Usuario creado exitosamente:', newUser);
      
      // Redirect to users list
      router.push('/admin/users');
      
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle specific error messages
      if (error instanceof Error) {
        if (error.message.includes('email')) {
          setError('El email ya está en uso. Por favor elige otro.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Error al crear el usuario. Por favor intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setValue('password', newPassword);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/users"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Crear Usuario
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Agregar un nuevo usuario al sistema
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link 
            href="/admin/users"
            className="px-4 py-2 text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </div>

      {/* Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Información del Usuario
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Nombre Completo *
                </label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre completo del usuario"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="email@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Contraseña del usuario"
                  />
                  <div className="absolute right-2 top-2 flex space-x-1">
                    <button
                      type="button"
                      onClick={handleTogglePasswordVisibility}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Generar contraseña segura"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                {watchedPassword && (
                  <div className="mt-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        watchedPassword.length >= 6 ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={watchedPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}>
                        Al menos 6 caracteres
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="(809) 555-0123"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Edad
                </label>
                <input
                  {...register('age', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Edad en años"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Ubicación
                </label>
                <input
                  {...register('location')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ciudad, País"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* Admin Status */}
              <div className="flex items-center space-x-3">
                <input
                  {...register('is_admin')}
                  type="checkbox"
                  id="is_admin"
                  className="w-4 h-4 text-ccb-blue border-gray-300 rounded focus:ring-ccb-blue focus:ring-2"
                />
                <label htmlFor="is_admin" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Shield className="w-4 h-4 mr-2" />
                  Otorgar permisos de administrador
                </label>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Seguridad de la Cuenta
                  </h3>
                  <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Usa el botón de generar contraseña para crear una contraseña segura</li>
                    <li>• Los permisos de administrador otorgan acceso completo al sistema</li>
                    <li>• El usuario recibirá un email de bienvenida con sus credenciales</li>
                    <li>• Se recomienda que el usuario cambie su contraseña en el primer inicio de sesión</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                Vista Previa del Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Nombre:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    {watch('name') || 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Email:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    {watch('email') || 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Teléfono:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    {watch('phone') || 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Edad:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    {watch('age') || 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Ubicación:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    {watch('location') || 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Rol:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    watch('is_admin') ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {watch('is_admin') ? 'Administrador' : 'Usuario'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
              <Link 
                href="/admin/users"
                className="px-6 py-2 text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creando Usuario...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Crear Usuario</span>
                  </>
                )}
              </button>
            </div>

            {/* Form Help */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ayuda
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Los campos marcados con * son obligatorios</li>
                <li>• El email debe ser único en el sistema</li>
                <li>• La contraseña debe tener al menos 6 caracteres</li>
                <li>• Los usuarios pueden actualizar su información personal más tarde</li>
              </ul>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}