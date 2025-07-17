'use client';

import React, { useState, useEffect } from 'react';
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
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, UserUpdate } from '@/services/api';
import { apiService } from '@/services/api';

// Validation schema
const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  age: z.number().min(1, 'La edad debe ser mayor a 0').max(120, 'Edad inválida').optional(),
  location: z.string().optional(),
  is_admin: z.boolean().default(false)
});

type UserFormData = z.infer<typeof userSchema>;

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      age: undefined,
      location: '',
      is_admin: false
    }
  });

  useEffect(() => {
    loadUser();
  }, [params.id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await apiService.getUser(params.id);
      console.log('Usuario cargado para edición:', userData);
      
      setUser(userData);
      
      // Pre-fill form with user data
      reset({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        age: userData.age || undefined,
        location: userData.location || '',
        is_admin: userData.is_admin
      });
      
    } catch (error) {
      console.error('Error loading user:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare update data
      const updateData: UserUpdate = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        age: data.age || undefined,
        location: data.location || undefined,
        is_admin: data.is_admin
      };

      console.log('Updating user with data:', updateData);
      
      await apiService.updateUser(user.id, updateData);
      
      // Redirect to user detail page
      router.push(`/admin/users/${user.id}`);
      
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ccb-blue"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar usuario</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a usuarios
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Usuario no encontrado</h2>
          <p className="text-yellow-600 mb-4">El usuario solicitado no existe o ha sido eliminado.</p>
          <Link 
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a usuarios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href={`/admin/users/${user.id}`}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Editar Usuario
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Modificar información del usuario: {user.name}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link 
            href={`/admin/users/${user.id}`}
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
                  Administrador
                </label>
              </div>
            </div>

            {/* Current Status Display */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado Actual
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Creado: {new Date(user.created_at).toLocaleDateString('es-ES')}
                </span>
                {user.updated_at && (
                  <span className="text-gray-600 dark:text-gray-400">
                    Actualizado: {new Date(user.updated_at).toLocaleDateString('es-ES')}
                  </span>
                )}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.is_admin ? 'bg-purple-100 text-purple-800' : 
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.is_admin ? 'Administrador' : user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Statistics Display */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estadísticas
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-semibold text-ccb-blue">
                    {user.total_reservations || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Reservas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-ccb-blue">
                    {user.attended_events || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Asistencias</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-ccb-blue">
                    {(user.attendance_rate || 0).toFixed(1)}%
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Tasa Asistencia</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
              <Link 
                href={`/admin/users/${user.id}`}
                className="px-6 py-2 text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="px-6 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>

            {/* Unsaved Changes Warning */}
            {isDirty && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Tienes cambios sin guardar. Asegúrate de hacer clic en "Guardar Cambios" antes de salir.
                </p>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}