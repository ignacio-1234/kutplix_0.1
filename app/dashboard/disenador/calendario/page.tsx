'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function CalendarioDisenador() {
    const [currentMonth] = useState({ month: 'Febrero', year: 2026, monthIndex: 1 })
    const [selectedDay, setSelectedDay] = useState<number | null>(null)

    const calendarDays = [
        { day: 27, inactive: true }, { day: 28, inactive: true }, { day: 29, inactive: true },
        { day: 30, inactive: true }, { day: 31, inactive: true },
        { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
        { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 },
        { day: 11 }, { day: 12 }, { day: 13 }, { day: 14, today: true }, { day: 15 },
        { day: 16, hasEvent: true, events: 2 }, { day: 17 },
        { day: 18, hasEvent: true, events: 1 }, { day: 19, hasEvent: true, events: 1 },
        { day: 20, hasEvent: true, events: 3 }, { day: 21 },
        { day: 22, hasEvent: true, events: 2 }, { day: 23 },
        { day: 24, hasEvent: true, events: 1 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
        { day: 29 },
    ] as { day: number; inactive?: boolean; today?: boolean; hasEvent?: boolean; events?: number }[]

    const allEvents = [
        {
            id: 1,
            day: 16,
            time: '10:00 AM',
            endTime: '11:30 AM',
            title: 'Campaña Redes – Spa Wellness',
            client: 'Spa Wellness & Beauty',
            type: 'Carrusel',
            typeIcon: '📱',
            priority: 'high' as const,
            color: 'bg-warning/10 border-l-warning',
        },
        {
            id: 2,
            day: 16,
            time: '3:00 PM',
            endTime: '4:00 PM',
            title: 'Revisión con cliente – SmileCenter',
            client: 'Clínica Dental SmileCenter',
            type: 'Reunión',
            typeIcon: '📹',
            priority: 'medium' as const,
            color: 'bg-primary/10 border-l-primary',
        },
        {
            id: 3,
            day: 18,
            time: '2:00 PM',
            endTime: '4:00 PM',
            title: 'Banner Web – Centro Médico',
            client: 'Centro Médico Integral',
            type: 'Imagen',
            typeIcon: '🖼️',
            priority: 'medium' as const,
            color: 'bg-success/10 border-l-success',
        },
        {
            id: 4,
            day: 19,
            time: '11:00 AM',
            endTime: '12:00 PM',
            title: 'Historia Instagram – Tips de Salud',
            client: 'Centro Médico Integral',
            type: 'Historia',
            typeIcon: '📱',
            priority: 'medium' as const,
            color: 'bg-purple/10 border-l-purple',
        },
        {
            id: 5,
            day: 20,
            time: '9:00 AM',
            endTime: '10:00 AM',
            title: 'Reel Testimonios – Salón Glamour',
            client: 'Salón de Belleza Glamour',
            type: 'Reel',
            typeIcon: '🎬',
            priority: 'high' as const,
            color: 'bg-warning/10 border-l-warning',
        },
        {
            id: 6,
            day: 20,
            time: '1:00 PM',
            endTime: '2:30 PM',
            title: 'Post Facebook – Ofertas Marzo',
            client: 'Spa Wellness & Beauty',
            type: 'Imagen',
            typeIcon: '🖼️',
            priority: 'low' as const,
            color: 'bg-success/10 border-l-success',
        },
        {
            id: 7,
            day: 20,
            time: '4:00 PM',
            endTime: '5:00 PM',
            title: 'Entrega Carrusel Instagram',
            client: 'Clínica Dental SmileCenter',
            type: 'Carrusel',
            typeIcon: '📱',
            priority: 'urgent' as const,
            color: 'bg-danger/10 border-l-danger',
        },
        {
            id: 8,
            day: 22,
            time: '10:00 AM',
            endTime: '11:00 AM',
            title: 'Diseño Logo – Nuevo Cliente',
            client: 'Pet Shop Happy',
            type: 'Imagen',
            typeIcon: '🖼️',
            priority: 'medium' as const,
            color: 'bg-primary/10 border-l-primary',
        },
        {
            id: 9,
            day: 22,
            time: '3:00 PM',
            endTime: '4:30 PM',
            title: 'Video Animación – Promo',
            client: 'Spa Wellness & Beauty',
            type: 'Reel',
            typeIcon: '🎬',
            priority: 'high' as const,
            color: 'bg-warning/10 border-l-warning',
        },
        {
            id: 10,
            day: 24,
            time: '11:00 AM',
            endTime: '1:00 PM',
            title: 'Presentación Portafolio',
            client: 'Interno',
            type: 'Reunión',
            typeIcon: '📹',
            priority: 'low' as const,
            color: 'bg-success/10 border-l-success',
        },
    ]

    const selectedDayEvents = selectedDay
        ? allEvents.filter(e => e.day === selectedDay)
        : allEvents.filter(e => e.day >= 14).slice(0, 5)

    const upcomingDeadlines = [
        { date: '16 Feb', title: 'Campaña Redes – Spa Wellness', priority: 'high' },
        { date: '18 Feb', title: 'Banner Web – Centro Médico', priority: 'medium' },
        { date: '20 Feb', title: 'Reel Testimonios – Glamour', priority: 'high' },
        { date: '22 Feb', title: 'Historia Tips – Centro Médico', priority: 'medium' },
        { date: '24 Feb', title: 'Presentación Portafolio', priority: 'low' },
    ]

    const priorityDot: Record<string, string> = {
        urgent: 'bg-danger',
        high: 'bg-warning',
        medium: 'bg-primary',
        low: 'bg-success',
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName="María González" userRole="Diseñadora Senior" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Calendario</h2>
                            <p className="text-sm text-gray-600 mt-1">{currentMonth.month} {currentMonth.year} · {allEvents.length} eventos programados</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all">
                                Mes
                            </button>
                            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all">
                                Semana
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all">
                                Hoy
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    <div className="grid grid-cols-[2fr_1fr] gap-6">
                        {/* Calendar */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-xl font-semibold">{currentMonth.month} {currentMonth.year}</h3>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all text-lg">‹</button>
                                    <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all text-lg">›</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((label) => (
                                    <div key={label} className="text-center text-xs font-semibold text-gray-500 py-3 uppercase tracking-wider">
                                        {label}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((d, i) => (
                                    <div
                                        key={i}
                                        onClick={() => !d.inactive && setSelectedDay(d.day === selectedDay ? null : d.day)}
                                        className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer transition-all relative p-1
                                            ${d.inactive ? 'text-gray-300' : 'hover:bg-gray-100'}
                                            ${d.today ? 'bg-primary text-white font-semibold hover:bg-primary-dark' : ''}
                                            ${selectedDay === d.day && !d.today ? 'bg-primary/10 border-2 border-primary font-semibold' : ''}
                                        `}
                                    >
                                        <span>{d.day}</span>
                                        {d.hasEvent && !d.today && (
                                            <div className="flex gap-0.5 mt-1">
                                                {Array.from({ length: Math.min(d.events || 1, 3) }).map((_, j) => (
                                                    <span key={j} className="w-1.5 h-1.5 bg-warning rounded-full" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Events for selected day */}
                            <div className="card">
                                <h3 className="font-display text-base font-semibold mb-4">
                                    {selectedDay ? `Eventos del ${selectedDay} Feb` : 'Próximos Eventos'}
                                </h3>
                                <div className="space-y-3">
                                    {selectedDayEvents.length > 0 ? selectedDayEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className={`p-3 rounded-lg border-l-[3px] ${event.color} cursor-pointer hover:shadow-md transition-all`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-500 font-medium">{event.time} - {event.endTime}</span>
                                                <span className="text-lg">{event.typeIcon}</span>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">{event.client}</div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-6">
                                            <div className="text-2xl mb-2">📅</div>
                                            <div className="text-sm text-gray-500">Sin eventos para este día</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Upcoming Deadlines */}
                            <div className="card">
                                <h3 className="font-display text-base font-semibold mb-4">Próximas Entregas</h3>
                                <div className="space-y-3">
                                    {upcomingDeadlines.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[item.priority]}`} />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                <div className="text-xs text-gray-500">{item.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="card">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Leyenda</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="w-3 h-3 rounded-full bg-danger" /> Urgente
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="w-3 h-3 rounded-full bg-warning" /> Prioridad Alta
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="w-3 h-3 rounded-full bg-primary" /> Prioridad Media
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="w-3 h-3 rounded-full bg-success" /> Prioridad Baja
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
