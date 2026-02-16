'use client'

import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/NotificationBell'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

type GridSummary = {
    id: string
    month: number
    year: number
    status: string
    items: any[]
    sent_at: string | null
    approved_at: string | null
}

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const statusLabels: Record<string, string> = {
    sent: 'Pendiente de Aprobación',
    approved: 'Aprobada',
    changes_requested: 'Cambios Solicitados',
}

const statusStyles: Record<string, string> = {
    sent: 'bg-purple-100 text-purple-700',
    approved: 'bg-green-100 text-green-700',
    changes_requested: 'bg-orange-100 text-orange-700',
}

export default function ClienteGrillaListPage() {
    const { user } = useAuth()
    const [grids, setGrids] = useState<GridSummary[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGrids = async () => {
            try {
                const res = await fetch('/api/grids')
                if (res.ok) {
                    const data = await res.json()
                    setGrids(data.grids || [])
                }
            } catch (error) {
                console.error('Error loading grids:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchGrids()
    }, [])

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName={userName} userRole="Cliente" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Grilla de Contenido
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Revisa y aprueba la planificación mensual de contenido
                            </p>
                        </div>
                        <NotificationBell />
                    </div>
                </header>

                <div className="p-10">
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="card animate-pulse h-24" />
                            ))}
                        </div>
                    ) : grids.length === 0 ? (
                        <div className="card text-center py-16">
                            <div className="text-5xl mb-4">📅</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No hay grillas disponibles
                            </h3>
                            <p className="text-gray-500">
                                Tu equipo de diseño enviará la grilla del mes próximamente.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {grids.map(grid => {
                                const needsAction = grid.status === 'sent'
                                return (
                                    <Link key={grid.id} href={`/dashboard/cliente/grilla/${grid.id}`}>
                                        <div className={`card hover:shadow-lg transition-all cursor-pointer border-2 ${
                                            needsAction ? 'border-purple-300 bg-purple-50/30' : 'border-transparent hover:border-primary/30'
                                        }`}>
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                                                    📅
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg">
                                                        {monthNames[grid.month - 1]} {grid.year}
                                                    </h3>
                                                    <div className="text-sm text-gray-500">
                                                        {grid.items.length} contenidos planificados
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusStyles[grid.status]}`}>
                                                    {statusLabels[grid.status]}
                                                </span>
                                                {needsAction && (
                                                    <span className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold">
                                                        Revisar y Aprobar
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
