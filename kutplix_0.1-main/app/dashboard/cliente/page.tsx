'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function ClienteDashboard() {
  const projects = [
    {
      id: 1,
      title: 'Campaña Redes Sociales - Febrero',
      client: 'Spa Wellness & Beauty',
      designer: 'María González',
      deadline: '20 Feb',
      revisions: '1/2',
      status: 'in-review',
      statusText: 'En Revisión',
      icon: '📱',
      progress: 85
    },
    {
      id: 2,
      title: 'Reel Promocional - Servicios',
      client: 'Clínica Dental SmileCenter',
      designer: 'Carlos Ruiz',
      deadline: '18 Feb',
      revisions: '0/2',
      status: 'in-progress',
      statusText: 'En Proceso',
      icon: '🎬',
      progress: 60
    },
    {
      id: 3,
      title: 'Imagen Estática - Promoción San Valentín',
      client: 'Salón Glamour',
      designer: 'Ana Martínez',
      deadline: '12 Feb',
      revisions: '✓',
      status: 'approved',
      statusText: 'Aprobado',
      icon: '🖼️',
      progress: 100
    },
    {
      id: 4,
      title: 'Carrusel Instagram - Testimonios',
      client: 'Centro Médico Integral',
      designer: 'Sin asignar',
      deadline: '25 Feb',
      revisions: '⏳',
      status: 'pending',
      statusText: 'Pendiente',
      icon: '📊',
      progress: 0
    },
  ]

  const statusStyles: Record<string, string> = {
    'in-review': 'bg-purple-100 text-purple-700',
    'in-progress': 'bg-blue-100 text-primary',
    'approved': 'bg-green-100 text-success',
    'pending': 'bg-orange-100 text-warning',
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        role="cliente" 
        userName="Juan Pérez" 
        userRole="Clínica Dental"
      />

      <main className="flex-1 ml-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-gray-900">
                Dashboard
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Lunes, 14 de Febrero 2026
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  className="w-80 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>

              <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                <span className="text-lg">🔔</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-white text-xs flex items-center justify-center font-semibold">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="card hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  📁
                </div>
              </div>
              <div className="font-display text-4xl font-bold text-gray-900 mb-1">
                12
              </div>
              <div className="text-sm text-gray-600">Proyectos Activos</div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm">
                <span className="text-success font-semibold">+3</span>
                <span className="text-gray-600">este mes</span>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                  ✓
                </div>
              </div>
              <div className="font-display text-4xl font-bold text-gray-900 mb-1">
                28
              </div>
              <div className="text-sm text-gray-600">Proyectos Completados</div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm">
                <span className="text-success font-semibold">+8</span>
                <span className="text-gray-600">este mes</span>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  ⏱️
                </div>
              </div>
              <div className="font-display text-4xl font-bold text-gray-900 mb-1">
                3
              </div>
              <div className="text-sm text-gray-600">En Revisión</div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                Pendientes de aprobación
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mb-10">
            <h3 className="font-display text-lg font-semibold mb-5">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <Link href="/dashboard/cliente/nueva-solicitud">
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <span className="text-xl">➕</span>
                  <span>Nueva Solicitud</span>
                </button>
              </Link>
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <span className="text-xl">📤</span>
                <span>Subir Recursos</span>
              </button>
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <span className="text-xl">💎</span>
                <span>Ver Mi Plan</span>
              </button>
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <span className="text-xl">📊</span>
                <span>Descargar Reporte</span>
              </button>
            </div>
          </div>

          {/* Projects Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold">
                Proyectos Recientes
              </h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
                  Todos
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">
                  En Proceso
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">
                  Revisión
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">
                  Completados
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="grid grid-cols-[auto,1fr,auto,auto] gap-5 items-center p-5 border-2 border-gray-200 rounded-xl hover:border-primary transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                    {project.icon}
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {project.title}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        👤 {project.designer}
                      </span>
                      <span className="flex items-center gap-1">
                        📅 Entrega: {project.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        🔄 {project.revisions}
                      </span>
                    </div>
                  </div>

                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusStyles[project.status]}`}>
                    {project.statusText}
                  </span>

                  <div className="flex gap-2">
                    <button className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
                      👁️
                    </button>
                    <button className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
                      💬
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Card */}
          <div className="mt-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold">Plan Profesional</h3>
              <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold">
                ACTIVO
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2 text-sm">
                <span>Proyectos utilizados</span>
                <span><strong>12</strong> de 15</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/20">
              <span className="text-sm">Renovación: 1 de Marzo 2026</span>
              <button className="px-5 py-2.5 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-all">
                Mejorar Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
