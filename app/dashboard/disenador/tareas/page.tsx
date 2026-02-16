'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface Project {
    id: string
    title: string
    description: string
    deadline: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: string
    client_name?: string
    company_name?: string
    content_type: string
}

const statusColumns = [
    { id: 'pending', title: 'Por Hacer', color: 'bg-gray-100 border-gray-200' },
    { id: 'in_progress', title: 'En Progreso', color: 'bg-blue-50 border-blue-100' },
    { id: 'review', title: 'En Revisión', color: 'bg-purple-50 border-purple-100' },
    { id: 'approved', title: 'Aprobado', color: 'bg-green-50 border-green-100' }
]

const priorityBadges: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-blue-100 text-blue-700',
    low: 'bg-green-100 text-green-700',
}

const typeIcons: Record<string, string> = {
    static: '🖼️',
    reel: '🎬',
    story: '📱',
    carousel: '📊',
}

export default function DesignerTasksPage() {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Diseñador'
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects?limit=50&status=all')
            if (res.ok) {
                const data = await res.json()
                setProjects(data.projects || [])
            }
        } catch (err) {
            console.error('Error fetching projects:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const updateStatus = async (projectId: string, newStatus: string) => {
        setUpdating(projectId)
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (res.ok) {
                // Optimistic update
                setProjects(prev => prev.map(p =>
                    p.id === projectId ? { ...p, status: newStatus } : p
                ))
            } else {
                console.error('Failed to update status')
            }
        } catch (err) {
            console.error('Error updating status:', err)
        } finally {
            setUpdating(null)
        }
    }

    const getColumnProjects = (columnId: string) => {
        return projects.filter(p => {
            if (columnId === 'review') return ['in_review', 'changes_requested'].includes(p.status)
            return p.status === columnId
        })
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar role="diseñador" userName={userName} userRole="Diseñador Senior" />

            <main className="flex-1 ml-72 h-screen flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Mis Tareas
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Tablero Kanban de tus proyectos activos
                            </p>
                        </div>
                        <button onClick={fetchProjects} className="text-sm text-primary hover:underline">
                            🔄 Actualizar
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
                    <div className="flex gap-6 h-full min-w-[1000px]">
                        {/* Loading State */}
                        {loading && (
                            <div className="w-full flex items-center justify-center">
                                <div className="text-4xl animate-spin">⏳</div>
                            </div>
                        )}

                        {/* Columns */}
                        {!loading && statusColumns.map(col => (
                            <div key={col.id} className="flex-1 flex flex-col min-w-[300px] h-full">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="font-bold text-gray-700 font-display flex items-center gap-2">
                                        {col.title}
                                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                            {getColumnProjects(col.id).length}
                                        </span>
                                    </h3>
                                </div>

                                <div className={`flex-1 rounded-2xl p-4 overflow-y-auto ${col.color}`}>
                                    <div className="space-y-3">
                                        {getColumnProjects(col.id).map(project => (
                                            <div
                                                key={project.id}
                                                className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group ${updating === project.id ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                {/* Header Badges */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${priorityBadges[project.priority]}`}>
                                                        {project.priority}
                                                    </span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center gap-1">
                                                        {typeIcons[project.content_type]} {project.content_type}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight">
                                                    {project.title}
                                                </h4>
                                                <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                                                    <span>👤</span>
                                                    <span>{project.company_name || project.client_name || 'Cliente'}</span>
                                                </div>

                                                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 mt-2">
                                                    <span>📅 {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>

                                                    {/* Actions */}
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {col.id === 'pending' && (
                                                            <button
                                                                onClick={() => updateStatus(project.id, 'in_progress')}
                                                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-medium"
                                                                title="Mover a En Progreso"
                                                            >
                                                                Iniciar ▶
                                                            </button>
                                                        )}
                                                        {col.id === 'in_progress' && (
                                                            <button
                                                                onClick={() => updateStatus(project.id, 'in_review')}
                                                                className="bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 font-medium"
                                                                title="Mover a Revisión"
                                                            >
                                                                Revisión 📤
                                                            </button>
                                                        )}
                                                        {col.id === 'review' && (
                                                            <Link
                                                                href={`/dashboard/disenador/proyectos/${project.id}`}
                                                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 font-medium"
                                                            >
                                                                Ver 👁️
                                                            </Link>
                                                        )}
                                                        {col.id === 'approved' && (
                                                            <span className="text-green-600 font-bold">✓</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {getColumnProjects(col.id).length === 0 && (
                                            <div className="text-center py-10 opacity-40">
                                                <div className="text-2xl mb-2">📋</div>
                                                <p className="text-sm font-medium">Sin tareas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
