'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

type Project = {
    id: string
    title: string
    description: string
    content_type: string
    priority: string
    status: string
    deadline: string
    designer_name: string
    client_name: string
    revision_count: number
    max_revisions_allowed: number
    created_at: string
}

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

const priorityLabels: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
}

const priorityStyles: Record<string, string> = {
    low: 'text-green-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
}

const contentIcons: Record<string, string> = {
    static: '🖼️',
    reel: '🎬',
    story: '📱',
    carousel: '📊',
}

const contentLabels: Record<string, string> = {
    static: 'Imagen',
    reel: 'Reel',
    story: 'Historia',
    carousel: 'Carrusel',
}

export default function MisProyectosPage() {
    const { user } = useAuth()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                sortBy: 'created_at',
                sortOrder: 'desc',
            })
            if (statusFilter !== 'all') params.set('status', statusFilter)
            if (search) params.set('search', search)

            const res = await fetch(`/api/projects?${params}`)
            if (res.ok) {
                const data = await res.json()
                setProjects(data.projects || [])
                setTotalPages(data.pagination?.totalPages || 1)
                setTotal(data.pagination?.total || 0)
            }
        } catch (error) {
            console.error('Error loading projects:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [statusFilter, currentPage])

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1)
            fetchProjects()
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'

    const statusFilters = [
        { key: 'all', label: 'Todos' },
        { key: 'pending', label: 'Pendientes' },
        { key: 'in_progress', label: 'En Proceso' },
        { key: 'in_review', label: 'En Revisión' },
        { key: 'approved', label: 'Aprobados' },
    ]

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
                                Mis Proyectos
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Gestiona todos tus proyectos de diseño
                            </p>
                        </div>

                        <Link href="/dashboard/cliente/nueva-solicitud">
                            <button className="btn-primary flex items-center gap-2">
                                <span>➕</span>
                                <span>Nueva Solicitud</span>
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <div className="p-10">
                    {/* Filters */}
                    <div className="card mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2 flex-wrap">
                                {statusFilters.map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => { setStatusFilter(filter.key); setCurrentPage(1) }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === filter.key
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por título..."
                                    className="w-64 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>
                        </div>

                        <div className="text-sm text-gray-500">
                            {total} proyecto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Projects List */}
                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                                        <div className="flex-1">
                                            <div className="h-4 w-56 bg-gray-200 rounded mb-2" />
                                            <div className="h-3 w-40 bg-gray-100 rounded" />
                                        </div>
                                        <div className="h-6 w-24 bg-gray-200 rounded-lg" />
                                    </div>
                                </div>
                            ))
                        ) : projects.length === 0 ? (
                            <div className="card text-center py-16">
                                <div className="text-5xl mb-4">📁</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No hay proyectos
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {statusFilter !== 'all'
                                        ? 'No hay proyectos con este filtro.'
                                        : '¡Crea tu primera solicitud de diseño!'}
                                </p>
                                <Link href="/dashboard/cliente/nueva-solicitud">
                                    <button className="btn-primary">➕ Nueva Solicitud</button>
                                </Link>
                            </div>
                        ) : (
                            projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="card hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/30"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                            {contentIcons[project.content_type] || '📄'}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 line-clamp-1">
                                                        {project.description || 'Sin descripción'}
                                                    </p>
                                                </div>

                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 ${statusStyles[project.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {statusLabels[project.status] || project.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-5 text-sm text-gray-600 mt-3">
                                                <span className="flex items-center gap-1">
                                                    {contentIcons[project.content_type]} {contentLabels[project.content_type] || project.content_type}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    👤 {project.designer_name || 'Sin asignar'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    📅 {formatDate(project.deadline)}
                                                </span>
                                                <span className={`flex items-center gap-1 font-medium ${priorityStyles[project.priority] || ''}`}>
                                                    ⚡ {priorityLabels[project.priority] || project.priority}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    🔄 {project.revision_count}/{project.max_revisions_allowed ?? '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ← Anterior
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
