'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/auth-context'

interface ReportData {
    summary: {
        total: number
        completed: number
        active: number
        cancelled: number
        avgRevisions: number
        onTimeRate: number
        avgDeliveryDays: number
    }
    byStatus: Record<string, number>
    byContentType: Record<string, number>
    byPriority: Record<string, number>
    monthlyActivity: { month: string; label: string; created: number; completed: number }[]
    planUsage: { name: string; monthlyLimit: number; used: number; maxRevisions: number } | null
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    in_review: 'En Revisión',
    changes_requested: 'Cambios',
    approved: 'Aprobado',
    cancelled: 'Cancelado',
}

const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    in_review: '#8b5cf6',
    changes_requested: '#f97316',
    approved: '#10b981',
    cancelled: '#ef4444',
}

const contentTypeLabels: Record<string, string> = {
    static: 'Imagen',
    reel: 'Reel',
    story: 'Historia',
    carousel: 'Carrusel',
}

const contentTypeColors: Record<string, string> = {
    static: '#3b82f6',
    reel: '#8b5cf6',
    story: '#f59e0b',
    carousel: '#10b981',
}

const priorityLabels: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
}

const priorityColors: Record<string, string> = {
    low: '#10b981',
    medium: '#3b82f6',
    high: '#f97316',
    urgent: '#ef4444',
}

