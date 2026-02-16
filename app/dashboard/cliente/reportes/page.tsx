'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function ReportesCliente() {
    const [period, setPeriod] = useState('mes')

    const summaryCards = [
        { label: 'Proyectos Completados', value: '28', trend: '+8', trendUp: true, icon: '✅', borderColor: 'border-l-success' },
        { label: 'En Proceso', value: '3', trend: '+1', trendUp: true, icon: '🔄', borderColor: 'border-l-primary' },
        { label: 'Tasa de Aprobación', value: '93%', trend: '+5%', trendUp: true, icon: '👍', borderColor: 'border-l-purple' },
        { label: 'Tiempo Promedio', value: '2.8d', trend: '-0.3d', trendUp: true, icon: '⏱️', borderColor: 'border-l-warning' },
    ]

    const monthlyProjects = [
        { month: 'Sep', completed: 3, revisions: 1 },
        { month: 'Oct', completed: 4, revisions: 2 },
        { month: 'Nov', completed: 5, revisions: 1 },
        { month: 'Dic', completed: 3, revisions: 2 },
        { month: 'Ene', completed: 5, revisions: 1 },
        { month: 'Feb', completed: 8, revisions: 2 },
    ]

    const maxVal = Math.max(...monthlyProjects.map(d => d.completed))

    const projectsByType = [
        { type: 'Imagen', count: 12, percentage: 43, icon: '🖼️', color: 'bg-primary' },
        { type: 'Reel', count: 7, percentage: 25, icon: '🎬', color: 'bg-warning' },
        { type: 'Carrusel', count: 5, percentage: 18, icon: '📱', color: 'bg-success' },
        { type: 'Historia', count: 4, percentage: 14, icon: '📱', color: 'bg-purple' },
    ]

    const designerPerformance = [
        { name: 'María González', initials: 'MG', projects: 5, avgTime: '2.1d', rating: 4.9, onTime: '98%' },
        { name: 'Carlos Ruiz', initials: 'CR', projects: 3, avgTime: '2.5d', rating: 4.7, onTime: '95%' },
        { name: 'Ana Martínez', initials: 'AM', projects: 2, avgTime: '3.0d', rating: 4.8, onTime: '100%' },
    ]

    const recentReports = [
        { name: 'Reporte Mensual - Febrero 2026', date: '14 Feb 2026', format: 'PDF', size: '1.2 MB' },
        { name: 'Reporte Mensual - Enero 2026', date: '1 Feb 2026', format: 'PDF', size: '1.1 MB' },
        { name: 'Reporte Trimestral Q4 2025', date: '1 Ene 2026', format: 'PDF', size: '2.8 MB' },
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName="Juan Pérez" userRole="Clínica Dental" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Reportes</h2>
                            <p className="text-sm text-gray-600 mt-1">Análisis y estadísticas de tus proyectos</p>
                        </div>
                        <div className="flex items-center gap-3">
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
                            <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
                                📥 Descargar
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Summary */}
                    <div className="grid grid-cols-4 gap-5 mb-10">
                        {summaryCards.map((card, i) => (
                            <div key={i} className={`card border-l-4 ${card.borderColor} hover:shadow-lg transition-all`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl">{card.icon}</span>
                                    <span className="text-xs px-2 py-1 bg-green-50 text-success rounded-md font-semibold">{card.trend}</span>
                                </div>
                                <div className="font-display text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
                                <div className="text-sm text-gray-500">{card.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-[2fr_1fr] gap-6 mb-10">
                        {/* Monthly Chart */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Proyectos por Mes</h3>
                            <div className="flex items-end gap-4 h-48">
                                {monthlyProjects.map((data, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-700">{data.completed}</span>
                                        <div className="w-full flex-1 flex flex-col justify-end gap-1">
                                            <div
                                                className="w-full bg-primary rounded-t-lg hover:bg-primary-dark transition-all"
                                                style={{ height: `${(data.completed / maxVal) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{data.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* By Type */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Por Tipo de Contenido</h3>
                            <div className="space-y-4">
                                {projectsByType.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span>{item.icon}</span>
                                                <span className="text-sm font-medium text-gray-700">{item.type}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Designer Performance */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Rendimiento de Diseñadores</h3>
                            <div className="space-y-3">
                                {designerPerformance.map((designer, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {designer.initials}
                                        </div>
                                        <div className="flex-1 grid grid-cols-4 gap-3 items-center">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{designer.name}</div>
                                                <div className="text-xs text-gray-500">{designer.projects} proyectos</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-gray-900">{designer.avgTime}</div>
                                                <div className="text-xs text-gray-500">Promedio</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1">⭐ {designer.rating}</div>
                                                <div className="text-xs text-gray-500">Rating</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-success">{designer.onTime}</div>
                                                <div className="text-xs text-gray-500">A tiempo</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Downloaded Reports */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Reportes Disponibles</h3>
                            <div className="space-y-3">
                                {recentReports.map((report, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-lg">📄</div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{report.name}</div>
                                                <div className="text-xs text-gray-500">{report.date} · {report.size}</div>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-all">
                                            📥 {report.format}
                                        </button>
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
