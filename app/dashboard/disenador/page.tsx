'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

type Project = {
    id: string
    title: string
    description: string
    client_name: string
    deadline: string
    content_type: string
    priority: string
    status: string
    progress: number // calculated or mocked for now
}

const priorityStyles: Record<string, string> = {
    urgent: 'bg-red-50 text-danger',
    high: 'bg-orange-50 text-warning',
    medium: 'bg-blue-50 text-primary',
    low: 'bg-green-50 text-success',
}

const taskBorderStyles: Record<string, string> = {
    urgent: 'border-danger bg-red-50/30',
    high: 'border-orange-200',
    medium: 'border-blue-200',
    low: 'border-green-200',
}

const contentIcons: Record<string, string> = {
    static: '🖼️',
    reel: '🎬',
    story: '📱',
    carousel: '📊',
}

export default function DisenadorDashboard() {
    const { user } = useAuth()
    const [urgentProjects, setUrgentProjects] = useState<Project[]>([])
    const [inProgressProjects, setInProgressProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch projects assigned to me
                // We'll fetch all and filter client-side for now or use specific API params if available
                const res = await fetch('/api/projects?limit=50&sortOrder=asc&sortBy=deadline')
                if (res.ok) {
                    const data = await res.json()
                    const allProjects = data.projects || []

                    // Filter Urgent: High/Urgent priority AND deadline soon (e.g., within 3 days) OR status 'changes_requested'
                    // For simplicity, let's just use priority for now
                    const urgent = allProjects.filter((p: any) =>
                        (p.priority === 'urgent' || p.priority === 'high') && p.status !== 'approved' && p.status !== 'cancelled'
                    )

                    // Filter In Progress: Others that are not completed
                    const inProgress = allProjects.filter((p: any) =>
                        (p.priority !== 'urgent' && p.priority !== 'high') && p.status !== 'approved' && p.status !== 'cancelled'
                    )

                    setUrgentProjects(urgent)
                    setInProgressProjects(inProgress)
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
        })
    }

    // Mock data for calendar/events as placeholders until we have a real calendar API
    const upcomingEvents = urgentProjects.slice(0, 3).map(p => ({
        time: formatDate(p.deadline),
        title: p.title,
        color: p.priority === 'urgent' ? 'border-l-danger' : 'border-l-warning'
    }))

    const calendarDays = [
        // Previous month (inactive)
        { day: 27, inactive: true },
        { day: 28, inactive: true },
        { day: 29, inactive: true },
        { day: 30, inactive: true },
        { day: 31, inactive: true },
        // February (Just a placeholder visual)
        { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
        { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 },
        { day: 11 }, { day: 12 }, { day: 13 },
        { day: 14, today: true },
        { day: 15 },
        { day: 16, hasEvent: true },
        { day: 17 },
        { day: 18, hasEvent: true },
        { day: 19, hasEvent: true },
        { day: 20, hasEvent: true },
        { day: 21 },
        { day: 22, hasEvent: true },
        { day: 23 },
        { day: 24, hasEvent: true },
        { day: 25 },
        { day: 26 },
        { day: 27 },
        { day: 28 },
        { day: 29 },
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar
                role="diseñador"
                userName={user ? `${user.firstName} ${user.lastName}` : 'Diseñador'}
                userRole="Diseñador Senior"
            />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Hola, {user?.firstName || 'Diseñador'} 👋
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Tienes {urgentProjects.length} proyectos urgentes
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                                <span className="text-lg">🔔</span>
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                    {urgentProjects.length}
                                </span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-10">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-5 mb-8">
                        <div className="card hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Proyectos Activos</div>
                            <div className="font-display text-3xl font-bold text-primary">{urgentProjects.length + inProgressProjects.length}</div>
                        </div>
                        <div className="card hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Completados (Mes)</div>
                            <div className="font-display text-3xl font-bold text-success">--</div>
                        </div>
                        <div className="card hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Tiempo Promedio</div>
                            <div className="font-display text-3xl font-bold text-warning">--</div>
                        </div>
                    </div>

                    {/* Content Grid: Tasks + Calendar */}
                    <div className="grid grid-cols-[2fr_1fr] gap-6">
                        {/* Left Column - Tasks */}
                        <div className="space-y-6">
                            {/* Urgent Tasks */}
                            <div className="card">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-display text-lg font-semibold">
                                        🔥 Tareas Urgentes
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {loading ? (
                                        <p>Cargando...</p>
                                    ) : urgentProjects.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No hay tareas urgentes.</p>
                                    ) : (
                                        urgentProjects.map((task) => (
                                            <Link href={`/dashboard/disenador/proyectos/${task.id}`} key={task.id}>
                                                <div
                                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md mb-3 ${taskBorderStyles[task.priority] || 'border-gray-200'}`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="font-semibold text-gray-900 text-[15px]">
                                                                {task.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{task.client_name || 'Cliente'}</div>
                                                        </div>
                                                        <span
                                                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${priorityStyles[task.priority] || 'bg-gray-100'}`}
                                                        >
                                                            {task.priority || 'Normal'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                📅 Entrega: {formatDate(task.deadline)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                {contentIcons[task.content_type] || '📄'} {task.content_type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* In Progress Tasks */}
                            <div className="card">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-display text-lg font-semibold">
                                        📋 En Progreso
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {loading ? (
                                        <p>Cargando...</p>
                                    ) : inProgressProjects.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No hay tareas en progreso.</p>
                                    ) : (
                                        inProgressProjects.map((task) => (
                                            <Link href={`/dashboard/disenador/proyectos/${task.id}`} key={task.id}>
                                                <div
                                                    className="p-4 rounded-xl border-2 border-gray-200 transition-all cursor-pointer hover:border-primary hover:shadow-md mb-3"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="font-semibold text-gray-900 text-[15px]">
                                                                {task.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{task.client_name || 'Cliente'}</div>
                                                        </div>
                                                        <span
                                                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${priorityStyles[task.priority] || 'bg-gray-100'}`}
                                                        >
                                                            {task.priority || 'Normal'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                📅 Entrega: {formatDate(task.deadline)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                {contentIcons[task.content_type] || '📄'} {task.content_type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Calendar */}
                        <div>
                            <div className="card sticky top-24">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-display text-base font-semibold">Calendario</h3>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 mb-5">
                                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((label) => (
                                        <div
                                            key={label}
                                            className="text-center text-[11px] font-semibold text-gray-500 py-2"
                                        >
                                            {label}
                                        </div>
                                    ))}

                                    {calendarDays.map((d, i) => (
                                        <div
                                            key={i}
                                            className={`aspect-square flex items-center justify-center rounded-md text-sm cursor-pointer transition-all relative
                        ${d.inactive ? 'text-gray-300' : 'hover:bg-gray-100'}
                        ${d.today ? 'bg-primary text-white font-semibold hover:bg-primary-dark' : ''}
                      `}
                                        >
                                            {d.day}
                                            {d.hasEvent && !d.today && (
                                                <span className="absolute bottom-1 w-1 h-1 bg-warning rounded-full" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Upcoming Events */}
                                <div className="pt-5 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                        Próximas Entregas (Urgentes)
                                    </h4>
                                    <div className="space-y-2">
                                        {upcomingEvents.length === 0 ? <p className="text-xs text-gray-500">No hay entregas próximas.</p> : upcomingEvents.map((event, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 bg-gray-50 rounded-lg border-l-[3px] ${event.color}`}
                                            >
                                                <div className="text-xs text-gray-500">{event.time}</div>
                                                <div className="text-sm font-semibold text-gray-900 mt-0.5">
                                                    {event.title}
                                                </div>
                                            </div>
                                        ))}
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
