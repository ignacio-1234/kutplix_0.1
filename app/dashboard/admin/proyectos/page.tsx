
'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function ProyectosAdmin() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const projects = [
        {
            id: 'PRJ-2451',
            title: 'Reel Promocional – Servicios',
            client: 'Clínica Dental SmileCenter',
            designer: 'María González',
            designerInitials: 'MG',
            type: 'Reel',
            typeIcon: '🎬',
            status: 'in-progress' as const,
            statusText: 'En Proceso',
            priority: 'urgent' as const,
            priorityText: 'Urgente',
            deadline: 'Hoy, 6:00 PM',
            deadlineUrgent: true,
            progress: 70,
            createdAt: '5 Feb 2026',
        },
        {
            id: 'PRJ-2448',
            title: 'Campaña Redes Sociales – Feb',
            client: 'Spa Wellness & Beauty',
            designer: 'María González',
            designerInitials: 'MG',
            type: 'Carrusel',
            typeIcon: '📱',
            status: 'in-progress' as const,
            statusText: 'En Proceso',
            priority: 'high' as const,
            priorityText: 'Alta',
            deadline: '16 Feb',
            deadlineUrgent: false,
            progress: 45,
            createdAt: '3 Feb 2026',
        },
        {
            id: 'PRJ-2439',
            title: 'Banner Web Promocional',
            client: 'Centro Médico Integral',
            designer: 'Carlos Ruiz',
            designerInitials: 'CR',
            type: 'Imagen',
            typeIcon: '🖼️',
            status: 'in-review' as const,
            statusText: 'En Revisión',
            priority: 'medium' as const,
            priorityText: 'Media',
            deadline: '18 Feb',
            deadlineUrgent: false,
            progress: 90,
            createdAt: '28 Ene 2026',
        },
        {
            id: 'PRJ-2443',
            title: 'Carrusel Instagram – Testimonios',
            client: 'Salón de Belleza Glamour',
            designer: 'Sin asignar',
            designerInitials: '??',
            type: 'Carrusel',
            typeIcon: '📱',
            status: 'pending' as const,
            statusText: 'Pendiente',
            priority: 'high' as const,
            priorityText: 'Alta',
            deadline: '17 Feb',
            deadlineUrgent: false,
            progress: 0,
            createdAt: '1 Feb 2026',
        },
        {
            id: 'PRJ-2435',
            title: 'Historia Instagram – Tips Salud',
            client: 'Centro Médico Integral',
            designer: 'Ana Martínez',
            designerInitials: 'AM',
            type: 'Historia',
            typeIcon: '📱',
            status: 'completed' as const,
            statusText: 'Completado',
            priority: 'medium' as const,
            priorityText: 'Media',
            deadline: '10 Feb',
            deadlineUrgent: false,
            progress: 100,
            createdAt: '25 Ene 2026',
        },
        {
            id: 'PRJ-2430',
            title: 'Post Facebook – San Valentín',
            client: 'Spa Wellness & Beauty',
            designer: 'Luis Pérez',
            designerInitials: 'LP',
            type: 'Imagen',
            typeIcon: '🖼️',
            status: 'completed' as const,
            statusText: 'Completado',
            priority: 'low' as const,
            priorityText: 'Baja',
            deadline: '12 Feb',
            deadlineUrgent: false,
            progress: 100,
            createdAt: '20 Ene 2026',
        },
        {
            id: 'PRJ-2428',
            title: 'Video Explicativo – Servicios',
            client: 'Pet Shop Happy',
            designer: 'Carlos Ruiz',
            designerInitials: 'CR',
            type: 'Reel',
            typeIcon: '🎬',
            status: 'in-progress' as const,
            statusText: 'En Proceso',
            priority: 'medium' as const,
            priorityText: 'Media',
            deadline: '20 Feb',
            deadlineUrgent: false,
            progress: 35,
            createdAt: '18 Ene 2026',
        },
        {
            id: 'PRJ-2425',
            title: 'Diseño Logo – Rebranding',
            client: 'Restaurante El Buen Sabor',
            designer: 'Ana Martínez',
            designerInitials: 'AM',
            type: 'Imagen',
            typeIcon: '🖼️',
            status: 'approved' as const,
            statusText: 'Aprobado',
            priority: 'high' as const,
            priorityText: 'Alta',
            deadline: '8 Feb',
            deadlineUrgent: false,
            progress: 100,
            createdAt: '15 Ene 2026',
        },
    ]

    const filters = [
        { id: 'all', label: 'Todos', count: projects.length },
        { id: 'in-progress', label: 'En Proceso', count: projects.filter(p => p.status === 'in-progress').length },
        { id: 'in-review', label: 'En Revisión', count: projects.filter(p => p.status === 'in-review').length },
        { id: 'pending', label: 'Pendientes', count: projects.filter(p => p.status === 'pending').length },
        { id: 'completed', label: 'Completados', count: projects.filter(p => p.status === 'completed' || p.status === 'approved').length },
    ]

    const filteredProjects = projects.filter(project => {
        const matchesFilter = activeFilter === 'all' || project.status === activeFilter ||
            (activeFilter === 'completed' && (project.status === 'completed' || project.status === 'approved'))
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.designer.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const statusStyles: Record<string, string> = {
        'in-progress': 'bg-blue-50 text-primary',
        'in-review': 'bg-purple-50 text-purple',
        pending: 'bg-orange-50 text-warning',
        completed: 'bg-green-50 text-success',
        approved: 'bg-green-50 text-success',
    }

    const priorityDotColors: Record<string, string> = {
        urgent: 'bg-danger',
        high: 'bg-warning',
        medium: 'bg-primary',
        low: 'bg-success',
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar role="admin" userName="Admin User" userRole="Administrador" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Todos los Proyectos</h2>
                            <p className="text-sm text-gray-600 mt-1">{projects.length} proyectos en total</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar proyectos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-72 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>
                            <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
                                + Nuevo Proyecto
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Stats */}
                    <div className="grid grid-cols-5 gap-4 mb-8">
                        <div className="card border-l-4 border-l-gray-400 hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-1">Total</div>
                            <div className="font-display text-2xl font-bold text-gray-900">{projects.length}</div>
                        </div>
                        <div className="card border-l-4 border-l-primary hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-1">En Proceso</div>
                            <div className="font-display text-2xl font-bold text-primary">{projects.filter(p => p.status === 'in-progress').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-purple hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-1">En Revisión</div>
                            <div className="font-display text-2xl font-bold text-purple">{projects.filter(p => p.status === 'in-review').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-warning hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-1">Pendientes</div>
                            <div className="font-display text-2xl font-bold text-warning">{projects.filter(p => p.status === 'pending').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-success hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-1">Completados</div>
                            <div className="font-display text-2xl font-bold text-success">{projects.filter(p => p.status === 'completed' || p.status === 'approved').length}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        activeFilter === filter.id
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter.label} ({filter.count})
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                                📥 Exportar
                            </button>
                        </div>
                    </div>

                    {/* Projects Table */}
                    <div className="card p-0 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Proyecto</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Cliente</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Diseñador</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Estado</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Prioridad</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Deadline</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Progreso</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{project.typeIcon}</span>
                                                <div>
                                                    <div className="font-semibold text-sm text-gray-900">{project.title}</div>
                                                    <div className="text-xs text-gray-400">#{project.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-700">{project.client}</td>
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[10px] font-bold">
                                                    {project.designerInitials}
                                                </div>
                                                <span className="text-sm text-gray-700">{project.designer}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <span className={`px-3 py-1.5 rounded-md text-xs font-semibold ${statusStyles[project.status]}`}>
                                                {project.statusText}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm">
                                            <span className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${priorityDotColors[project.priority]}`} />
                                                {project.priorityText}
                                            </span>
                                        </td>
                                        <td className={`px-5 py-4 border-b border-gray-100 text-sm ${project.deadlineUrgent ? 'text-danger font-semibold' : 'text-gray-700'}`}>
                                            {project.deadline}
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-success rounded-full" style={{ width: `${project.progress}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-500">{project.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <button className="px-2 py-1 rounded-md hover:bg-gray-100 transition-all text-lg">⋯</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

export default function AdminProjectsPage() {
    return (
        <div className="bg-white rounded-lg shadow p-6 h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Todos los Proyectos</h1>
            <p className="text-gray-600">Esta sección está en construcción.</p>

        </div>
    )
}
