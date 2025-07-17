'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  Users, 
  TrendingUp, 
  PieChart,
  BarChart3,
  Filter,
  CalendarDays
} from 'lucide-react'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last-30-days')
  const [reportType, setReportType] = useState('events')

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
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analytics</h1>
          <p className="mt-2 text-gray-600">
            Análisis detallado de eventos, asistencia y métricas del centro cultural
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-ccb-blue text-white rounded-lg hover:bg-ccb-blue/90 transition-colors">
            <Download size={20} className="mr-2" />
            Exportar Reporte
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ccb-blue focus:border-transparent"
            >
              <option value="events">Eventos</option>
              <option value="attendance">Asistencia</option>
              <option value="revenue">Ingresos</option>
              <option value="categories">Categorías</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ccb-blue focus:border-transparent"
            >
              <option value="last-7-days">Últimos 7 días</option>
              <option value="last-30-days">Últimos 30 días</option>
              <option value="last-3-months">Últimos 3 meses</option>
              <option value="last-year">Último año</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Exportación
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ccb-blue focus:border-transparent">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          {
            title: 'Total Eventos',
            value: '156',
            change: '+12%',
            icon: Calendar,
            color: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Asistentes',
            value: '8,247',
            change: '+25%',
            icon: Users,
            color: 'from-green-500 to-green-600'
          },
          {
            title: 'Tasa Ocupación',
            value: '78%',
            change: '+5%',
            icon: TrendingUp,
            color: 'from-yellow-500 to-yellow-600'
          },
          {
            title: 'Ingresos',
            value: 'RD$125,400',
            change: '+18%',
            icon: BarChart3,
            color: 'from-purple-500 to-purple-600'
          }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">{stat.change}</span>
                  <span className="text-gray-500"> vs período anterior</span>
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Asistencia por Mes</h3>
            <BarChart3 size={20} className="text-ccb-blue" />
          </div>
          
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Gráfico de asistencia mensual</p>
              <p className="text-sm text-gray-400 mt-1">Datos simulados - En desarrollo</p>
            </div>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Distribución por Categoría</h3>
            <PieChart size={20} className="text-ccb-blue" />
          </div>
          
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Distribución de eventos por categoría</p>
              <p className="text-sm text-gray-400 mt-1">Datos simulados - En desarrollo</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Reportes Recientes</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  name: 'Reporte Mensual Eventos',
                  period: 'Junio 2025',
                  generated: '2025-07-01',
                  status: 'Completado'
                },
                {
                  name: 'Análisis de Asistencia',
                  period: 'Q2 2025',
                  generated: '2025-07-05',
                  status: 'Completado'
                },
                {
                  name: 'Reporte de Ingresos',
                  period: 'Último trimestre',
                  generated: '2025-07-10',
                  status: 'Procesando'
                }
              ].map((report, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileBarChart size={20} className="text-ccb-blue mr-3" />
                      <span className="text-sm font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.generated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'Completado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-ccb-blue hover:text-ccb-blue/80 transition-colors">
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Development Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-r from-ccb-blue/10 to-ccb-lightblue/10 p-6 rounded-xl border border-ccb-blue/20"
      >
        <div className="flex items-center space-x-3">
          <FileBarChart className="text-ccb-blue" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-ccb-blue">Sistema de Reportes en Desarrollo</h3>
            <p className="text-gray-600 mt-1">
              Los gráficos interactivos y reportes avanzados estarán disponibles próximamente. 
              Incluirá integración con Chart.js, exportación automática y dashboards personalizables.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}