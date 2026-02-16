'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface NavItem {
  icon: string
  label: string
  href: string
}

interface SidebarProps {
  role: 'cliente' | 'diseñador' | 'admin'
  userName: string
  userRole: string
  userAvatar?: string
}

const navItemsByRole: Record<string, NavItem[]> = {
  cliente: [
    { icon: '🏠', label: 'Inicio', href: '/dashboard/cliente' },
    { icon: '📁', label: 'Mis Proyectos', href: '/dashboard/cliente/proyectos' },
    { icon: '➕', label: 'Nueva Solicitud', href: '/dashboard/cliente/nueva-solicitud' },
    { icon: '💎', label: 'Mi Plan', href: '/dashboard/cliente/plan' },
    { icon: '🗂️', label: 'Biblioteca de Recursos', href: '/dashboard/cliente/recursos' },
    { icon: '📊', label: 'Reportes', href: '/dashboard/cliente/reportes' },
    { icon: '⚙️', label: 'Configuración', href: '/dashboard/cliente/configuracion' },
  ],
  diseñador: [
    { icon: '🏠', label: 'Inicio', href: '/dashboard/disenador' },
    { icon: '📋', label: 'Mis Tareas', href: '/dashboard/disenador/tareas' },
    { icon: '📅', label: 'Calendario', href: '/dashboard/disenador/calendario' },
    { icon: '📊', label: 'Mis Métricas', href: '/dashboard/disenador/metricas' },
    { icon: '🗂️', label: 'Recursos de Clientes', href: '/dashboard/disenador/recursos' },
    { icon: '💼', label: 'Mi Portfolio', href: '/dashboard/disenador/portfolio' },
    { icon: '⚙️', label: 'Configuración', href: '/dashboard/disenador/configuracion' },
  ],
  admin: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/admin' },
    { icon: '📁', label: 'Todos los Proyectos', href: '/dashboard/admin/proyectos' },
    { icon: '👥', label: 'Gestión de Usuarios', href: '/dashboard/admin/usuarios' },
    { icon: '🎨', label: 'Diseñadores', href: '/dashboard/admin/disenadores' },
    { icon: '💼', label: 'Clientes', href: '/dashboard/admin/clientes' },
    { icon: '💎', label: 'Planes y Precios', href: '/dashboard/admin/planes' },
    { icon: '💰', label: 'Facturación', href: '/dashboard/admin/facturacion' },
    { icon: '📈', label: 'Reportes', href: '/dashboard/admin/reportes' },
    { icon: '⚙️', label: 'Configuración', href: '/dashboard/admin/configuracion' },
  ],
}

const roleLabels = {
  cliente: 'Panel de Cliente',
  diseñador: 'Panel de Diseñador',
  admin: 'Panel de Administración',
}

export default function Sidebar({ role, userName, userRole, userAvatar }: SidebarProps) {
  const pathname = usePathname()
  const navItems = navItemsByRole[role]
  const [showMenu, setShowMenu] = useState(false)
  const { logout } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-screen z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="font-display text-2xl font-bold text-primary tracking-tight">
          KUTPLIX
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          {roleLabels[role]}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${isActive
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <span className="text-xl w-6 text-center">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 relative">
        <div
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold">
            {userAvatar || getInitials(userName)}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">{userName}</div>
            <div className="text-xs text-gray-600">{userRole}</div>
          </div>
          <span className="text-lg">⋯</span>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => {
                setShowMenu(false)
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span>⚙️</span>
              <span>Configuración</span>
            </button>
            <button
              onClick={() => {
                setShowMenu(false)
                handleLogout()
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-600 border-t border-gray-200"
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
