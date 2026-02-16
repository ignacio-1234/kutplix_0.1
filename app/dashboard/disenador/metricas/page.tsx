'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/auth-context'

interface MetricsData {
    metrics: {
        totalProjects: number
        completedProjects: number
        activeProjects: number
        cancelledProjects: number
        onTimeRate: number
        rating: number
        estimatedRevenue: number
        avgCompletionTime: number
    }
    activity: any[]
}

export default function MetricsPage() {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Diseñador'
    const [data, setData] = useState<MetricsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch('/api/designer/metrics')
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (err) {
                console.error('Error fetching metrics:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchMetrics()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar role="diseñador" userName={userName} userRole="Diseñador Senior" />
                <main className="flex-1 ml-72 p-10 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl animate-spin mb-3">⏳</div>
                        <p className="text-gray-500">Cargando métricas...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (!data) return null

    const { metrics } = data

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName={userName} userRole="Diseñador Senior" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Mis Métricas
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Analiza tu rendimiento y crecimiento profesional
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-10 space-y-8">
                    {/* Key Stats Row */}
                    <div className="grid grid-cols-4 gap-6">
                        <div className="card p-6 border-l-4 border-l-primary">
                            <div className="text-sm text-gray-500 font-medium mb-1">Proyectos Totales</div>
                            <div className="font-display text-3xl font-bold text-gray-900">{metrics.totalProjects}</div>
                            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <span>📈</span>
                                <span>{metrics.activeProjects} activos actualmente</span>
                            </div>
                        </div>
                        <div className="card p-6 border-l-4 border-l-green-500">
                            <div className="text-sm text-gray-500 font-medium mb-1">Entregas a Tiempo</div>
                            <div className="font-display text-3xl font-bold text-gray-900">{metrics.onTimeRate}%</div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: `${metrics.onTimeRate}%` }}></div>
                            </div>
                        </div>
                        <div className="card p-6 border-l-4 border-l-yellow-400">
                            <div className="text-sm text-gray-500 font-medium mb-1">Calificación Promedio</div>
                            <div className="font-display text-3xl font-bold text-gray-900">{metrics.rating} <span className="text-base text-gray-400 font-normal">/ 5.0</span></div>
                            <div className="flex gap-1 text-yellow-400 mt-2 text-sm">
                                {'★'.repeat(Math.round(metrics.rating))}
                                <span className="text-gray-200">{'★'.repeat(5 - Math.round(metrics.rating))}</span>
                            </div>
                        </div>
                        <div className="card p-6 border-l-4 border-l-purple-500">
                            <div className="text-sm text-gray-500 font-medium mb-1">Tiempo Promedio</div>
                            <div className="font-display text-3xl font-bold text-gray-900">{metrics.avgCompletionTime} <span className="text-base text-gray-400 font-normal">días</span></div>
                            <div className="text-xs text-gray-500 mt-2">Por proyecto completado</div>
                        </div>
                    </div>

                    {/* Charts & Breakdown */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Project Status Breakdown */}
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Estado de Proyectos</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">Completados</span>
                                        <span className="text-gray-900 font-bold">{metrics.completedProjects}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-full rounded-full"
                                            style={{ width: `${metrics.totalProjects ? (metrics.completedProjects / metrics.totalProjects) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">En Progreso / Activos</span>
                                        <span className="text-gray-900 font-bold">{metrics.activeProjects}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-full rounded-full"
                                            style={{ width: `${metrics.totalProjects ? (metrics.activeProjects / metrics.totalProjects) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">Cancelados</span>
                                        <span className="text-gray-900 font-bold">{metrics.cancelledProjects}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-red-400 h-full rounded-full"
                                            style={{ width: `${metrics.totalProjects ? (metrics.cancelledProjects / metrics.totalProjects) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Earnings Estimation (Mock/Visual only for now) */}
                        <div className="card p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                            <h3 className="text-lg font-bold mb-2">Ingresos Estimados (YTD)</h3>
                            <p className="text-white/60 text-sm mb-8">Basado en proyectos completados este año fiscal.</p>

                            <div className="text-5xl font-display font-bold mb-4">
                                ${metrics.estimatedRevenue.toLocaleString()}
                            </div>

                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                                        $$
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">Próximo Pago Estimado</div>
                                        <div className="text-xs opacity-70">Viernes, 28 Feb</div>
                                    </div>
                                    <div className="ml-auto font-bold text-xl">
                                        $1,250
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
