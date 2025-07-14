'use client'

import React from 'react'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-30">
        <AdminSidebar />
      </div>

      {/* Main Content Area - Responsive margins */}
      <div className="lg:ml-[280px] min-h-screen transition-all duration-300">
        {/* Content Header with mobile padding for menu button */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 pt-20 lg:pt-4">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}