'use client'

import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/NotificationBell'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

type PendingProject = {
    id: string
    title: string
    content_type: string
    priority: string
    status: string
    deadline: string
    designer_name: string | null
    revision_count: number
    max_revisions_allowed: number
    updated_at: string
}

const contentIcons: Record<string, string> = {
    static: '🖼️',
    reel: '🎬',
    story: '📱',
    carousel: '📊',
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
    urgent: 'text-red-600 font-bold',
}

export default function AprobacionesPage() {
    const { user } = useAuth()
    const [projects, setProjects] = useState<PendingProject[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [actionResult, setActionResult] = useState<{ id: string; type: 'success' | 'error'; message: string } | null>(null)

    const fetchPending = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/projects?status=in_review&limit=50&sortBy=updated_at&sortOrder=desc')
            if (res.ok) {
                const data = await res.json()
                setProjects(data.projects || [])
            }
        } catch (error) {
            console.error('Error loading pending projects:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPending()
    }, [])

    const handleQuickApprove = async (projectId: string, title: string) => {
        setActionLoading(projectId)
        setActionResult(null)
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve' }),
            })

            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== projectId))
                setActionResult({ id: projectId, type: 'success', message: `"${title}" aprobado` })
            } else {
                const data = await res.json()
                setActionResult({ id: projectId, type: 'error', message: data.error || 'Error al aprobar' })
            }
        } catch {
            setActionResult({ id: projectId, type: 'error', message: 'Error de conexión' })
        } finally {
            setActionLoading(null)
        }
    }

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const hours = Math.floor(diff / 3600000)
        if (hours < 1) return 'hace menos de 1 hora'
        if (hours < 24) return `hace ${hours}h`
        const days = Math.floor(hours / 24)
        return `hace ${days} día${days > 1 ? 's' : ''}`
    }

    const getUrgencyLevel = (dateStr: string) => {
        const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / 3600000)
        if (hours >= 72) return 'critical'
        if (hours >= 48) return 'high'
        if (hours >= 24) return 'medium'
        return 'low'
    }

    const urgencyStyles: Record<string, string> = {
        critical: 'border-l-red-500 bg-red-50/30',
        high: 'border-l-orange-500 bg-orange-50/30',
        medium: 'border-l-yellow-500',
        low: 'border-l-blue-500',
    }

    const urgencyLabels: Record<string, string> = {
        critical: '🚨 Urgente — más de 72h sin respuesta',
        high: '⚠️ Más de 48h esperando',
        medium: '⏳ Más de 24h esperando',
        low: '',
    }

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName={userName} userRole="Cliente" />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Pendientes de Aprobación
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {projects.length} proyecto{projects.length !== 1 ? 's' : ''} esperando tu confirmación
                            </p>
                        </div>
                        <NotificationBell />
                    </div>
                </header>

                <div className="p-10">
                    {/* Action Result */}
                    {actionResult && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${actionResult.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                            <span className="text-xl">{actionResult.type === 'success' ? '✅' : '❌'}</span>
                            <span className="font-medium">{actionResult.message}</span>
                        </div>
                    )}

                    {/* Info Banner */}
                    {!loading && projects.length > 0 && (
                        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">💡</span>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Aprueba rápidamente</h3>
                                    <p className="text-sm text-gray-600">
                                        Puedes aprobar directamente desde esta lista o hacer clic en "Ver detalles" para revisar la entrega completa antes de decidir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pending List */}
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                                        <div className="flex-1">
                                            <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                                            <div className="h-4 w-32 bg-gray-100 rounded" />
                                        </div>
                                        <div className="h-10 w-32 bg-gray-200 rounded-xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="card text-center py-16">
                            <div className="text-5xl mb-4">🎉</div>
                            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                                No tienes aprobaciones pendientes
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Todos tus proyectos están al día.
                            </p>
                            <Link href="/dashboard/cliente">
                                <button className="btn-primary">Volver al Dashboard</button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projects.map((project) => {
                                const urgency = getUrgencyLevel(project.updated_at)
                                return (
                                    <div
                                        key={project.id}
                                        className={`card border-l-4 transition-all ${urgencyStyles[urgency]}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                                {contentIcons[project.content_type] || '📄'}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                    {project.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>👤 {project.designer_name || 'Sin asignar'}</span>
                                                    <span className={priorityStyles[project.priority]}>
                                                        ⚡ {priorityLabels[project.priority]}
                                                    </span>
                                                    <span>🔄 {project.revision_count}/{project.max_revisions_allowed ?? '∞'}</span>
                                                    <span className="text-gray-400">{formatTimeAgo(project.updated_at)}</span>
                                                </div>
                                                {urgencyLabels[urgency] && (
                                                    <p className="text-xs mt-1 text-red-600 font-medium">
                                                        {urgencyLabels[urgency]}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-3 flex-shrink-0">
                                                <Link href={`/dashboard/cliente/proyectos/${project.id}`}>
                                                    <button className="px-5 py-3 border-2 border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">
                                                        Ver detalles
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleQuickApprove(project.id, project.title)}
                                                    disabled={actionLoading === project.id}
                                                    className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {actionLoading === project.id ? (
                                                        'Aprobando...'
                                                    ) : (
                                                        <>✅ Aprobar</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