export default function ReportesPage() {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'
    const [data, setData] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res = await fetch('/api/client/reports')
                if (res.ok) {
                    setData(await res.json())
                }
            } catch (err) {
                console.error('Error fetching reports:', err)
            } finally {
                setLoading(false)
            }
        }
        fetch_()
    }, [])

    const maxMonthly = data?.monthlyActivity
        ? Math.max(...data.monthlyActivity.map(m => Math.max(m.created, m.completed)), 1)
        : 1

    const totalByType = data?.byContentType
        ? Object.values(data.byContentType).reduce((a, b) => a + b, 0)
        : 0

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName={userName} userRole="Cliente" />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Reportes
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Analiza el rendimiento de tus proyectos
                            </p>
                        </div>
                        <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                            <span className="text-lg">🔔</span>
                        </button>
                    </div>
                </header>

                <div className="p-10">
                    {loading && (
                        <div className="card text-center py-20">
                            <div className="text-4xl animate-spin mb-3">⏳</div>
                            <p className="text-gray-500">Generando reportes...</p>
                        </div>
                    )}

                    {!loading && data && (
                        <>
                            {/* KPI Row */}
                            <div className="grid grid-cols-4 gap-6 mb-8">
                                <div className="card p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-800 rounded-xl flex items-center justify-center text-white text-xl">📊</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{data.summary.total}</div>
                                            <div className="text-sm text-gray-500">Total Proyectos</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{data.summary.completed}</div>
                                            <div className="text-sm text-gray-500">Completados</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">⏱️</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{data.summary.avgDeliveryDays || '—'}</div>
                                            <div className="text-sm text-gray-500">Días Prom. Entrega</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">🔄</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{data.summary.avgRevisions}</div>
                                            <div className="text-sm text-gray-500">Revisiones Prom.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Row 1 */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                {/* Projects by Status */}
                                <div className="card p-6">
                                    <h3 className="font-display text-lg font-semibold text-gray-900 mb-5">
                                        Proyectos por Estado
                                    </h3>
                                    {data.summary.total === 0 ? (
                                        <div className="text-center py-8 text-gray-400">Sin datos</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {Object.entries(data.byStatus).map(([status, count]) => (
                                                <div key={status}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium text-gray-700">{statusLabels[status] || status}</span>
                                                        <span className="text-gray-500">{count}</span>
                                                    </div>
                                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700"
                                                            style={{
                                                                width: `${(count / data.summary.total) * 100}%`,
                                                                backgroundColor: statusColors[status] || '#6b7280',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Projects by Content Type — Donut */}
                                <div className="card p-6">
                                    <h3 className="font-display text-lg font-semibold text-gray-900 mb-5">
                                        Tipo de Contenido
                                    </h3>
                                    {totalByType === 0 ? (
                                        <div className="text-center py-8 text-gray-400">Sin datos</div>
                                    ) : (
                                        <div className="flex items-center gap-8">
                                            {/* CSS Donut Chart */}
                                            <div className="relative w-40 h-40 flex-shrink-0">
                                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                    {(() => {
                                                        let cumulativePercent = 0
                                                        return Object.entries(data.byContentType).map(([type, count]) => {
                                                            const percent = (count / totalByType) * 100
                                                            const offset = cumulativePercent
                                                            cumulativePercent += percent
                                                            return (
                                                                <circle
                                                                    key={type}
                                                                    cx="18"
                                                                    cy="18"
                                                                    r="14"
                                                                    fill="none"
                                                                    stroke={contentTypeColors[type] || '#6b7280'}
                                                                    strokeWidth="5"
                                                                    strokeDasharray={`${percent} ${100 - percent}`}
                                                                    strokeDashoffset={`${-offset}`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )
                                                        })
                                                    })()}
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-gray-900">{totalByType}</div>
                                                        <div className="text-xs text-gray-500">Total</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Legend */}
                                            <div className="space-y-3 flex-1">
                                                {Object.entries(data.byContentType).map(([type, count]) => (
                                                    <div key={type} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: contentTypeColors[type] || '#6b7280' }}
                                                            />
                                                            <span className="text-sm text-gray-700">{contentTypeLabels[type] || type}</span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {count} ({Math.round((count / totalByType) * 100)}%)
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Charts Row 2 */}
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                {/* Monthly Activity Bar Chart */}
                                <div className="card p-6 col-span-2">
                                    <h3 className="font-display text-lg font-semibold text-gray-900 mb-5">
                                        Actividad Mensual
                                    </h3>
                                    <div className="flex items-end gap-4 h-48">
                                        {data.monthlyActivity.map(m => (
                                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="flex gap-1 items-end w-full justify-center" style={{ height: '160px' }}>
                                                    {/* Created bar */}
                                                    <div className="flex flex-col items-center flex-1 justify-end h-full">
                                                        <span className="text-xs text-gray-500 mb-1">{m.created || ''}</span>
                                                        <div
                                                            className="w-full max-w-[28px] bg-primary rounded-t-md transition-all duration-500"
                                                            style={{ height: `${m.created > 0 ? Math.max((m.created / maxMonthly) * 130, 8) : 4}px` }}
                                                        />
                                                    </div>
                                                    {/* Completed bar */}
                                                    <div className="flex flex-col items-center flex-1 justify-end h-full">
                                                        <span className="text-xs text-gray-500 mb-1">{m.completed || ''}</span>
                                                        <div
                                                            className="w-full max-w-[28px] bg-green-500 rounded-t-md transition-all duration-500"
                                                            style={{ height: `${m.completed > 0 ? Math.max((m.completed / maxMonthly) * 130, 8) : 4}px` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-2">{m.label.split(' ')[0]}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center gap-6 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-sm bg-primary" />
                                            <span className="text-xs text-gray-500">Creados</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-sm bg-green-500" />
                                            <span className="text-xs text-gray-500">Completados</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Plan Usage + Priority */}
                                <div className="space-y-6">
                                    {/* Plan Usage Circle */}
                                    {data.planUsage && (
                                        <div className="card p-6">
                                            <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                                                Uso del Plan
                                            </h3>
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-28 h-28 mb-3">
                                                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                                                        <circle
                                                            cx="18" cy="18" r="14" fill="none"
                                                            stroke={data.planUsage.used >= data.planUsage.monthlyLimit ? '#ef4444' : '#3b82f6'}
                                                            strokeWidth="4" strokeLinecap="round"
                                                            strokeDasharray={`${data.planUsage.monthlyLimit > 0 ? (data.planUsage.used / data.planUsage.monthlyLimit) * 88 : 0} 88`}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <div className="text-lg font-bold text-gray-900">{data.planUsage.used}/{data.planUsage.monthlyLimit}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900">{data.planUsage.name}</div>
                                                <div className="text-xs text-gray-500">Proyectos este mes</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Priority Breakdown */}
                                    <div className="card p-6">
                                        <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                                            Por Prioridad
                                        </h3>
                                        {Object.keys(data.byPriority).length === 0 ? (
                                            <div className="text-center py-4 text-gray-400 text-sm">Sin datos</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {Object.entries(data.byPriority).map(([priority, count]) => (
                                                    <div key={priority} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-2.5 h-2.5 rounded-full"
                                                                style={{ backgroundColor: priorityColors[priority] || '#6b7280' }}
                                                            />
                                                            <span className="text-sm text-gray-700">{priorityLabels[priority] || priority}</span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional KPI Row */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="card p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🎯</div>
                                        <div>
                                            <div className="text-3xl font-bold text-gray-900">{data.summary.onTimeRate}%</div>
                                            <div className="text-sm text-gray-500">Tasa de Entrega a Tiempo</div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                Proyectos completados antes de la fecha límite
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📈</div>
                                        <div>
                                            <div className="text-3xl font-bold text-gray-900">
                                                {data.summary.active}
                                                <span className="text-lg font-normal text-gray-400"> / {data.summary.total}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">Proyectos Activos</div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {data.summary.cancelled > 0 && `${data.summary.cancelled} cancelado${data.summary.cancelled !== 1 ? 's' : ''}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Empty state when no projects at all */}
                    {!loading && data && data.summary.total === 0 && (
                        <div className="card text-center py-20 mt-8">
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                                Sin datos para reportar
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Crea tu primer proyecto para comenzar a ver estadísticas y reportes aquí.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
