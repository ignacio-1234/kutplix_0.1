'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

type ProjectSummary = {
  id: string
  title: string
  designer_name: string
  deadline: string
  revision_count: number
  max_revisions_allowed: number
  status: string
  content_type: string
  company_name: string
}

type Stats = {
  activeProjects: number
  completedProjects: number
  inReviewProjects: number
  totalProjects: number
  thisMonthNew: number
  thisMonthCompleted: number
}

type PlanInfo = {
  name: string
  monthlyProjects: number | null
  maxRevisions: number
  projectsUsed: number
  renewalDate: string
} | null

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En Proceso',
  in_review: 'En Revisión',
  changes_requested: 'Cambios Solicitados',
  approved: 'Aprobado',
  cancelled: 'Cancelado',
}

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  in_progress: 'bg-blue-100 text-primary',
  in_review: 'bg-purple-100 text-purple-700',
  changes_requested: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-500',
}

const contentIcons: Record<string, string> = {
  static: '🖼️',
  reel: '🎬',
  story: '📱',
  carousel: '📊',
}

export default function ClienteDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [plan, setPlan] = useState<PlanInfo>(null)
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [statsRes, projectsRes] = await Promise.all([
          fetch('/api/client/stats'),
          fetch('/api/projects?limit=5&sortBy=created_at&sortOrder=desc'),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.stats)
          setPlan(statsData.plan)
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setProjects(projectsData.projects || [])
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => {
      if (activeFilter === 'active') return ['in_progress', 'pending'].includes(p.status)
      if (activeFilter === 'review') return ['in_review', 'changes_requested'].includes(p.status)
      if (activeFilter === 'completed') return p.status === 'approved'
      return true
    })

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Sin fecha'
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    })
  }

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role="cliente"
        userName={userName}
        userRole="Cliente"
      />

      <main className="flex-1 ml-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-gray-900">
                Dashboard
              </h2>
              <p className="text-sm text-gray-600 mt-1 capitalize">
                {today}
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
                {stats && stats.inReviewProjects > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                    {stats.inReviewProjects}
                  </span>
                )}
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
              {loading ? (
                <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-1" />
              ) : (
                <div className="font-display text-4xl font-bold text-gray-900 mb-1">
                  {stats?.activeProjects ?? 0}
                </div>
              )}
              <div className="text-sm text-gray-600">Proyectos Activos</div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm">
                <span className="text-green-600 font-semibold">+{stats?.thisMonthNew ?? 0}</span>
                <span className="text-gray-600">este mes</span>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                  ✓
                </div>
              </div>
              {loading ? (
                <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-1" />
              ) : (
                <div className="font-display text-4xl font-bold text-gray-900 mb-1">
                  {stats?.completedProjects ?? 0}
                </div>
              )}
              <div className="text-sm text-gray-600">Proyectos Completados</div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm">
                <span className="text-green-600 font-semibold">+{stats?.thisMonthCompleted ?? 0}</span>
                <span className="text-gray-600">este mes</span>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  ⏱️
                </div>
              </div>
              {loading ? (
                <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-1" />
              ) : (
                <div className="font-display text-4xl font-bold text-gray-900 mb-1">
                  {stats?.inReviewProjects ?? 0}
                </div>
              )}
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
              <Link href="/dashboard/cliente/proyectos">
                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                  <span className="text-xl">📁</span>
                  <span>Mis Proyectos</span>
                </button>
              </Link>
              <Link href="/dashboard/cliente/plan">
                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                  <span className="text-xl">💎</span>
                  <span>Ver Mi Plan</span>
                </button>
              </Link>
              <Link href="/dashboard/cliente/reportes">
                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                  <span className="text-xl">📊</span>
                  <span>Descargar Reporte</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Projects Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold">
                Proyectos Recientes
              </h3>
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'active', label: 'Activos' },
                  { key: 'review', label: 'Revisión' },
                  { key: 'completed', label: 'Completados' },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === filter.key
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-5 border-2 border-gray-200 rounded-xl animate-pulse">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-32 bg-gray-100 rounded" />
                      </div>
                      <div className="h-6 w-20 bg-gray-200 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📁</div>
                  <div className="text-gray-500 font-medium">No hay proyectos aún</div>
                  <div className="text-gray-400 text-sm mt-1">
                    Crea tu primera solicitud para comenzar
                  </div>
                  <Link href="/dashboard/cliente/nueva-solicitud">
                    <button className="btn-primary mt-4">
                      ➕ Nueva Solicitud
                    </button>
                  </Link>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="grid grid-cols-[auto,1fr,auto,auto] gap-5 items-center p-5 border-2 border-gray-200 rounded-xl hover:border-primary transition-all cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                      {contentIcons[project.content_type] || '📄'}
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        {project.title}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          👤 {project.designer_name || 'Sin asignar'}
                        </span>
                        <span className="flex items-center gap-1">
                          📅 Entrega: {formatDate(project.deadline)}
                        </span>
                        <span className="flex items-center gap-1">
                          🔄 {project.revision_count}/{project.max_revisions_allowed ?? '—'}
                        </span>
                      </div>
                    </div>

                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusStyles[project.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[project.status] || project.status}
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
                ))
              )}
            </div>

            {projects.length > 0 && (
              <div className="mt-6 text-center">
                <Link href="/dashboard/cliente/proyectos">
                  <button className="text-primary font-semibold text-sm hover:underline">
                    Ver todos los proyectos →
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Plan Card */}
          <div className="mt-10 bg-gradient-to-br from-primary to-blue-800 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold">
                {plan?.name || 'Sin Plan'}
              </h3>
              <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold">
                ACTIVO
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2 text-sm">
                <span>Proyectos utilizados</span>
                <span>
                  <strong>{plan?.projectsUsed ?? 0}</strong> de {plan?.monthlyProjects ?? '∞'}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{
                    width: plan?.monthlyProjects
                      ? `${Math.min((plan.projectsUsed / plan.monthlyProjects) * 100, 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/20">
              <span className="text-sm">
                {plan?.renewalDate
                  ? `Renovación: ${new Date(plan.renewalDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : 'Sin plan activo'
                }
              </span>
              <Link href="/dashboard/cliente/plan">
                <button className="px-5 py-2.5 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-all">
                  Mejorar Plan
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
