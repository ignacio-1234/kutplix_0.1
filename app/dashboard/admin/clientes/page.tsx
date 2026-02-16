'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function ClientesAdmin() {
    const [searchQuery, setSearchQuery] = useState('')
    const [planFilter, setPlanFilter] = useState('all')

    const clients = [
        {
            id: 1,
            name: 'Clínica Dental SmileCenter',
            contact: 'Dr. Juan Pérez',
            initials: 'CS',
            email: 'juan@smilecenter.com',
            phone: '+1 234 567 890',
            plan: 'Profesional' as const,
            planColor: 'bg-primary/10 text-primary',
            activeProjects: 3,
            totalProjects: 12,
            monthlySpend: '$299',
            status: 'active' as const,
            joinDate: 'Ene 2025',
            lastActivity: 'Hace 2 horas',
            industry: 'Salud',
            gradient: 'from-blue-500 to-blue-700',
        },
        {
            id: 2,
            name: 'Spa Wellness & Beauty',
            contact: 'Laura Méndez',
            initials: 'SW',
            email: 'laura@spawellness.com',
            phone: '+1 234 567 891',
            plan: 'Enterprise' as const,
            planColor: 'bg-purple/10 text-purple',
            activeProjects: 2,
            totalProjects: 18,
            monthlySpend: '$499',
            status: 'active' as const,
            joinDate: 'Nov 2024',
            lastActivity: 'Hace 4 horas',
            industry: 'Belleza',
            gradient: 'from-purple to-violet-700',
        },
        {
            id: 3,
            name: 'Salón de Belleza Glamour',
            contact: 'Andrea Silva',
            initials: 'SG',
            email: 'andrea@salonglamour.com',
            phone: '+1 234 567 892',
            plan: 'Básico' as const,
            planColor: 'bg-gray-100 text-gray-600',
            activeProjects: 1,
            totalProjects: 5,
            monthlySpend: '$99',
            status: 'active' as const,
            joinDate: 'Mar 2025',
            lastActivity: 'Hace 1 día',
            industry: 'Belleza',
            gradient: 'from-pink-500 to-rose-600',
        },
        {
            id: 4,
            name: 'Centro Médico Integral',
            contact: 'Dr. Roberto Gómez',
            initials: 'CM',
            email: 'roberto@centromedico.com',
            phone: '+1 234 567 893',
            plan: 'Profesional' as const,
            planColor: 'bg-primary/10 text-primary',
            activeProjects: 2,
            totalProjects: 8,
            monthlySpend: '$299',
            status: 'active' as const,
            joinDate: 'Feb 2025',
            lastActivity: 'Ayer',
            industry: 'Salud',
            gradient: 'from-green-500 to-green-700',
        },
        {
            id: 5,
            name: 'Pet Shop Happy',
            contact: 'María Torres',
            initials: 'PH',
            email: 'maria@petshophappy.com',
            phone: '+1 234 567 894',
            plan: 'Básico' as const,
            planColor: 'bg-gray-100 text-gray-600',
            activeProjects: 1,
            totalProjects: 3,
            monthlySpend: '$99',
            status: 'active' as const,
            joinDate: 'Ene 2026',
            lastActivity: 'Hace 3 días',
            industry: 'Mascotas',
            gradient: 'from-orange-500 to-orange-700',
        },
        {
            id: 6,
            name: 'Restaurante El Buen Sabor',
            contact: 'Chef Carlos Mendoza',
            initials: 'BS',
            email: 'carlos@buensabor.com',
            phone: '+1 234 567 895',
            plan: 'Profesional' as const,
            planColor: 'bg-primary/10 text-primary',
            activeProjects: 0,
            totalProjects: 6,
            monthlySpend: '$299',
            status: 'inactive' as const,
            joinDate: 'Oct 2024',
            lastActivity: 'Hace 2 semanas',
            industry: 'Gastronomía',
            gradient: 'from-red-500 to-red-700',
        },
    ]

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesPlan = planFilter === 'all' || client.plan.toLowerCase() === planFilter
        return matchesSearch && matchesPlan
    })

    const totalRevenue = clients.reduce((sum, c) => sum + parseInt(c.monthlySpend.replace('$', '')), 0)

    return (
        <div className="flex min-h-screen">
            <Sidebar role="admin" userName="Admin User" userRole="Administrador" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Gestión de Clientes</h2>
                            <p className="text-sm text-gray-600 mt-1">{clients.length} clientes registrados</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar cliente..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>
                            <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
                                + Nuevo Cliente
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        <div className="card border-l-4 border-l-primary hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Total Clientes</div>
                            <div className="font-display text-3xl font-bold text-primary">{clients.length}</div>
                        </div>
                        <div className="card border-l-4 border-l-success hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Activos</div>
                            <div className="font-display text-3xl font-bold text-success">{clients.filter(c => c.status === 'active').length}</div>
                        </div>
                        <div className="card border-l-4 border-l-warning hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Ingresos Mensuales</div>
                            <div className="font-display text-3xl font-bold text-warning">${totalRevenue.toLocaleString()}</div>
                        </div>
                        <div className="card border-l-4 border-l-purple hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Proyectos Totales</div>
                            <div className="font-display text-3xl font-bold text-purple">{clients.reduce((sum, c) => sum + c.totalProjects, 0)}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'enterprise', label: 'Enterprise' },
                            { id: 'profesional', label: 'Profesional' },
                            { id: 'básico', label: 'Básico' },
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setPlanFilter(filter.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    planFilter === filter.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Client Cards */}
                    <div className="space-y-4">
                        {filteredClients.map((client) => (
                            <div key={client.id} className="card hover:shadow-lg transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${client.gradient} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
                                        {client.initials}
                                    </div>

                                    <div className="flex-1 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
                                        <div>
                                            <div className="font-semibold text-gray-900">{client.name}</div>
                                            <div className="text-sm text-gray-500">{client.contact} · {client.industry}</div>
                                            <div className="text-xs text-gray-400">{client.email}</div>
                                        </div>

                                        <div className="text-center">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${client.planColor}`}>
                                                {client.plan}
                                            </span>
                                        </div>

                                        <div className="text-center">
                                            <div className="font-display text-lg font-bold text-gray-900">{client.activeProjects}</div>
                                            <div className="text-xs text-gray-500">Activos</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="font-display text-lg font-bold text-gray-900">{client.monthlySpend}</div>
                                            <div className="text-xs text-gray-500">Mensual</div>
                                        </div>

                                        <div className="text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                                                client.status === 'active' ? 'bg-green-50 text-success' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-success' : 'bg-gray-400'}`} />
                                                {client.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all">
                                                Ver Detalle
                                            </button>
                                            <button className="px-2 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm">
                                                ⋯
                                            </button>
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
