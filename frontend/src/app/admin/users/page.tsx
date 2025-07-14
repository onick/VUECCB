'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Search, Filter, MoreVertical } from 'lucide-react'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="mt-2 text-gray-600">
            Administra los usuarios del sistema y sus permisos
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors">
            <UserPlus size={20} className="mr-2" />
            Nuevo Usuario
          </button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccb-blue focus:border-transparent"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} className="mr-2" />
            Filtros
          </button>
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Sample user data */}
              {[
                {
                  id: 1,
                  name: 'Administrador Sistema',
                  email: 'admin@banreservas.com.do',
                  role: 'Administrador',
                  status: 'Activo',
                  lastAccess: '2025-07-14 09:30'
                },
                {
                  id: 2,
                  name: 'Maria González',
                  email: 'maria.gonzalez@banreservas.com.do',
                  role: 'Editor',
                  status: 'Activo',
                  lastAccess: '2025-07-13 16:45'
                },
                {
                  id: 3,
                  name: 'Carlos Pérez',
                  email: 'carlos.perez@banreservas.com.do',
                  role: 'Visualizador',
                  status: 'Inactivo',
                  lastAccess: '2025-07-10 11:20'
                }
              ].map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ccb-blue to-ccb-lightblue flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Administrador' 
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'Editor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastAccess}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-ccb-blue/10 to-ccb-lightblue/10 p-6 rounded-xl border border-ccb-blue/20"
      >
        <div className="flex items-center space-x-3">
          <Users className="text-ccb-blue" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-ccb-blue">Funcionalidad en Desarrollo</h3>
            <p className="text-gray-600 mt-1">
              La gestión completa de usuarios estará disponible en la próxima versión. 
              Incluirá creación, edición, asignación de roles y gestión de permisos.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}