'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

type GridSummary = {
    id: string
    company_id: string
    company_name: string
    month: number
    year: number
    status: string
    sent_at: string | null
    approved_at: string | null
    items: any[]
    created_at: string
}

type Company = {
    id: string
    name: string
}

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const statusLabels: Record<string, string> = {
    draft: 'Borrador',
    sent: 'Enviada',
    approved: 'Aprobada',
    changes_requested: 'Cambios Solicitados',
}

const statusStyles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-primary',
    approved: 'bg-green-100 text-green-700',
    changes_requested: 'bg-orange-100 text-orange-700',
}

export default function AdminGrillasPage() {
    const [grids, setGrids] = useState<GridSummary[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createData, setCreateData] = useState({ company_id: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() })
    const [createError, setCreateError] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchGrids = async () => {
        setLoading(true)
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

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/admin/companies')
            if (res.ok) {
                const data = await res.json()
                setCompanies(data.companies || [])
            }
        } catch (error) {
            console.error('Error loading companies:', error)
        }
    }

    useEffect(() => {
        fetchGrids()
        fetchCompanies()
    }, [])

    const handleCreate = async () => {
        setCreateError('')
        if (!createData.company_id) {
            setCreateError('Selecciona una empresa')
            return
        }

        try {
            const res = await fetch('/api/grids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createData),
            })

            if (res.ok) {
                setShowCreateModal(false)
                setCreateData({ company_id: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() })
                fetchGrids()
            } else {
                const data = await res.json()
                setCreateError(data.error || 'Error al crear')
            }
        } catch {
            setCreateError('Error de conexión')
        }
    }

    const filteredGrids = statusFilter === 'all'
        ? grids
        : grids.filter(g => g.status === statusFilter)

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-display text-2xl font-bold text-gray-900">
                        Grillas Mensuales
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Planifica el contenido mensual de cada cliente
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <span>➕</span>
                    <span>Nueva Grilla</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {[
                    { key: 'all', label: 'Todas' },
                    { key: 'draft', label: 'Borrador' },
                    { key: 'sent', label: 'Enviadas' },
                    { key: 'changes_requested', label: 'Con Cambios' },
                    { key: 'approved', label: 'Aprobadas' },
                ].map(f => (
                    <button
                        key={f.key}
                        onClick={() => setStatusFilter(f.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            statusFilter === f.key
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Grid List */}
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                                <div className="flex-1">
                                    <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 w-32 bg-gray-100 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredGrids.length === 0 ? (
                <div className="card text-center py-16">
                    <div className="text-5xl mb-4">📅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay grillas</h3>
                    <p className="text-gray-500 mb-6">Crea una grilla mensual para comenzar a planificar contenido.</p>
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                        ➕ Nueva Grilla
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {filteredGrids.map((grid) => (
                        <Link key={grid.id} href={`/dashboard/admin/grillas/${grid.id}`}>
                            <div className="card hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/30">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📅</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {monthNames[grid.month - 1]} {grid.year}
                                            </h3>
                                            <p className="text-sm text-gray-500">{grid.company_name}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusStyles[grid.status]}`}>
                                        {statusLabels[grid.status]}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>📝 {grid.items.length} contenidos planificados</span>
                                    {grid.sent_at && (
                                        <span>📤 Enviada {new Date(grid.sent_at).toLocaleDateString('es-ES')}</span>
                                    )}
                                    {grid.approved_at && (
                                        <span>✅ Aprobada {new Date(grid.approved_at).toLocaleDateString('es-ES')}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md">
                        <h3 className="font-display text-xl font-bold mb-6">Nueva Grilla Mensual</h3>

                        {createError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {createError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa</label>
                                <select
                                    value={createData.company_id}
                                    onChange={(e) => setCreateData(d => ({ ...d, company_id: e.target.value }))}
                                    className="input"
                                >
                                    <option value="">Seleccionar empresa...</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mes</label>
                                    <select
                                        value={createData.month}
                                        onChange={(e) => setCreateData(d => ({ ...d, month: parseInt(e.target.value) }))}
                                        className="input"
                                    >
                                        {monthNames.map((m, i) => (
                                            <option key={i} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Año</label>
                                    <select
                                        value={createData.year}
                                        onChange={(e) => setCreateData(d => ({ ...d, year: parseInt(e.target.value) }))}
                                        className="input"
                                    >
                                        {[2025, 2026, 2027].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={handleCreate} className="btn-primary flex-1">
                                Crear Grilla
                            </button>
                            <button
                                onClick={() => { setShowCreateModal(false); setCreateError('') }}
                                className="btn-secondary flex-1"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
