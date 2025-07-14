'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Calendar, 
  UserCheck, 
  Users, 
  FileBarChart, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Building2
} from 'lucide-react'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  badge?: number
  subItems?: Omit<SidebarItem, 'subItems'>[]
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    name: 'Eventos',
    href: '/admin/events',
    icon: Calendar,
    subItems: [
      { name: 'Lista de Eventos', href: '/admin/events', icon: Calendar },
      { name: 'Calendario', href: '/admin/events/calendar', icon: Calendar },
      { name: 'Crear Evento', href: '/admin/events/create', icon: Calendar }
    ]
  },
  {
    name: 'Check-in',
    href: '/admin/checkin',
    icon: UserCheck
  },
  {
    name: 'Usuarios',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Reportes',
    href: '/admin/reports',
    icon: FileBarChart
  }
]

interface AdminSidebarProps {
  className?: string
  onToggle?: (isCollapsed: boolean) => void
}

export default function AdminSidebar({ className = '', onToggle }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    onToggle?.(newCollapsedState)
  }

  // Auto-expand current section
  useEffect(() => {
    sidebarItems.forEach(item => {
      if (item.subItems && item.subItems.some(sub => pathname === sub.href)) {
        setExpandedItems(prev => 
          prev.includes(item.name) ? prev : [...prev, item.name]
        )
      }
    })
  }, [pathname])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    // Implementar logout aquí
    console.log('Logout functionality')
  }

  // Mobile Toggle Button Component
  const MobileToggleButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-ccb-blue text-white shadow-lg hover:bg-ccb-blue/90 transition-colors"
    >
      {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  )

  // Sidebar Content Component  
  const SidebarContent = ({ isMobile = false }) => (
    <motion.div
      initial={false}
      animate={{
        width: isMobile ? '280px' : (isCollapsed ? '80px' : '280px')
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`
        ${className}
        flex flex-col h-full bg-white border-r border-gray-200 shadow-xl
        ${!isMobile && isCollapsed ? 'items-center' : ''}
      `}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${!isMobile && isCollapsed ? 'px-4' : ''}`}>
        <motion.div 
          className="flex items-center space-x-3"
          animate={{ opacity: (!isMobile && isCollapsed) ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-ccb-blue to-ccb-lightblue rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
          </div>
          {(!isMobile && !isCollapsed) || isMobile ? (
            <div>
              <h1 className="text-lg font-bold text-ccb-blue">CCB Admin</h1>
              <p className="text-sm text-gray-500">Centro Cultural</p>
            </div>
          ) : null}
        </motion.div>
        
        {/* Desktop Collapse Button */}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const hasSubItems = item.subItems && item.subItems.length > 0
          const isExpanded = expandedItems.includes(item.name)
          const isItemActive = isActive(item.href)

          return (
            <div key={item.name}>
              {/* Main Item */}
              <div
                className={`
                  relative group
                  ${hasSubItems ? 'cursor-pointer' : ''}
                `}
                onClick={hasSubItems ? () => toggleExpanded(item.name) : undefined}
              >
                <Link
                  href={hasSubItems ? '#' : item.href}
                  className={`
                    flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isItemActive 
                      ? 'bg-gradient-to-r from-ccb-blue to-ccb-lightblue text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-ccb-blue'
                    }
                    ${(!isMobile && isCollapsed) ? 'justify-center' : 'justify-between'}
                  `}
                  onClick={hasSubItems ? (e) => e.preventDefault() : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </div>
                  
                  {((!isMobile && !isCollapsed) || isMobile) && hasSubItems && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                  
                  {((!isMobile && !isCollapsed) || isMobile) && item.badge && (
                    <span className="ml-auto bg-ccb-gold text-ccb-blue text-xs px-2 py-1 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {!isMobile && isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>

              {/* Subitems */}
              {hasSubItems && ((!isMobile && !isCollapsed) || isMobile) && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mt-2 space-y-1">
                        {item.subItems?.map((subItem) => {
                          const SubIcon = subItem.icon
                          const isSubActive = pathname === subItem.href
                          
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`
                                flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
                                ${isSubActive 
                                  ? 'bg-ccb-blue/10 text-ccb-blue font-medium border-l-2 border-ccb-blue' 
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-ccb-blue'
                                }
                              `}
                            >
                              <SubIcon size={16} className="mr-3 flex-shrink-0" />
                              <span className="truncate">{subItem.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-200 ${!isMobile && isCollapsed ? 'px-2' : ''}`}>
        <div className="relative group">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-3 text-sm font-medium text-gray-700 rounded-xl
              hover:bg-red-50 hover:text-red-600 transition-all duration-200
              ${(!isMobile && isCollapsed) ? 'justify-center' : 'space-x-3'}
            `}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {((!isMobile && !isCollapsed) || isMobile) && <span>Cerrar Sesión</span>}
          </button>
          
          {!isMobile && isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Cerrar Sesión
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileToggleButton />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">
        <SidebarContent isMobile={false} />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 z-50"
            >
              <SidebarContent isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}