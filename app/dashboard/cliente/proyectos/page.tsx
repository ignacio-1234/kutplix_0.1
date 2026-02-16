'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function ProyectosCliente() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const projects = [
        {
            id: 'PRJ-2451',
            title: 'Campaña Redes Sociales - Febrero',
            designer: 'María González',
            designerInitials: 'MG',
            type: 'Carrusel',
            typeIcon: '📱',
            status: 'in-review' as const,
            statusText: 'En Revisión',
            deadline: '20 Feb',
            createdAt: '5 Feb 2026',
            progress: 85,
            revisions: 1,
            maxRevisions: 2,
            description: 'Carrusel de 5 slides para promoción del mes.',
        },
        {
            id: 'PRJ-2448',
            title: 'Reel Promocional - Servicios',
            designer: 'Carlos Ruiz',
            designerInitials: 'CR',
            type: 'Reel',
            typeIcon: '🎬',
            status: 'in-progress' as const,
            statusText: 'En Proceso',
            deadline: '18 Feb',
            createdAt: '3 Feb 2026',
            progress: 60,
            revisions: 0,
            maxRevisions: 2,
            description: 'Reel de 30s para presentar los servicios.',
        },
        {
            id: 'PRJ-2439',
            title: 'Imagen Estática - Promoción San Valentín',
            designer: 'Ana Martínez',
            designerInitials: 'AM',
            type: 'Imagen',
            typeIcon: '🖼️',
            status: 'approved' as const,
            statusText: 'Aprobado',
            deadline: '12 Feb',
            createdAt: '28 Ene 2026',
            progress: 100,
            revisions: 2,
            maxRevisions: 2,
            description: 'Imagen promocional para San Valentín.',
        },
        {
            id: 'PRJ-2443',
            title: 'Carrusel Instagram - Testimonios',
            designer: 'Sin asignar',
            designerInitials: '??',
            type: 'Carrusel',
            typeIcon: '📱',
            status: 'pending' as const,
            statusText: 'Pendiente',
            deadline: '25 Feb',
            createdAt: '10 Feb 2026',
            progress: 0,
            revisions: 0,
            maxRevisions: 2,
            description: 'Carrusel con testimonios de pacientes.',
        },
        {
            id: 'PRJ-2430',
            title: 'Historia Instagram - Tips Dentales',
            designer: 'María González',
            designerInitials: 'MG',
            type: 'Historia',
            typeIcon: '📱',
            status: 'completed' as const,
            statusText: 'Completado',
            deadline: '5 Feb',
            createdAt: '20 Ene 2026',
            progress: 100,
            revisions: 1,
            maxRevisions: 2,
            description: 'Historias con tips de higiene dental.',
        },
        {
            id: 'PRJ-2425',
            title: 'Banner Web - Página Principal',
            designer: 'Carlos Ruiz',
            designerInitials: 'CR',
            type: 'Imagen',
            typeIcon: '🖼️',
            status: 'completed' as const,
            statusText: 'Completado',
            deadline: '1 Feb',
            createdAt: '15 Ene 2026',
            progress: 100,
            revisions: 2,
            maxRevisions: 3,
            description: 'Banner hero para la página web.',
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
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const statusStyles: Record<string, string> = {
        'in-review': 'bg-purple-100 text-purple-700',
        'in-progress': 'bg-blue-100 text-primary',
        approved: 'bg-green-100 text-success',
        pending: 'bg-orange-100 text-warning',
        completed: 'bg-green-100 text-success',
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName="Juan Pérez" userRole="Clínica Dental" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Mis Proyectos</h2>
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
                            <a href="/dashboard/cliente/nueva-solicitud" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
                                + Nueva Solicitud
                            </a>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        <div className="card border-l-4 border-l-primary hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">En Proceso</div>
                            <div className="font-display text-3xl font-bold text-primary">{projects.filter(p => p.status === 'in-progress').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-purple hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">En Revisión</div>
                            <div className="font-display text-3xl font-bold text-purple">{projects.filter(p => p.status === 'in-review').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-warning hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Pendientes</div>
                            <div className="font-display text-3xl font-bold text-warning">{projects.filter(p => p.status === 'pending').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-success hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Completados</div>
                            <div className="font-display text-3xl font-bold text-success">{projects.filter(p => p.status === 'completed' || p.status === 'approved').length}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6">
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

                    {/* Project Cards */}
                    <div className="space-y-4">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="card hover:shadow-lg transition-all cursor-pointer">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                        {project.typeIcon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-gray-900">{project.title}</h4>
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusStyles[project.status]}`}>
                                                {project.statusText}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                                        <div className="flex items-center gap-5 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">👤 {project.designer}</span>
                                            <span className="flex items-center gap-1">📅 Entrega: {project.deadline}</span>
                                            <span className="flex items-center gap-1">🔄 Revisiones: {project.revisions}/{project.maxRevisions}</span>
                                            <span className="text-gray-300">#{project.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-success rounded-full" style={{ width: `${project.progress}%` }} />
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium w-8">{project.progress}%</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm">👁️</button>
                                            <button className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm">💬</button>
                                        </div>
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
