'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useParams, useRouter } from 'next/navigation'

type Delivery = {
    id: string
    content_url: string
    notes: string
    version: number
    status: string
    created_at: string
}

type Project = {
    id: string
    title: string
    description: string
    content_type: string
    priority: string
    status: string
    deadline: string
    client_name?: string // May come from join or separate fetch
    designer_id: string
}

export default function ProjectDetail() {
    const { user } = useAuth()
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<Project | null>(null)
    const [deliveries, setDeliveries] = useState<Delivery[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Form state for delivery
    const [deliveryUrl, setDeliveryUrl] = useState('')
    const [deliveryNotes, setDeliveryNotes] = useState('')

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const res = await fetch(`/api/projects/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setProject(data.project)
                    setDeliveries(data.deliveries || [])
                } else {
                    alert('Error al cargar proyecto')
                    router.push('/dashboard/disenador')
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        if (params.id) fetchProjectDetails()
    }, [params.id, router])

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/projects/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                const data = await res.json()
                setProject(data.project)
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handleDeliverySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const version = deliveries.length + 1
            const res = await fetch('/api/deliveries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: params.id,
                    content_url: deliveryUrl,
                    notes: deliveryNotes,
                    version
                })
            })

            if (res.ok) {
                const data = await res.json()
                setDeliveries([data.delivery, ...deliveries])
                setDeliveryUrl('')
                setDeliveryNotes('')
                // Also update project status in local state if it changed
                if (project && project.status !== 'in_review') {
                    setProject({ ...project, status: 'in_review' })
                }
                alert('Entrega enviada con éxito')
            } else {
                alert('Error al enviar entrega')
            }
        } catch (error) {
            console.error('Error submitting delivery:', error)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-10">Cargando...</div>
    if (!project) return <div className="p-10">Proyecto no encontrado</div>

    return (
        <div className="flex min-h-screen">
            <Sidebar
                role="diseñador"
                userName={user ? `${user.firstName} ${user.lastName}` : 'Diseñador'}
                userRole="Diseñador Senior"
            />

            <main className="flex-1 ml-72 p-10">
                <div className="mb-6">
                    <Link href="/dashboard/disenador" className="text-gray-500 hover:text-gray-900 text-sm mb-4 block">
                        ← Volver al Dashboard
                    </Link>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{project.title}</h1>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 uppercase">
                                    {project.status.replace('_', ' ')}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 uppercase">
                                    Prioridad: {project.priority}
                                </span>
                            </div>
                        </div>

                        {/* Status Actions */}
                        <div className="flex gap-2">
                            {project.status === 'pending' && (
                                <button
                                    onClick={() => handleStatusUpdate('in_progress')}
                                    className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Comenzar Trabajo
                                </button>
                            )}
                            {project.status === 'in_progress' && (
                                <div className="text-sm text-gray-500 italic">
                                    En proceso... Sube una entrega para enviar a revisión.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-[2fr_1fr] gap-8">
                    <div className="space-y-6">
                        {/* Details */}
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Detalles del Proyecto</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Descripción</label>
                                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{project.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Tipo de Contenido</label>
                                        <p className="text-gray-900 mt-1 capitalize">{project.content_type}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Fecha de Entrega</label>
                                        <p className="text-gray-900 mt-1">{new Date(project.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deliveries */}
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Entregas y Versiones</h3>

                            {/* New Delivery Form */}
                            {(project.status === 'in_progress' || project.status === 'changes_requested') && (
                                <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                                    <h4 className="text-sm font-semibold mb-3">Nueva Entrega</h4>
                                    <form onSubmit={handleDeliverySubmit} className="space-y-3">
                                        <div>
                                            <input
                                                type="url"
                                                required
                                                placeholder="URL del archivo (Google Drive, Dropbox, etc.)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                                                value={deliveryUrl}
                                                onChange={(e) => setDeliveryUrl(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                placeholder="Notas para la entrega..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary h-20"
                                                value={deliveryNotes}
                                                onChange={(e) => setDeliveryNotes(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn-primary w-full justify-center disabled:opacity-50"
                                        >
                                            {submitting ? 'Enviando...' : 'Enviar Entrega'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Delivery History */}
                            <div className="space-y-3">
                                {deliveries.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No hay entregas registradas.</p>
                                ) : (
                                    deliveries.map((delivery) => (
                                        <div key={delivery.id} className="p-3 border border-gray-100 rounded-lg bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-semibold text-sm">Versión {delivery.version}</span>
                                                <span className="text-xs text-gray-500">{new Date(delivery.created_at).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">{delivery.notes || 'Sin notas'}</p>
                                            <a
                                                href={delivery.content_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-sm hover:underline flex items-center gap-1"
                                            >
                                                🔗 Ver Archivo
                                            </a>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Info */}
                    <div>
                        {/* Placeholder for Client Info or Resources if implemented */}
                        <div className="card">
                            <h3 className="text-sm font-semibold mb-3">Información Adicional</h3>
                            <p className="text-xs text-gray-500">Aquí se mostrarán los recursos proporcionados por el cliente en una futura actualización.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
