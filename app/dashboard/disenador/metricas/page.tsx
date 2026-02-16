'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function MetricasDisenador() {
    const [period, setPeriod] = useState('mes')

    const kpis = [
        { label: 'Proyectos Completados', value: '18', trend: '+5', trendUp: true, icon: '✅', iconBg: 'bg-green-100', borderColor: 'border-l-success' },
        { label: 'Tiempo Promedio', value: '2.3d', trend: '-0.5d', trendUp: true, icon: '⏱️', iconBg: 'bg-blue-100', borderColor: 'border-l-primary' },
        { label: 'Tasa de Aprobación', value: '94%', trend: '+3%', trendUp: true, icon: '👍', iconBg: 'bg-purple-100', borderColor: 'border-l-purple' },
        { label: 'Calificación', value: '4.9', trend: '+0.1', trendUp: true, icon: '⭐', iconBg: 'bg-orange-100', borderColor: 'border-l-warning' },
    ]

    const monthlyData = [
        { month: 'Sep', completed: 12, revisions: 4 },
        { month: 'Oct', completed: 15, revisions: 5 },
        { month: 'Nov', completed: 14, revisions: 3 },
        { month: 'Dic', completed: 10, revisions: 6 },
        { month: 'Ene', completed: 16, revisions: 4 },
        { month: 'Feb', completed: 18, revisions: 3 },
    ]

    const maxCompleted = Math.max(...monthlyData.map(d => d.completed))

    const projectsByType = [
        { type: 'Imagen', count: 35, percentage: 38, icon: '🖼️', color: 'bg-primary' },
        { type: 'Reel', count: 22, percentage: 24, icon: '🎬', color: 'bg-warning' },
        { type: 'Carrusel', count: 18, percentage: 20, icon: '📱', color: 'bg-success' },
        { type: 'Historia', count: 17, percentage: 18, icon: '📱', color: 'bg-purple' },
    ]

    const clientSatisfaction = [
        { client: 'Clínica Dental SmileCenter', rating: 5.0, projects: 8, avatar: 'CS' },
        { client: 'Spa Wellness & Beauty', rating: 4.8, projects: 6, avatar: 'SW' },
        { client: 'Salón de Belleza Glamour', rating: 4.9, projects: 5, avatar: 'SG' },
        { client: 'Centro Médico Integral', rating: 4.7, projects: 4, avatar: 'CM' },
        { client: 'Pet Shop Happy', rating: 5.0, projects: 3, avatar: 'PH' },
    ]

    const recentAchievements = [
        { icon: '🏆', title: 'Diseñador del Mes', description: 'Mejor rendimiento en enero 2026', date: '1 Feb 2026' },
        { icon: '🎯', title: '20 Proyectos Sin Revisión', description: 'Racha de aprobaciones directas', date: '28 Ene 2026' },
        { icon: '⚡', title: 'Entrega Rápida', description: 'Promedio bajo 2 días por 2 semanas', date: '15 Ene 2026' },
        { icon: '⭐', title: 'Calificación Perfecta', description: '5 estrellas de 3 clientes seguidos', date: '10 Ene 2026' },
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName="María González" userRole="Diseñadora Senior" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Mis Métricas</h2>
                            <p className="text-sm text-gray-600 mt-1">Rendimiento y estadísticas de tu trabajo</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {['semana', 'mes', 'trimestre', 'año'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                                        period === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* KPIs */}
                    <div className="grid grid-cols-4 gap-5 mb-10">
                        {kpis.map((kpi, i) => (
                            <div key={i} className={`card border-l-4 ${kpi.borderColor} hover:shadow-lg transition-all`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${kpi.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                                        {kpi.icon}
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                                        kpi.trendUp ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
                                    }`}>
                                        {kpi.trend}
                                    </span>
                                </div>
                                <div className="font-display text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                                <div className="text-sm text-gray-500">{kpi.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
                        {/* Monthly chart */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Proyectos por Mes</h3>
                            <div className="flex items-end gap-4 h-52">
                                {monthlyData.map((data, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex flex-col items-center gap-1" style={{ height: '180px' }}>
                                            <span className="text-xs font-semibold text-gray-700">{data.completed}</span>
                                            <div className="w-full flex-1 flex flex-col justify-end gap-1">
                                                <div
                                                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-dark"
                                                    style={{ height: `${(data.completed / maxCompleted) * 100}%` }}
                                                />
                                                <div
                                                    className="w-full bg-warning/60 rounded-t-lg"
                                                    style={{ height: `${(data.revisions / maxCompleted) * 60}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="w-3 h-3 rounded bg-primary" /> Completados
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="w-3 h-3 rounded bg-warning/60" /> Revisiones
                                </div>
                            </div>
                        </div>

                        {/* Projects by Type */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Por Tipo de Contenido</h3>
                            <div className="space-y-4">
                                {projectsByType.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{item.icon}</span>
                                                <span className="text-sm font-medium text-gray-700">{item.type}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.color} rounded-full transition-all`}
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                        <div className="text-right text-xs text-gray-500 mt-1">{item.percentage}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Client Satisfaction */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Satisfacción por Cliente</h3>
                            <div className="space-y-3">
                                {clientSatisfaction.map((client, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {client.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-gray-900">{client.client}</div>
                                            <div className="text-xs text-gray-500">{client.projects} proyectos</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="text-sm font-bold text-gray-900">{client.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Logros Recientes</h3>
                            <div className="space-y-4">
                                {recentAchievements.map((achievement, i) => (
                                    <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                            {achievement.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-gray-900">{achievement.title}</div>
                                            <div className="text-xs text-gray-500">{achievement.description}</div>
                                            <div className="text-xs text-gray-400 mt-1">{achievement.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
