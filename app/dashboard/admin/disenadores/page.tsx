
'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function DisenadoresAdmin() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const designers = [
        {
            id: 1,
            name: 'María González',
            initials: 'MG',
            email: 'maria@kutplix.com',
            role: 'Diseñadora Senior',
            specialties: ['Diseño Gráfico', 'Redes Sociales', 'Video Editing'],
            activeProjects: 5,
            completedProjects: 48,
            rating: 4.9,
            load: 85,
            loadLevel: 'high' as const,
            status: 'active' as const,
            avgTime: '2.3 días',
            joinDate: 'Mar 2024',
            gradient: 'from-primary to-primary-dark',
        },
        {
            id: 2,
            name: 'Carlos Ruiz',
            initials: 'CR',
            email: 'carlos@kutplix.com',
            role: 'Diseñador Mid',
            specialties: ['Ilustración', 'Branding', 'UI/UX'],
            activeProjects: 4,
            completedProjects: 35,
            rating: 4.7,
            load: 65,
            loadLevel: 'medium' as const,
            status: 'active' as const,
            avgTime: '2.8 días',
            joinDate: 'Jun 2024',
            gradient: 'from-purple to-violet-800',
        },
        {
            id: 3,
            name: 'Ana Martínez',
            initials: 'AM',
            email: 'ana@kutplix.com',
            role: 'Diseñadora Junior',
            specialties: ['Diseño Gráfico', 'Fotografía'],
            activeProjects: 3,
            completedProjects: 22,
            rating: 4.8,
            load: 45,
            loadLevel: 'low' as const,
            status: 'active' as const,
            avgTime: '3.1 días',
            joinDate: 'Sep 2024',
            gradient: 'from-success to-green-700',
        },
        {
            id: 4,
            name: 'Luis Pérez',
            initials: 'LP',
            email: 'luis@kutplix.com',
            role: 'Diseñador Mid',
            specialties: ['Motion Graphics', 'Video Editing', 'Animación'],
            activeProjects: 2,
            completedProjects: 30,
            rating: 4.6,
            load: 30,
            loadLevel: 'low' as const,
            status: 'active' as const,
            avgTime: '2.5 días',
            joinDate: 'Ene 2025',
            gradient: 'from-warning to-orange-600',
        },
        {
            id: 5,
            name: 'Sandra López',
            initials: 'SL',
            email: 'sandra@kutplix.com',
            role: 'Diseñadora Senior',
            specialties: ['Branding', 'Packaging', 'Editorial'],
            activeProjects: 0,
            completedProjects: 55,
            rating: 4.9,
            load: 0,
            loadLevel: 'low' as const,
            status: 'inactive' as const,
            avgTime: '2.0 días',
            joinDate: 'Ene 2024',
            gradient: 'from-pink-500 to-rose-600',
        },
    ]

    const loadBarColors: Record<string, string> = {
        high: 'bg-danger',
        medium: 'bg-warning',
        low: 'bg-success',
    }

    const filteredDesigners = designers.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="flex min-h-screen">
            <Sidebar role="admin" userName="Admin User" userRole="Administrador" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Gestión de Diseñadores</h2>
                            <p className="text-sm text-gray-600 mt-1">{designers.length} diseñadores registrados</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar diseñador..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>
                            <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
                                + Agregar Diseñador
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        <div className="card border-l-4 border-l-primary hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Total Diseñadores</div>
                            <div className="font-display text-3xl font-bold text-primary">{designers.length}</div>
                        </div>
                        <div className="card border-l-4 border-l-success hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Activos</div>
                            <div className="font-display text-3xl font-bold text-success">{designers.filter(d => d.status === 'active').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-warning hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Proyectos Activos</div>
                            <div className="font-display text-3xl font-bold text-warning">{designers.reduce((sum, d) => sum + d.activeProjects, 0)}</div>
                        </div>
                        <div className="card border-l-4 border-l-purple hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Rating Promedio</div>
                            <div className="font-display text-3xl font-bold text-purple">
                                {(designers.reduce((sum, d) => sum + d.rating, 0) / designers.length).toFixed(1)}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'active', label: 'Activos' },
                            { id: 'inactive', label: 'Inactivos' },
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setStatusFilter(filter.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    statusFilter === filter.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Designer Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        {filteredDesigners.map((designer) => (
                            <div key={designer.id} className="card hover:shadow-lg transition-all">
                                <div className="flex items-start gap-5">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${designer.gradient} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                                        {designer.initials}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-display text-lg font-semibold text-gray-900">{designer.name}</h4>
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                                                designer.status === 'active' ? 'bg-green-50 text-success' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {designer.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">{designer.role}</div>
                                        <div className="text-xs text-gray-400">{designer.email}</div>

                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {designer.specialties.map((spec) => (
                                                <span key={spec} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[11px] font-medium">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-200">
                                    <div className="text-center">
                                        <div className="font-display text-xl font-bold text-gray-900">{designer.activeProjects}</div>
                                        <div className="text-xs text-gray-500">Activos</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-display text-xl font-bold text-gray-900">{designer.completedProjects}</div>
                                        <div className="text-xs text-gray-500">Completados</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-display text-xl font-bold text-gray-900">{designer.avgTime}</div>
                                        <div className="text-xs text-gray-500">Promedio</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-display text-xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                                            ⭐ {designer.rating}
                                        </div>
                                        <div className="text-xs text-gray-500">Rating</div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs text-gray-500">Carga de trabajo</span>
                                        <span className="text-xs font-semibold text-gray-700">{designer.load}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all ${loadBarColors[designer.loadLevel]}`} style={{ width: `${designer.load}%` }} />
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                                    <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                                        Ver Perfil
                                    </button>
                                    <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all">
                                        Asignar Proyecto
                                    </button>
                                    <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-all">
                                        ⋯
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

export default function AdminDesignersPage() {
    return (
        <div className="bg-white rounded-lg shadow p-6 h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Diseñadores</h1>
            <p className="text-gray-600">Esta sección está en construcción.</p>

        </div>
    )
}
