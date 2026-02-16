'use client'

import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/NotificationBell'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useParams } from 'next/navigation'

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
    month: number
    year: number
    status: string
    items: GridItem[]
    comments: GridComment[]
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

export default function ClienteGridDetailPage() {
    const { user } = useAuth()
    const params = useParams()
    const gridId = params.id as string

    const [grid, setGrid] = useState<GridDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
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

    const handleAction = async (action: 'approve' | 'request_changes') => {
        setActionLoading(true)
        setActionResult(null)
        try {
            const res = await fetch(`/api/grids/${gridId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            })
            if (res.ok) {
                fetchGrid()
                setActionResult({
                    type: 'success',
                    message: action === 'approve' ? 'Grilla aprobada exitosamente' : 'Cambios solicitados',
                })
            } else {
                const data = await res.json()
                setActionResult({ type: 'error', message: data.error || 'Error' })
            }
        } catch {
            setActionResult({ type: 'error', message: 'Error de conexión' })
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
        } catch (error) {
            console.error('Error sending comment:', error)
        }
    }

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'
    const needsAction = grid?.status === 'sent'

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar role="cliente" userName={userName} userRole="Cliente" />
                <main className="flex-1 ml-72 p-10">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-64 bg-gray-200 rounded" />
                        <div className="h-64 bg-gray-200 rounded-2xl" />
                    </div>
                </main>
            </div>
        )
    }

    if (!grid) {
        return (
            <div className="flex min-h-screen">
                <Sidebar role="cliente" userName={userName} userRole="Cliente" />
                <main className="flex-1 ml-72 p-10 text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold mb-2">Grilla no encontrada</h2>
                    <Link href="/dashboard/cliente/grilla">
                        <button className="btn-primary mt-4">Volver</button>
                    </Link>
                </main>
            </div>
        )
    }

    const daysInMonth = new Date(grid.year, grid.month, 0).getDate()
    const firstDayOfWeek = new Date(grid.year, grid.month - 1, 1).getDay()
    const itemsByDate: Record<string, GridItem[]> = {}
    grid.items.forEach(item => {
        const dateKey = item.date.split('T')[0]
        if (!itemsByDate[dateKey]) itemsByDate[dateKey] = []
        itemsByDate[dateKey].push(item)
    })

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName={userName} userRole="Cliente" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/cliente/grilla" className="text-gray-400 hover:text-gray-600">
                                ← Volver
                            </Link>
                            <div>
                                <h2 className="font-display text-2xl font-semibold text-gray-900">
                                    {monthNames[grid.month - 1]} {grid.year}
                                </h2>
                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusStyles[grid.status]}`}>
                                    {statusLabels[grid.status]}
                                </span>
                            </div>
                        </div>
                        <NotificationBell />
                    </div>
                </header>

                <div className="p-10">
                    {/* Action Result */}
                    {actionResult && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${
                            actionResult.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                            <span className="text-xl">{actionResult.type === 'success' ? '✅' : '❌'}</span>
                            <span className="font-medium">{actionResult.message}</span>
                        </div>
                    )}

                    {/* Approval Action Card */}
                    {needsAction && (
                        <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-8 animate-slideUp">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">📅</span>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-gray-900">
                                        Se requiere tu aprobación
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Revisa los contenidos planificados para este mes. Si todo se ve bien, aprueba. Si necesitas cambios, puedes solicitarlos y dejar un comentario.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => handleAction('approve')}
                                    disabled={actionLoading}
                                    className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    <span className="text-2xl">✅</span>
                                    Aprobar Grilla
                                </button>
                                <button
                                    onClick={() => handleAction('request_changes')}
                                    disabled={actionLoading}
                                    className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    <span className="text-2xl">✏️</span>
                                    Solicitar Cambios
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-8">
                        {/* Calendar + Items — 2 columns */}
                        <div className="col-span-2">
                            {/* Calendar */}
                            <div className="card">
                                <h3 className="font-display text-lg font-semibold mb-4">Calendario del Mes</h3>

                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                                        <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
                                    ))}

                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1
                                        const dateStr = `${grid.year}-${String(grid.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                        const dayItems = itemsByDate[dateStr] || []

                                        return (
                                            <div
                                                key={day}
                                                className={`h-24 border rounded-lg p-1.5 overflow-hidden ${
                                                    dayItems.length > 0
                                                        ? 'border-primary/30 bg-blue-50/30'
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                <div className="text-xs font-semibold text-gray-500 mb-1">{day}</div>
                                                {dayItems.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded truncate flex items-center gap-1 mb-0.5"
                                                        title={`${item.topic} — ${contentLabels[item.content_type]}`}
                                                    >
                                                        <span>{contentIcons[item.content_type]}</span>
                                                        <span className="truncate">{item.topic}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Items Detail List */}
                            <div className="card mt-6">
                                <h3 className="font-display text-lg font-semibold mb-4">
                                    Detalle de Contenidos ({grid.items.length})
                                </h3>
                                <div className="space-y-3">
                                    {grid.items.map(item => (
                                        <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                                            <span className="text-2xl mt-0.5">{contentIcons[item.content_type]}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-semibold text-gray-900">{item.topic}</span>
                                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                        {contentLabels[item.content_type]}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    📅 {new Date(item.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </div>
                                                {item.description && (
                                                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Chat — 1 column */}
                        <div className="card flex flex-col h-[700px]">
                            <h3 className="font-display text-lg font-semibold mb-4">
                                Sugerencias y Comentarios
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Escribe tus ideas, sugerencias de temas o comentarios sobre la grilla.
                            </p>

                            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                {grid.comments.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        <div className="text-2xl mb-2">💬</div>
                                        Escribe tus sugerencias de temas o comentarios aquí
                                    </div>
                                ) : (
                                    grid.comments.map(comment => {
                                        const isMe = comment.user_id === user?.id
                                        return (
                                            <div key={comment.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                                                    isMe
                                                        ? 'bg-primary text-white rounded-br-md'
                                                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                                }`}>
                                                    {!isMe && (
                                                        <div className="text-xs font-semibold mb-1 opacity-70">
                                                            {comment.user_name} ({comment.user_role === 'admin' ? 'Admin' : 'Diseñador'})
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
                                    placeholder="Sugerir temas, comentar..."
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
                </div>
            </main>
        </div>
    )
}
