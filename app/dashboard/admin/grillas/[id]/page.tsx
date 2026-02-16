'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

type GridItem = {
    id: string
    date: string
    content_type: string
    topic: string
    description: string | null
    status: string
}

type GridComment = {
    id: string
    user_id: string
    message: string
    created_at: string
    user_name: string
    user_role: string
}

type GridDetail = {
    id: string
    company_id: string
    company_name: string
    month: number
    year: number
    status: string
    items: GridItem[]
    comments: GridComment[]
    created_at: string
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

const contentIcons: Record<string, string> = {
    static: '🖼️',
    reel: '🎬',
    story: '📱',
    carousel: '📊',
}

const contentLabels: Record<string, string> = {
    static: 'Imagen',
    reel: 'Reel',
    story: 'Historia',
    carousel: 'Carrusel',
}

export default function AdminGridDetailPage() {
    const { user } = useAuth()
    const params = useParams()
    const gridId = params.id as string

    const [grid, setGrid] = useState<GridDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [showAddItem, setShowAddItem] = useState(false)
    const [newItem, setNewItem] = useState({ date: '', content_type: 'static', topic: '', description: '' })
    const [newComment, setNewComment] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    const fetchGrid = async () => {
        try {
            const res = await fetch(`/api/grids/${gridId}`)
            if (res.ok) {
                const data = await res.json()
                setGrid(data.grid)
            }
        } catch (error) {
            console.error('Error loading grid:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (gridId) fetchGrid()
    }, [gridId])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [grid?.comments])

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3000)
    }

    const handleAddItem = async () => {
        if (!newItem.date || !newItem.topic) return

        try {
            const res = await fetch(`/api/grids/${gridId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            })

            if (res.ok) {
                setNewItem({ date: '', content_type: 'static', topic: '', description: '' })
                setShowAddItem(false)
                fetchGrid()
                showToast('success', 'Contenido agregado')
            } else {
                const data = await res.json()
                showToast('error', data.error || 'Error al agregar')
            }
        } catch {
            showToast('error', 'Error de conexión')
        }
    }

    const handleDeleteItem = async (itemId: string) => {
        try {
            const res = await fetch(`/api/grids/${gridId}/items?item_id=${itemId}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                fetchGrid()
                showToast('success', 'Item eliminado')
            }
        } catch {
            showToast('error', 'Error al eliminar')
        }
    }

    const handleSendGrid = async () => {
        setActionLoading(true)
        try {
            const res = await fetch(`/api/grids/${gridId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send' }),
            })
            if (res.ok) {
                fetchGrid()
                showToast('success', 'Grilla enviada al cliente')
            } else {
                const data = await res.json()
                showToast('error', data.error || 'Error')
            }
        } catch {
            showToast('error', 'Error de conexión')
        } finally {
            setActionLoading(false)
        }
    }

    const handleSendComment = async () => {
        if (!newComment.trim()) return
        try {
            const res = await fetch(`/api/grids/${gridId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newComment }),
            })
            if (res.ok) {
                setNewComment('')
                fetchGrid()
            }
        } catch {
            showToast('error', 'Error al enviar comentario')
        }
    }

    const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate()

    const isEditable = grid?.status === 'draft' || grid?.status === 'changes_requested'

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-64 bg-gray-200 rounded" />
                    <div className="h-96 bg-gray-200 rounded-2xl" />
                </div>
            </div>
        )
    }

    if (!grid) {
        return (
            <div className="p-8 text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">Grilla no encontrada</h2>
                <Link href="/dashboard/admin/grillas">
                    <button className="btn-primary mt-4">Volver a Grillas</button>
                </Link>
            </div>
        )
    }

    const daysInMonth = getDaysInMonth(grid.month, grid.year)
    const firstDayOfWeek = new Date(grid.year, grid.month - 1, 1).getDay()
    const itemsByDate: Record<string, GridItem[]> = {}
    grid.items.forEach(item => {
        const dateKey = item.date.split('T')[0]
        if (!itemsByDate[dateKey]) itemsByDate[dateKey] = []
        itemsByDate[dateKey].push(item)
    })

    return (
        <div className="p-8">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg animate-fadeIn ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/grillas" className="text-gray-400 hover:text-gray-600 text-lg">
                        ←
                    </Link>
                    <div>
                        <h2 className="font-display text-2xl font-bold text-gray-900">
                            {monthNames[grid.month - 1]} {grid.year} — {grid.company_name}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusStyles[grid.status]}`}>
                                {statusLabels[grid.status]}
                            </span>
                            <span className="text-sm text-gray-500">{grid.items.length} contenidos</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    {isEditable && (
                        <>
                            <button
                                onClick={() => setShowAddItem(true)}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <span>➕</span> Agregar Contenido
                            </button>
                            <button
                                onClick={handleSendGrid}
                                disabled={actionLoading || grid.items.length === 0}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50"
                            >
                                <span>📤</span> {grid.status === 'changes_requested' ? 'Reenviar' : 'Enviar'} al Cliente
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Calendar — 2 columns */}
                <div className="col-span-2">
                    <div className="card">
                        <h3 className="font-display text-lg font-semibold mb-4">Calendario de Contenido</h3>

                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                                <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty cells before first day */}
                            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
                            ))}

                            {/* Day cells */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const dateStr = `${grid.year}-${String(grid.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                const dayItems = itemsByDate[dateStr] || []

                                return (
                                    <div
                                        key={day}
                                        className={`h-24 border rounded-lg p-1.5 overflow-hidden transition-all ${
                                            dayItems.length > 0
                                                ? 'border-primary/30 bg-blue-50/30'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="text-xs font-semibold text-gray-500 mb-1">{day}</div>
                                        <div className="space-y-0.5">
                                            {dayItems.map(item => (
                                                <div
                                                    key={item.id}
                                                    className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded truncate flex items-center gap-1 group"
                                                    title={`${item.topic} (${contentLabels[item.content_type]})`}
                                                >
                                                    <span>{contentIcons[item.content_type]}</span>
                                                    <span className="truncate flex-1">{item.topic}</span>
                                                    {isEditable && (
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); handleDeleteItem(item.id) }}
                                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 ml-1"
                                                            title="Eliminar"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="card mt-6">
                        <h3 className="font-display text-lg font-semibold mb-4">
                            Lista de Contenidos ({grid.items.length})
                        </h3>
                        {grid.items.length === 0 ? (
                            <p className="text-gray-500 text-center py-6">No hay contenidos aún. Agrega el primer item.</p>
                        ) : (
                            <div className="space-y-3">
                                {grid.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl">
                                        <span className="text-2xl">{contentIcons[item.content_type]}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm">{item.topic}</div>
                                            <div className="text-xs text-gray-500">
                                                {contentLabels[item.content_type]} — {new Date(item.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                            </div>
                                            {item.description && (
                                                <div className="text-xs text-gray-400 mt-1 truncate">{item.description}</div>
                                            )}
                                        </div>
                                        {isEditable && (
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="text-red-400 hover:text-red-600 text-sm"
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat — 1 column */}
                <div className="card flex flex-col h-[700px]">
                    <h3 className="font-display text-lg font-semibold mb-4">
                        Chat / Comentarios
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {grid.comments.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <div className="text-2xl mb-2">💬</div>
                                Sin comentarios aún
                            </div>
                        ) : (
                            grid.comments.map(comment => {
                                const isMe = comment.user_id === user?.id
                                return (
                                    <div key={comment.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                                            isMe
                                                ? 'bg-primary text-white rounded-br-md'
                                                : comment.user_role === 'client'
                                                    ? 'bg-orange-100 text-gray-900 rounded-bl-md'
                                                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                        }`}>
                                            {!isMe && (
                                                <div className="text-xs font-semibold mb-1 opacity-70">
                                                    {comment.user_name} ({comment.user_role === 'client' ? 'Cliente' : comment.user_role === 'admin' ? 'Admin' : 'Diseñador'})
                                                </div>
                                            )}
                                            <p>{comment.message}</p>
                                            <div className={`text-xs mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                                                {new Date(comment.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                            placeholder="Escribe un comentario..."
                            className="input flex-1 !py-2.5"
                        />
                        <button
                            onClick={handleSendComment}
                            disabled={!newComment.trim()}
                            className="px-4 py-2.5 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-primary-dark transition-all"
                        >
                            📤
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            {showAddItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md">
                        <h3 className="font-display text-xl font-bold mb-6">Agregar Contenido</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                                <input
                                    type="date"
                                    value={newItem.date}
                                    min={`${grid.year}-${String(grid.month).padStart(2, '0')}-01`}
                                    max={`${grid.year}-${String(grid.month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`}
                                    onChange={(e) => setNewItem(d => ({ ...d, date: e.target.value }))}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Contenido</label>
                                <select
                                    value={newItem.content_type}
                                    onChange={(e) => setNewItem(d => ({ ...d, content_type: e.target.value }))}
                                    className="input"
                                >
                                    <option value="static">🖼️ Imagen</option>
                                    <option value="reel">🎬 Reel</option>
                                    <option value="story">📱 Historia</option>
                                    <option value="carousel">📊 Carrusel</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tema</label>
                                <input
                                    type="text"
                                    value={newItem.topic}
                                    onChange={(e) => setNewItem(d => ({ ...d, topic: e.target.value }))}
                                    placeholder="Ej: Promoción día de la madre"
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (opcional)</label>
                                <textarea
                                    value={newItem.description}
                                    onChange={(e) => setNewItem(d => ({ ...d, description: e.target.value }))}
                                    placeholder="Detalles adicionales..."
                                    className="input min-h-[80px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleAddItem}
                                disabled={!newItem.date || !newItem.topic}
                                className="btn-primary flex-1 disabled:opacity-50"
                            >
                                Agregar
                            </button>
                            <button
                                onClick={() => setShowAddItem(false)}
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
