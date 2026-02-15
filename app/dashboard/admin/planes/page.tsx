'use client'

import Sidebar from '@/components/Sidebar'
import { useState, useEffect, useCallback } from 'react'

type Plan = {
    id: string
    name: string
    description: string
    price: number
    max_reels: number
    max_images: number
    max_stories: number
    max_carousels: number
    max_revisions: number
    includes_campaigns: boolean
    is_active: boolean
    created_at: string
    updated_at: string
}

type ModalMode = 'create' | 'edit' | null

const planColors = [
    { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '🚀' },
    { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: '⚡' },
    { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '👑' },
    { gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: '💎' },
]

function formatLimit(value: number): string {
    if (value === -1) return 'Ilimitado'
    return value.toString()
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

export default function PlansManagement() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)

    // Modal
    const [modalMode, setModalMode] = useState<ModalMode>(null)
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        max_reels: 4,
        max_images: 8,
        max_stories: 4,
        max_carousels: 2,
        max_revisions: 2,
        includes_campaigns: false,
        is_active: true,
    })
    const [formError, setFormError] = useState('')
    const [formLoading, setFormLoading] = useState(false)

    // Delete
    const [deletePlan, setDeletePlan] = useState<Plan | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Notification
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 4000)
    }

    const fetchPlans = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/plans')
            const data = await res.json()
            if (res.ok) {
                setPlans(data.plans)
            } else {
                showNotification('error', data.error || 'Error al cargar planes')
            }
        } catch {
            showNotification('error', 'Error de conexión')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

    const openCreateModal = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            max_reels: 4,
            max_images: 8,
            max_stories: 4,
            max_carousels: 2,
            max_revisions: 2,
            includes_campaigns: false,
            is_active: true,
        })
        setFormError('')
        setEditingPlan(null)
        setModalMode('create')
    }

    const openEditModal = (plan: Plan) => {
        setFormData({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            max_reels: plan.max_reels,
            max_images: plan.max_images,
            max_stories: plan.max_stories,
            max_carousels: plan.max_carousels,
            max_revisions: plan.max_revisions,
            includes_campaigns: plan.includes_campaigns,
            is_active: plan.is_active,
        })
        setFormError('')
        setEditingPlan(plan)
        setModalMode('edit')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError('')

        try {
            const url = modalMode === 'create'
                ? '/api/admin/plans'
                : `/api/admin/plans/${editingPlan?.id}`

            const res = await fetch(url, {
                method: modalMode === 'create' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (!res.ok) {
                setFormError(data.error)
                return
            }

            showNotification('success', modalMode === 'create' ? 'Plan creado correctamente' : 'Plan actualizado correctamente')
            setModalMode(null)
            fetchPlans()
        } catch {
            setFormError('Error de conexión')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deletePlan) return
        setDeleteLoading(true)

        try {
            const res = await fetch(`/api/admin/plans/${deletePlan.id}`, {
                method: 'DELETE',
            })

            const data = await res.json()
            if (!res.ok) {
                showNotification('error', data.error || 'Error al desactivar plan')
                return
            }

            showNotification('success', data.message || 'Plan desactivado correctamente')
            setDeletePlan(null)
            fetchPlans()
        } catch {
            showNotification('error', 'Error de conexión')
        } finally {
            setDeleteLoading(false)
        }
    }

    const togglePlanStatus = async (plan: Plan) => {
        try {
            const res = await fetch(`/api/admin/plans/${plan.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !plan.is_active }),
            })

            const data = await res.json()
            if (!res.ok) {
                showNotification('error', data.error || 'Error al cambiar estado')
                return
            }

            showNotification('success', `Plan ${plan.is_active ? 'desactivado' : 'activado'} correctamente`)
            fetchPlans()
        } catch {
            showNotification('error', 'Error de conexión')
        }
    }

    const activePlans = plans.filter(p => p.is_active)
    const inactivePlans = plans.filter(p => !p.is_active)

    return (
        <div className="flex min-h-screen">
            <Sidebar
                role="admin"
                userName="Admin User"
                userRole="Administrador"
            />

            <main className="flex-1 ml-72">
                {/* Notification */}
                {notification && (
                    <div
                        className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-xl shadow-lg border animate-fadeIn flex items-center gap-3 ${
                            notification.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                        <span className="text-xl">
                            {notification.type === 'success' ? '✅' : '❌'}
                        </span>
                        <span className="font-medium">{notification.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-4 text-lg hover:opacity-70"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Planes y Precios
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Administra los planes de suscripción de la plataforma
                            </p>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="btn-primary flex items-center gap-2"
                        >
                            <span>+</span>
                            <span>Nuevo Plan</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-10">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-5 mb-8">
                        <div className="card border-l-4 border-l-primary">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                                    💎
                                </div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">
                                {plans.length}
                            </div>
                            <div className="text-sm text-gray-500">Total Planes</div>
                        </div>

                        <div className="card border-l-4 border-l-success">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                                    ✅
                                </div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">
                                {activePlans.length}
                            </div>
                            <div className="text-sm text-gray-500">Planes Activos</div>
                        </div>

                        <div className="card border-l-4 border-l-warning">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                                    🏷️
                                </div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">
                                {activePlans.length > 0
                                    ? formatPrice(Math.min(...activePlans.map(p => p.price)))
                                    : '$0'}
                            </div>
                            <div className="text-sm text-gray-500">Precio Mínimo</div>
                        </div>
                    </div>

                    {/* Active Plans - Pricing Cards */}
                    {loading ? (
                        <div className="grid grid-cols-3 gap-6 mb-10">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
                                    <div className="h-12 bg-gray-200 rounded w-2/3 mb-3" />
                                    <div className="h-4 bg-gray-100 rounded w-full mb-6" />
                                    <div className="space-y-3">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activePlans.length === 0 ? (
                        <div className="card text-center py-16 mb-10">
                            <div className="text-5xl mb-4">💎</div>
                            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                                No hay planes activos
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Crea tu primer plan de suscripción para que los clientes puedan registrarse
                            </p>
                            <button onClick={openCreateModal} className="btn-primary">
                                + Crear Primer Plan
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                                Planes Activos
                            </h3>
                            <div className={`grid gap-6 mb-10 ${
                                activePlans.length === 1 ? 'grid-cols-1 max-w-md' :
                                activePlans.length === 2 ? 'grid-cols-2' :
                                'grid-cols-3'
                            }`}>
                                {activePlans.map((plan, i) => {
                                    const color = planColors[i % planColors.length]
                                    const isPopular = i === Math.floor(activePlans.length / 2) && activePlans.length > 1

                                    return (
                                        <div
                                            key={plan.id}
                                            className={`card relative overflow-hidden transition-all hover:shadow-lg ${
                                                isPopular ? 'ring-2 ring-primary scale-[1.02]' : ''
                                            }`}
                                        >
                                            {/* Popular badge */}
                                            {isPopular && (
                                                <div className="absolute top-0 right-0">
                                                    <div className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                                                        POPULAR
                                                    </div>
                                                </div>
                                            )}

                                            {/* Header */}
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-2xl">{color.icon}</span>
                                                    <h4 className="font-display text-xl font-bold text-gray-900">
                                                        {plan.name}
                                                    </h4>
                                                </div>
                                                <div className="flex items-baseline gap-1 mb-2">
                                                    <span className="font-display text-4xl font-bold text-gray-900">
                                                        {formatPrice(plan.price)}
                                                    </span>
                                                    <span className="text-gray-500 text-sm">/mes</span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {plan.description}
                                                </p>
                                            </div>

                                            {/* Limits */}
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-green-500">✓</span>
                                                    <span className="text-gray-700">
                                                        <strong>{formatLimit(plan.max_reels)}</strong> Reels/mes
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-green-500">✓</span>
                                                    <span className="text-gray-700">
                                                        <strong>{formatLimit(plan.max_images)}</strong> Imágenes/mes
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-green-500">✓</span>
                                                    <span className="text-gray-700">
                                                        <strong>{formatLimit(plan.max_stories)}</strong> Stories/mes
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-green-500">✓</span>
                                                    <span className="text-gray-700">
                                                        <strong>{formatLimit(plan.max_carousels)}</strong> Carruseles/mes
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-green-500">✓</span>
                                                    <span className="text-gray-700">
                                                        <strong>{formatLimit(plan.max_revisions)}</strong> Revisiones/proyecto
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    {plan.includes_campaigns ? (
                                                        <>
                                                            <span className="text-green-500">✓</span>
                                                            <span className="text-gray-700 font-semibold">
                                                                Campañas incluidas
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-gray-300">✗</span>
                                                            <span className="text-gray-400">
                                                                Sin campañas
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={() => openEditModal(plan)}
                                                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => togglePlanStatus(plan)}
                                                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                                                    title="Desactivar plan"
                                                >
                                                    🔒
                                                </button>
                                                <button
                                                    onClick={() => setDeletePlan(plan)}
                                                    className="px-4 py-2.5 border-2 border-red-200 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                                                    title="Eliminar plan"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}

                    {/* Inactive Plans */}
                    {inactivePlans.length > 0 && (
                        <>
                            <h3 className="font-display text-lg font-semibold text-gray-500 mb-4">
                                Planes Inactivos
                            </h3>
                            <div className="space-y-3 mb-10">
                                {inactivePlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="card flex items-center justify-between opacity-60 hover:opacity-100 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                                                💤
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-700">{plan.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {formatPrice(plan.price)}/mes - {plan.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => togglePlanStatus(plan)}
                                                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                                            >
                                                🔓 Reactivar
                                            </button>
                                            <button
                                                onClick={() => openEditModal(plan)}
                                                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                                            >
                                                ✏️ Editar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Comparison Table */}
                    {activePlans.length > 1 && (
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold text-gray-900 mb-6">
                                Tabla Comparativa
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                                Característica
                                            </th>
                                            {activePlans.map((plan) => (
                                                <th
                                                    key={plan.id}
                                                    className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                                                >
                                                    {plan.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-700">
                                                Precio Mensual
                                            </td>
                                            {activePlans.map((plan) => (
                                                <td key={plan.id} className="px-4 py-3 border-b border-gray-200 text-center text-sm font-bold text-gray-900">
                                                    {formatPrice(plan.price)}
                                                </td>
                                            ))}
                                        </tr>
                                        {[
                                            { label: 'Reels/mes', key: 'max_reels' as const },
                                            { label: 'Imágenes/mes', key: 'max_images' as const },
                                            { label: 'Stories/mes', key: 'max_stories' as const },
                                            { label: 'Carruseles/mes', key: 'max_carousels' as const },
                                            { label: 'Revisiones/proyecto', key: 'max_revisions' as const },
                                        ].map((row) => (
                                            <tr key={row.key} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-700">
                                                    {row.label}
                                                </td>
                                                {activePlans.map((plan) => (
                                                    <td key={plan.id} className="px-4 py-3 border-b border-gray-200 text-center text-sm text-gray-700">
                                                        <span className={plan[row.key] === -1 ? 'font-semibold text-green-600' : ''}>
                                                            {formatLimit(plan[row.key])}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-700">
                                                Campañas
                                            </td>
                                            {activePlans.map((plan) => (
                                                <td key={plan.id} className="px-4 py-3 border-b border-gray-200 text-center text-lg">
                                                    {plan.includes_campaigns ? (
                                                        <span className="text-green-500">✓</span>
                                                    ) : (
                                                        <span className="text-gray-300">✗</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Create/Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setModalMode(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-xl font-semibold">
                                    {modalMode === 'create' ? 'Crear Nuevo Plan' : `Editar Plan: ${editingPlan?.name}`}
                                </h3>
                                <button
                                    onClick={() => setModalMode(null)}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {formError}
                                </div>
                            )}

                            {/* Info básica */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">1</span>
                                    Información General
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre del Plan
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="input text-sm"
                                            placeholder="ej: Básico, Profesional, Pro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio Mensual (USD)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                                className="input text-sm pl-8"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="input text-sm resize-none"
                                        rows={2}
                                        placeholder="Descripción breve del plan..."
                                    />
                                </div>
                            </div>

                            {/* Límites de contenido */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">2</span>
                                    Límites de Contenido
                                    <span className="text-xs font-normal text-gray-400">(-1 = ilimitado)</span>
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { key: 'max_reels', label: 'Reels/mes', icon: '🎬' },
                                        { key: 'max_images', label: 'Imágenes/mes', icon: '🖼️' },
                                        { key: 'max_stories', label: 'Stories/mes', icon: '📱' },
                                        { key: 'max_carousels', label: 'Carruseles/mes', icon: '🎠' },
                                        { key: 'max_revisions', label: 'Revisiones/proy.', icon: '🔄' },
                                    ].map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                {field.icon} {field.label}
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="-1"
                                                    value={formData[field.key as keyof typeof formData] as number}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        [field.key]: parseInt(e.target.value) || 0,
                                                    }))}
                                                    className="input text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        [field.key]: prev[field.key as keyof typeof prev] === -1 ? 10 : -1,
                                                    }))}
                                                    className={`px-2 py-2 rounded-lg text-xs font-semibold border transition-all flex-shrink-0 ${
                                                        (formData[field.key as keyof typeof formData] as number) === -1
                                                            ? 'bg-green-50 border-green-200 text-green-700'
                                                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                                    }`}
                                                    title="Toggle ilimitado"
                                                >
                                                    ∞
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">3</span>
                                    Características
                                </h4>

                                {/* Campañas */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📢</span>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Campañas</div>
                                            <div className="text-xs text-gray-500">
                                                Permite al cliente crear y gestionar campañas de marketing
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, includes_campaigns: !prev.includes_campaigns }))}
                                        className={`w-12 h-6 rounded-full transition-all relative ${
                                            formData.includes_campaigns ? 'bg-primary' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                                formData.includes_campaigns ? 'left-6' : 'left-0.5'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Estado activo */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">⚡</span>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Plan Activo</div>
                                            <div className="text-xs text-gray-500">
                                                Los planes inactivos no se muestran a los clientes
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                        className={`w-12 h-6 rounded-full transition-all relative ${
                                            formData.is_active ? 'bg-primary' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                                formData.is_active ? 'left-6' : 'left-0.5'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalMode(null)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {modalMode === 'create' ? 'Creando...' : 'Guardando...'}
                                        </span>
                                    ) : (
                                        modalMode === 'create' ? 'Crear Plan' : 'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletePlan && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setDeletePlan(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                ⚠️
                            </div>
                            <h3 className="font-display text-xl font-semibold mb-2">
                                Desactivar Plan
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                ¿Estás seguro de que quieres desactivar el plan{' '}
                                <strong>{deletePlan.name}</strong>?
                                <br />
                                Los clientes con este plan activo lo mantendrán hasta que expire.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeletePlan(null)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="flex-1 px-6 py-3 bg-danger text-white rounded-lg font-semibold transition-all hover:bg-red-600 disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Desactivando...
                                        </span>
                                    ) : (
                                        'Sí, Desactivar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
