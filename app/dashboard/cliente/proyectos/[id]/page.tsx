'use client'

import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/NotificationBell'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useParams, useRouter } from 'next/navigation'

type Delivery = {
    id: string
    version: number
    content_url: string
    notes: string | null
    delivered_at: string
    status: string
}

type Resource = {
    id: string
    file_name: string
    file_url: string
    file_type: string | null
    file_size: number | null
    category: string
    uploaded_at: string
}

type ProjectDetail = {
    id: string
    title: string
    description: string
    content_type: string
    priority: string
    status: string
    deadline: string
    revision_count: number
    max_revisions_allowed: number
    designer_name: string | null
    company_name: string
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

export default function ProjectDetailPage() {
    const { user } = useAuth()
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string

    const [project, setProject] = useState<ProjectDetail | null>(null)
    const [deliveries, setDeliveries] = useState<Delivery[]>([])
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [comments, setComments] = useState('')
    const [showChangesForm, setShowChangesForm] = useState(false)
    const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/projects/${projectId}`)
                if (res.ok) {
                    const data = await res.json()
                    setProject(data.project)
                    setDeliveries(data.deliveries || [])
                    setResources(data.resources || [])
                }
            } catch (error) {
                console.error('Error loading project:', error)
            } finally {
                setLoading(false)
            }
        }
        if (projectId) fetchProject()
    }, [projectId])

    const handleAction = async (action: 'approve' | 'request_changes' | 'cancel') => {
        setActionLoading(true)
        setActionResult(null)
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    ...(action === 'request_changes' && comments ? { comments } : {}),
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setProject(data.project)
                setShowChangesForm(false)
                setComments('')
                const messages: Record<string, string> = {
                    approve: 'Proyecto aprobado exitosamente',
                    request_changes: 'Cambios solicitados exitosamente',
                    cancel: 'Proyecto cancelado',
                }
                setActionResult({ type: 'success', message: messages[action] })
            } else {
                setActionResult({ type: 'error', message: data.error || 'Error al procesar la acción' })
            }
        } catch (error) {
            setActionResult({ type: 'error', message: 'Error de conexión' })
        } finally {
            setActionLoading(false)
        }
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'
    const needsAction = project?.status === 'in_review'

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar role="cliente" userName={userName} userRole="Cliente" />
                <main className="flex-1 ml-72 p-10">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-64 bg-gray-200 rounded" />
                        <div className="h-48 bg-gray-200 rounded-2xl" />
                        <div className="h-32 bg-gray-200 rounded-2xl" />
                    </div>
                </main>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex min-h-screen">
                <Sidebar role="cliente" userName={userName} userRole="Cliente" />
                <main className="flex-1 ml-72 p-10 text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Proyecto no encontrado</h2>
                    <Link href="/dashboard/cliente/proyectos">
                        <button className="btn-primary mt-4">Volver a Proyectos</button>
                    </Link>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName={userName} userRole="Cliente" />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/cliente/proyectos" className="text-gray-400 hover:text-gray-600">
                                ← Volver
                            </Link>
                            <div>
                                <h2 className="font-display text-2xl font-semibold text-gray-900">
                                    {project.title}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Creado {formatDate(project.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusStyles[project.status] || 'bg-gray-100'}`}>
                                {statusLabels[project.status] || project.status}
                            </span>
                            <NotificationBell />
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Action Result Toast */}
                    {actionResult && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${actionResult.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                            <span className="text-xl">{actionResult.type === 'success' ? '✅' : '❌'}</span>
                            <span className="font-medium">{actionResult.message}</span>
                        </div>
                    )}

                    {/* Approval Action Card — Only shown when project is in_review */}
                    {needsAction && (
                        <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-8 animate-slideUp">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">⏳</span>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-gray-900">
                                        Se requiere tu aprobación
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Revisa la entrega y confirma para continuar con el proceso.
                                    </p>
                                </div>
                            </div>

                            {!showChangesForm ? (
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => handleAction('approve')}
                                        disabled={actionLoading}
                                        className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        <span className="text-2xl">✅</span>
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => setShowChangesForm(true)}
                                        disabled={actionLoading}
                                        className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        <span className="text-2xl">✏️</span>
                                        Solicitar Cambios
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Describe los cambios que necesitas:
                                        </label>
                                        <textarea
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                            placeholder="Ej: Cambiar el color del fondo, ajustar el texto principal..."
                                            className="input min-h-[120px] resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAction('request_changes')}
                                            disabled={actionLoading}
                                            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                                        >
                                            {actionLoading ? 'Enviando...' : 'Enviar solicitud de cambios'}
                                        </button>
                                        <button
                                            onClick={() => { setShowChangesForm(false); setComments('') }}
                                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Revisiones utilizadas: {project.revision_count}/{project.max_revisions_allowed ?? '∞'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-8">
                        {/* Left Column: Project Details */}
                        <div className="col-span-2 space-y-6">
                            {/* Project Info */}
                            <div className="card">
                                <h3 className="font-display text-lg font-semibold mb-4">Detalles del Proyecto</h3>
                                <p className="text-gray-600 mb-6">{project.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Tipo de contenido</span>
                                        <div className="font-semibold mt-1">{project.content_type}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Prioridad</span>
                                        <div className="font-semibold mt-1">{project.priority}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Fecha de entrega</span>
                                        <div className="font-semibold mt-1">{formatDate(project.deadline)}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Diseñador</span>
                                        <div className="font-semibold mt-1">{project.designer_name || 'Sin asignar'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Deliveries */}
                            <div className="card">
                                <h3 className="font-display text-lg font-semibold mb-4">
                                    Entregas ({deliveries.length})
                                </h3>
                                {deliveries.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-3xl mb-2">📦</div>
                                        <p>Aún no hay entregas para este proyecto</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {deliveries.map((delivery) => (
                                            <div key={delivery.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary/30 transition-all">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-900">
                                                        Versión {delivery.version}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(delivery.delivered_at)}
                                                    </span>
                                                </div>
                                                {delivery.notes && (
                                                    <p className="text-sm text-gray-600 mb-3">{delivery.notes}</p>
                                                )}
                                                {delivery.content_url && (
                                                    <a
                                                        href={delivery.content_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                                                    >
                                                        📎 Ver archivo entregado
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Resources + Meta */}
                        <div className="space-y-6">
                            {/* Quick Status */}
                            <div className="card">
                                <h3 className="font-display text-lg font-semibold mb-4">Resumen</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Estado</span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[project.status]}`}>
                                            {statusLabels[project.status]}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Revisiones</span>
                                        <span className="font-semibold">
                                            {project.revision_count}/{project.max_revisions_allowed ?? '∞'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Entregas</span>
                                        <span className="font-semibold">{deliveries.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="card">
                                <h3 className="font-display text-lg font-semibold mb-4">
                                    Recursos ({resources.length})
                                </h3>
                                {resources.length === 0 ? (
                                    <p className="text-sm text-gray-500">Sin recursos</p>
                                ) : (
                                    <div className="space-y-2">
                                        {resources.map((resource) => (
                                            <a
                                                key={resource.id}
                                                href={resource.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm transition-all"
                                            >
                                                <span>📄</span>
                                                <span className="truncate flex-1">{resource.file_name}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Cancel Action */}
                            {project.status !== 'approved' && project.status !== 'cancelled' && (
                                <button
                                    onClick={() => {
                                        if (confirm('¿Estás seguro de que quieres cancelar este proyecto?')) {
                                            handleAction('cancel')
                                        }
                                    }}
                                    disabled={actionLoading}
                                    className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                    Cancelar Proyecto
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
