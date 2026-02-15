'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function AdminDashboard() {
    const [chartFilter, setChartFilter] = useState('completados')

    const kpis = [
        {
            icon: '👥',
            iconBg: 'bg-blue-100',
            borderColor: 'before:bg-primary',
            value: '157',
            label: 'Clientes Activos',
            trend: '↑ 12%',
            trendUp: true,
        },
        {
            icon: '📁',
            iconBg: 'bg-green-100',
            borderColor: 'before:bg-success',
            value: '342',
            label: 'Proyectos Totales',
            trend: '↑ 8%',
            trendUp: true,
        },
        {
            icon: '💰',
            iconBg: 'bg-orange-100',
            borderColor: 'before:bg-warning',
            value: '$87.2K',
            label: 'Ingresos (Mes)',
            trend: '↑ 15%',
            trendUp: true,
        },
        {
            icon: '⭐',
            iconBg: 'bg-purple-100',
            borderColor: 'before:bg-purple',
            value: '4.8',
            label: 'Satisfacción',
            trend: '↑ 0.2',
            trendUp: true,
        },
    ]

    const designers = [
        {
            initials: 'MG',
            name: 'María González',
            projects: 5,
            load: 85,
            loadLevel: 'high' as const,
            avatarGradient: 'from-primary to-primary-dark',
        },
        {
            initials: 'CR',
            name: 'Carlos Ruiz',
            projects: 4,
            load: 65,
            loadLevel: 'medium' as const,
            avatarGradient: 'from-purple to-violet-800',
        },
        {
            initials: 'AM',
            name: 'Ana Martínez',
            projects: 3,
            load: 45,
            loadLevel: 'low' as const,
            avatarGradient: 'from-success to-green-700',
        },
        {
            initials: 'LP',
            name: 'Luis Pérez',
            projects: 2,
            load: 30,
            loadLevel: 'low' as const,
            avatarGradient: 'from-warning to-orange-600',
        },
    ]

    const riskProjects = [
        {
            id: 'PRJ-2451',
            name: 'Reel Promocional – Servicios',
            client: 'SmileCenter',
            designer: 'María González',
            status: 'risk' as const,
            statusText: '⚠️ Retrasado',
            priority: 'urgent' as const,
            priorityText: 'Urgente',
            deadline: 'Hoy, 6:00 PM',
            deadlineUrgent: true,
            progress: 70,
        },
        {
            id: 'PRJ-2448',
            name: 'Campaña Redes Sociales',
            client: 'Spa Wellness',
            designer: 'María González',
            status: 'in-progress' as const,
            statusText: 'En Proceso',
            priority: 'high' as const,
            priorityText: 'Alta',
            deadline: '16 Feb, 5:00 PM',
            deadlineUrgent: false,
            progress: 45,
        },
        {
            id: 'PRJ-2439',
            name: 'Banner Web Promocional',
            client: 'Centro Médico',
            designer: 'Carlos Ruiz',
            status: 'in-review' as const,
            statusText: 'En Revisión',
            priority: 'medium' as const,
            priorityText: 'Media',
            deadline: '15 Feb, 3:00 PM',
            deadlineUrgent: false,
            progress: 90,
        },
        {
            id: 'PRJ-2443',
            name: 'Carrusel Instagram',
            client: 'Salón Glamour',
            designer: 'Sin asignar',
            status: 'pending' as const,
            statusText: 'Pendiente',
            priority: 'high' as const,
            priorityText: 'Alta',
            deadline: '17 Feb, 2:00 PM',
            deadlineUrgent: false,
            progress: 0,
        },
    ]

    const statusStyles: Record<string, string> = {
        risk: 'bg-red-50 text-danger',
        'in-progress': 'bg-blue-50 text-primary',
        'in-review': 'bg-purple-50 text-purple',
        pending: 'bg-orange-50 text-warning',
    }

    const priorityDotColors: Record<string, string> = {
        urgent: 'bg-danger',
        high: 'bg-warning',
        medium: 'bg-primary',
        low: 'bg-success',
    }

    const loadBarColors: Record<string, string> = {
        high: 'bg-danger',
        medium: 'bg-warning',
        low: 'bg-success',
    }

    const kpiBorderColors = [
        'border-l-primary',
        'border-l-success',
        'border-l-warning',
        'border-l-purple',
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar
                role="admin"
                userName="Admin User"
                userRole="Administrador"
            />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Panel de Control
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Vista general de Kutplix – Febrero 2026
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar proyectos, usuarios..."
                                    className="w-72 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>

                            <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                                <span className="text-lg">🔔</span>
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                    8
                                </span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-10">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-4 gap-5 mb-10">
                        {kpis.map((kpi, i) => (
                            <div
                                key={i}
                                className={`card relative overflow-hidden border-l-4 ${kpiBorderColors[i]} hover:shadow-lg transition-all`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${kpi.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                                        {kpi.icon}
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-md font-semibold ${kpi.trendUp ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
                                            }`}
                                    >
                                        {kpi.trend}
                                    </span>
                                </div>
                                <div className="font-display text-4xl font-bold text-gray-900 mb-1">
                                    {kpi.value}
                                </div>
                                <div className="text-sm text-gray-500">{kpi.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
                        {/* Projects Chart */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-lg font-semibold">Proyectos por Mes</h3>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'todos', label: 'Todos' },
                                        { id: 'completados', label: 'Completados' },
                                        { id: 'en-progreso', label: 'En Progreso' },
                                    ].map((filter) => (
                                        <button
                                            key={filter.id}
                                            onClick={() => setChartFilter(filter.id)}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${chartFilter === filter.id
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-72 bg-gradient-to-t from-primary/5 to-transparent rounded-xl flex items-center justify-center text-gray-500 text-sm">
                                📊 Gráfico de líneas – Proyectos en el tiempo
                            </div>
                        </div>

                        {/* Designer Load */}
                        <div className="card">
                            <div className="mb-6">
                                <h3 className="font-display text-lg font-semibold">Carga de Diseñadores</h3>
                            </div>
                            <div className="space-y-3">
                                {designers.map((designer, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div
                                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${designer.avatarGradient} flex items-center justify-center text-white font-semibold flex-shrink-0`}
                                        >
                                            {designer.initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-gray-900">{designer.name}</div>
                                            <div className="text-xs text-gray-500">{designer.projects} proyectos activos</div>
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${loadBarColors[designer.loadLevel]}`}
                                                    style={{ width: `${designer.load}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Projects at Risk Table */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-lg font-semibold">🔥 Proyectos en Riesgo</h3>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5">
                                    📥 Exportar
                                </button>
                                <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5">
                                    ⚙️ Filtros
                                </button>
                                <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all">
                                    + Asignar Manual
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Proyecto
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Cliente
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Diseñador
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Estado
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Prioridad
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Deadline
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Progreso
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riskProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 border-b border-gray-200">
                                                <div className="font-semibold text-gray-900 text-sm">{project.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">#{project.id}</div>
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                                                {project.client}
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                                                {project.designer}
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200">
                                                <span className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${statusStyles[project.status]}`}>
                                                    {project.statusText}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 text-sm">
                                                <span className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${priorityDotColors[project.priority]}`} />
                                                    {project.priorityText}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-4 border-b border-gray-200 text-sm ${project.deadlineUrgent ? 'text-danger font-semibold' : 'text-gray-700'}`}>
                                                {project.deadline}
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                                                {project.progress}%
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200">
                                                <span className="cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 transition-all text-lg">
                                                    ⋯
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
