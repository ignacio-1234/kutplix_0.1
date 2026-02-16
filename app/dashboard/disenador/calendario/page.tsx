'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface Project {
    id: string
    title: string
    deadline: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: string
    content_type: string
    client_name?: string
}

const priorityColors: Record<string, string> = {
    urgent: 'bg-red-500 text-white',
    high: 'bg-orange-400 text-white',
    medium: 'bg-blue-400 text-white',
    low: 'bg-green-400 text-white',
}

const priorityBg: Record<string, string> = {
    urgent: 'bg-red-50',
    high: 'bg-orange-50',
    medium: 'bg-blue-50',
    low: 'bg-green-50',
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    in_review: 'En Revisión',
    changes_requested: 'Cambios Solicitados',
    approved: 'Aprobado',
    cancelled: 'Cancelado',
}

export default function CalendarPage() {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Diseñador'

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date())
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const fetchProjects = async () => {
        setLoading(true)
        try {
            // Fetch plenty of projects to populate the calendar
            const res = await fetch('/api/projects?limit=100&status=all')
            if (res.ok) {
                const data = await res.json()
                const activeProjects = data.projects.filter((p: Project) =>
                    p.status !== 'approved' && p.status !== 'cancelled'
                )
                setProjects(activeProjects || [])
            }
        } catch (err) {
            console.error('Error fetching calendar projects:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    // Calendar Helpers
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (year: number, month: number) => {
        // 0 = Sunday, 1 = Monday, etc.
        // Adjust to make Monday = 0, Sunday = 6
        const day = new Date(year, month, 1).getDay()
        return day === 0 ? 6 : day - 1
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
    const resetToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
    }

    // Get projects for a specific day
    const getProjectsForDay = (day: number) => {
        return projects.filter(p => {
            if (!p.deadline) return false
            const d = new Date(p.deadline)
            return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
        })
    }

    const selectedDateProjects = projects.filter(p => {
        if (!p.deadline) return false
        const d = new Date(p.deadline)
        return d.getDate() === selectedDate.getDate() &&
            d.getMonth() === selectedDate.getMonth() &&
            d.getFullYear() === selectedDate.getFullYear()
    })

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName={userName} userRole="Diseñador Senior" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Calendario de Entregas
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Gestiona tus plazos y entregas pendientes
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-8 h-[calc(100vh-89px)] flex gap-6">
                    {/* Calendar View */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">
                                {monthNames[month]} {year}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">◀</button>
                                <button onClick={resetToday} className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">Hoy</button>
                                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">▶</button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 mb-2">
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                                <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2 uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 grid-rows-6 gap-2 flex-1">
                            {/* Empty cells for prev month */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="p-2" />
                            ))}

                            {/* Days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const dayProjects = getProjectsForDay(day)
                                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
                                const isSelected = day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()

                                return (
                                    <div
                                        key={day}
                                        onClick={() => setSelectedDate(new Date(year, month, day))}
                                        className={`
                                            relative p-2 rounded-xl border transition-all cursor-pointer flex flex-col
                                            ${isSelected ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}
                                            ${isToday ? 'bg-blue-50' : ''}
                                        `}
                                    >
                                        <div className={`
                                            text-sm font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full
                                            ${isToday ? 'bg-primary text-white' : 'text-gray-700'}
                                        `}>
                                            {day}
                                        </div>

                                        {/* Event Dots */}
                                        <div className="flex flex-wrap gap-1 mt-auto">
                                            {dayProjects.slice(0, 4).map(p => (
                                                <div
                                                    key={p.id}
                                                    className={`h-1.5 w-1.5 rounded-full ${p.priority === 'urgent' ? 'bg-red-500' : 'bg-blue-400'}`}
                                                    title={p.title}
                                                />
                                            ))}
                                            {dayProjects.length > 4 && (
                                                <span className="text-[10px] text-gray-400 leading-none">+</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Side Panel: Selected Schedule */}
                    <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {selectedDateProjects.length} entrega{selectedDateProjects.length !== 1 ? 's' : ''} programada{selectedDateProjects.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3">
                            {selectedDateProjects.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <div className="text-4xl mb-2">📅</div>
                                    <p className="text-sm">Sin entregas para este día</p>
                                </div>
                            ) : (
                                selectedDateProjects.map(project => (
                                    <Link key={project.id} href={`/dashboard/disenador/proyectos/${project.id}`}>
                                        <div className={`p-4 rounded-xl border-l-[3px] transition-all hover:shadow-md cursor-pointer bg-white border border-gray-100 ${priorityBg[project.priority] || 'bg-gray-50'}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${priorityColors[project.priority] || 'bg-gray-400'}`}>
                                                    {project.priority}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(project.deadline).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                                                {project.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>👤 {project.client_name || 'Cliente'}</span>
                                            </div>
                                            <div className="mt-2 text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 w-fit">
                                                {statusLabels[project.status] || project.status}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
