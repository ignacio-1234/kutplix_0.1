'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function ReportesAdmin() {
    const [period, setPeriod] = useState('mes')

    const reportCards = [
        {
            title: 'Reporte de Proyectos',
            description: 'Estado general de todos los proyectos activos y completados.',
            icon: '📁',
            iconBg: 'bg-blue-100',
            lastGenerated: 'Hace 2 horas',
            metrics: [
                { label: 'Completados', value: '28', trend: '+8' },
                { label: 'En proceso', value: '14', trend: '+3' },
                { label: 'Pendientes', value: '5', trend: '-2' },
            ],
        },
        {
            title: 'Reporte de Ingresos',
            description: 'Desglose detallado de ingresos por plan y cliente.',
            icon: '💰',
            iconBg: 'bg-green-100',
            lastGenerated: 'Hace 4 horas',
            metrics: [
                { label: 'Ingresos', value: '$43.9K', trend: '+15%' },
                { label: 'Nuevos', value: '12', trend: '+4' },
                { label: 'Churn', value: '2', trend: '-1' },
            ],
        },
        {
            title: 'Reporte de Diseñadores',
            description: 'Rendimiento y productividad del equipo de diseño.',
            icon: '🎨',
            iconBg: 'bg-purple-100',
            lastGenerated: 'Ayer',
            metrics: [
                { label: 'Productividad', value: '94%', trend: '+3%' },
                { label: 'Promedio', value: '2.3d', trend: '-0.5d' },
                { label: 'Rating', value: '4.8', trend: '+0.1' },
            ],
        },
        {
            title: 'Reporte de Clientes',
            description: 'Satisfacción, retención y engagement de clientes.',
            icon: '👥',
            iconBg: 'bg-orange-100',
            lastGenerated: 'Ayer',
            metrics: [
                { label: 'Satisfacción', value: '4.8', trend: '+0.2' },
                { label: 'Retención', value: '96%', trend: '+1%' },
                { label: 'NPS', value: '72', trend: '+5' },
            ],
        },
    ]

    const recentReports = [
        { id: 1, name: 'Reporte Mensual Febrero 2026', type: 'Completo', date: '14 Feb 2026', size: '2.4 MB', format: 'PDF' },
        { id: 2, name: 'Reporte de Ingresos Q1', type: 'Financiero', date: '10 Feb 2026', size: '1.8 MB', format: 'XLSX' },
        { id: 3, name: 'Rendimiento Diseñadores - Enero', type: 'Equipo', date: '1 Feb 2026', size: '1.2 MB', format: 'PDF' },
        { id: 4, name: 'Satisfacción del Cliente Q4 2025', type: 'Clientes', date: '15 Ene 2026', size: '3.1 MB', format: 'PDF' },
        { id: 5, name: 'Reporte Anual 2025', type: 'Completo', date: '5 Ene 2026', size: '8.7 MB', format: 'PDF' },
    ]

    const topMetrics = [
        { label: 'Proyectos Completados', value: 342, max: 400, color: 'bg-primary' },
        { label: 'Tasa de Satisfacción', value: 96, max: 100, color: 'bg-success' },
        { label: 'Entregas a Tiempo', value: 89, max: 100, color: 'bg-warning' },
        { label: 'Retención de Clientes', value: 94, max: 100, color: 'bg-purple' },
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar role="admin" userName="Admin User" userRole="Administrador" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Reportes</h2>
                            <p className="text-sm text-gray-600 mt-1">Análisis y reportes del negocio</p>
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
                                📥 Generar Reporte
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Report Cards */}
                    <div className="grid grid-cols-2 gap-6 mb-10">
                        {reportCards.map((report, i) => (
                            <div key={i} className="card hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 ${report.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                                            {report.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-display text-base font-semibold text-gray-900">{report.title}</h4>
                                            <p className="text-xs text-gray-500">{report.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{report.lastGenerated}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                                    {report.metrics.map((metric, j) => (
                                        <div key={j} className="text-center">
                                            <div className="font-display text-xl font-bold text-gray-900">{metric.value}</div>
                                            <div className="text-xs text-gray-500">{metric.label}</div>
                                            <span className="text-xs text-success font-semibold">{metric.trend}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all">
                                        Ver Reporte
                                    </button>
                                    <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                                        📥 PDF
                                    </button>
                                    <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                                        📊 Excel
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-[2fr_1fr] gap-6">
                        {/* Recent Reports */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Reportes Generados</h3>
                            <div className="space-y-3">
                                {recentReports.map((report) => (
                                    <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-lg">
                                                {report.format === 'PDF' ? '📄' : '📊'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{report.name}</div>
                                                <div className="text-xs text-gray-500">{report.type} · {report.size} · {report.date}</div>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-medium hover:bg-gray-50 transition-all">
                                            Descargar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Métricas Clave</h3>
                            <div className="space-y-5">
                                {topMetrics.map((metric, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {typeof metric.value === 'number' && metric.max === 100 ? `${metric.value}%` : metric.value}
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${metric.color} rounded-full transition-all`}
                                                style={{ width: `${(metric.value / metric.max) * 100}%` }}
                                            />
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
