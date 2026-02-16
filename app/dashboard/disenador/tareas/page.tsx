'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

type TaskStatus = 'all' | 'urgent' | 'in-progress' | 'in-review' | 'completed'

export default function TareasDisenador() {
    const [activeFilter, setActiveFilter] = useState<TaskStatus>('all')
    const [searchQuery, setSearchQuery] = useState('')

    const tasks = [
        {
            id: 'TSK-001',
            title: 'Reel Promocional - Servicios',
            client: 'Clínica Dental SmileCenter',
            type: 'Reel',
            typeIcon: '🎬',
            priority: 'urgent' as const,
            priorityText: 'Urgente',
            status: 'urgent' as const,
            statusText: 'Urgente',
            deadline: 'Hoy, 6:00 PM',
            deadlineUrgent: true,
            progress: 70,
            revisions: 1,
            maxRevisions: 3,
            description: 'Reel de 30 segundos mostrando los servicios principales de la clínica.',
        },
        {
            id: 'TSK-002',
            title: 'Campaña Redes Sociales – Febrero',
            client: 'Spa Wellness & Beauty',
            type: 'Carrusel',
            typeIcon: '📱',
            priority: 'high' as const,
            priorityText: 'Alta',
            status: 'in-progress' as const,
            statusText: 'En Progreso',
            deadline: '16 Feb, 5:00 PM',
            deadlineUrgent: false,
            progress: 45,
            revisions: 0,
            maxRevisions: 2,
            description: 'Carrusel de 5 slides para campaña de San Valentín.',
        },
        {
            id: 'TSK-003',
            title: 'Imagen Estática – Promoción Marzo',
            client: 'Salón de Belleza Glamour',
            type: 'Imagen',
            typeIcon: '🖼️',
            priority: 'medium' as const,
            priorityText: 'Media',
            status: 'in-progress' as const,
            statusText: 'En Progreso',
            deadline: '20 Feb',
            deadlineUrgent: false,
            progress: 30,
            revisions: 0,
            maxRevisions: 2,
            description: 'Imagen promocional para ofertas de marzo.',
        },
        {
            id: 'TSK-004',
            title: 'Historia Instagram – Tips',
            client: 'Centro Médico Integral',
            type: 'Historia',
            typeIcon: '📱',
            priority: 'medium' as const,
            priorityText: 'Media',
            status: 'in-review' as const,
            statusText: 'En Revisión',
            deadline: '22 Feb',
            deadlineUrgent: false,
            progress: 100,
            revisions: 1,
            maxRevisions: 2,
            description: 'Serie de historias con tips de salud.',
        },
        {
            id: 'TSK-005',
            title: 'Banner Web – Página Principal',
            client: 'Clínica Dental SmileCenter',
            type: 'Imagen',
            typeIcon: '🖼️',
            priority: 'low' as const,
            priorityText: 'Baja',
            status: 'completed' as const,
            statusText: 'Completado',
            deadline: '10 Feb',
            deadlineUrgent: false,
            progress: 100,
            revisions: 2,
            maxRevisions: 3,
            description: 'Banner hero para el sitio web de la clínica.',
        },
        {
            id: 'TSK-006',
            title: 'Post Facebook – Testimonios',
            client: 'Spa Wellness & Beauty',
            type: 'Imagen',
            typeIcon: '🖼️',
            priority: 'low' as const,
            priorityText: 'Baja',
            status: 'completed' as const,
            statusText: 'Completado',
            deadline: '8 Feb',
            deadlineUrgent: false,
            progress: 100,
            revisions: 1,
            maxRevisions: 2,
            description: 'Imagen con testimonios de clientes para Facebook.',
        },
    ]

    const filters: { id: TaskStatus; label: string; count: number }[] = [
        { id: 'all', label: 'Todas', count: tasks.length },
        { id: 'urgent', label: 'Urgentes', count: tasks.filter(t => t.status === 'urgent').length },
        { id: 'in-progress', label: 'En Progreso', count: tasks.filter(t => t.status === 'in-progress').length },
        { id: 'in-review', label: 'En Revisión', count: tasks.filter(t => t.status === 'in-review').length },
        { id: 'completed', label: 'Completadas', count: tasks.filter(t => t.status === 'completed').length },
    ]

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = activeFilter === 'all' || task.status === activeFilter
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.client.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const priorityStyles: Record<string, string> = {
        urgent: 'bg-red-50 text-danger',
        high: 'bg-orange-50 text-warning',
        medium: 'bg-blue-50 text-primary',
        low: 'bg-green-50 text-success',
    }

    const statusStyles: Record<string, string> = {
        urgent: 'bg-red-50 text-danger border-danger',
        'in-progress': 'bg-blue-50 text-primary border-primary',
        'in-review': 'bg-purple-50 text-purple border-purple',
        completed: 'bg-green-50 text-success border-success',
    }

    const statusBorderLeft: Record<string, string> = {
        urgent: 'border-l-danger',
        'in-progress': 'border-l-primary',
        'in-review': 'border-l-purple',
        completed: 'border-l-success',
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName="María González" userRole="Diseñadora Senior" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Mis Tareas</h2>
                            <p className="text-sm text-gray-600 mt-1">{tasks.length} tareas en total · {tasks.filter(t => t.status === 'urgent').length} urgentes</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar tareas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-72 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        <div className="card border-l-4 border-l-danger hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Urgentes</div>
                            <div className="font-display text-3xl font-bold text-danger">{tasks.filter(t => t.status === 'urgent').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-primary hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">En Progreso</div>
                            <div className="font-display text-3xl font-bold text-primary">{tasks.filter(t => t.status === 'in-progress').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-purple hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">En Revisión</div>
                            <div className="font-display text-3xl font-bold text-purple">{tasks.filter(t => t.status === 'in-review').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-success hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Completadas</div>
                            <div className="font-display text-3xl font-bold text-success">{tasks.filter(t => t.status === 'completed').length}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                    activeFilter === filter.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filter.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                                    activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'
                                }`}>
                                    {filter.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Task List */}
                    <div className="space-y-4">
                        {filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`card border-l-4 ${statusBorderLeft[task.status]} hover:shadow-lg transition-all cursor-pointer`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                            {task.typeIcon}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-[15px]">{task.title}</div>
                                            <div className="text-sm text-gray-500 mt-0.5">{task.client}</div>
                                            <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${priorityStyles[task.priority]}`}>
                                            {task.priorityText}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${statusStyles[task.status]}`}>
                                            {task.statusText}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-5 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">📅 Entrega: <span className={task.deadlineUrgent ? 'text-danger font-semibold' : ''}>{task.deadline}</span></span>
                                        <span className="flex items-center gap-1">{task.typeIcon} {task.type}</span>
                                        <span className="flex items-center gap-1">🔄 Revisiones: {task.revisions}/{task.maxRevisions}</span>
                                        <span className="text-gray-300">#{task.id}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-success rounded-full transition-all"
                                                    style={{ width: `${task.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">{task.progress}%</span>
                                        </div>
                                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all">
                                            Ver Detalle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredTasks.length === 0 && (
                            <div className="card text-center py-12">
                                <div className="text-4xl mb-3">📋</div>
                                <div className="text-gray-500 font-medium">No se encontraron tareas</div>
                                <div className="text-sm text-gray-400 mt-1">Intenta con otro filtro o búsqueda</div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
