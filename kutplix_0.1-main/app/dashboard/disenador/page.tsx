'use client'

import Sidebar from '@/components/Sidebar'

export default function DisenadorDashboard() {
    const urgentTasks = [
        {
            id: 1,
            title: 'Reel Promocional - Servicios',
            client: 'Clínica Dental SmileCenter',
            deadline: 'Hoy, 6:00 PM',
            type: 'Reel',
            typeIcon: '🎬',
            priority: 'urgent' as const,
            priorityText: 'Urgente',
            progress: 70,
        },
        {
            id: 2,
            title: 'Campaña Redes Sociales – Febrero',
            client: 'Spa Wellness & Beauty',
            deadline: '16 Feb',
            type: 'Carrusel',
            typeIcon: '📱',
            priority: 'high' as const,
            priorityText: 'Alta',
            progress: 45,
        },
    ]

    const inProgressTasks = [
        {
            id: 3,
            title: 'Imagen Estática – Promoción Marzo',
            client: 'Salón de Belleza Glamour',
            deadline: '20 Feb',
            type: 'Imagen',
            typeIcon: '🖼️',
            priority: 'medium' as const,
            priorityText: 'Media',
            progress: 30,
        },
        {
            id: 4,
            title: 'Historia Instagram – Tips',
            client: 'Centro Médico Integral',
            deadline: '22 Feb',
            type: 'Historia',
            typeIcon: '📱',
            priority: 'medium' as const,
            priorityText: 'Media',
            progress: 15,
        },
    ]

    const activities = [
        {
            id: 1,
            icon: '✓',
            iconStyle: 'bg-green-100 text-success',
            text: 'Proyecto aprobado:',
            detail: '"Banner Promocional Verano"',
            time: 'Hace 2 horas',
        },
        {
            id: 2,
            icon: '💬',
            iconStyle: 'bg-blue-100 text-primary',
            text: 'Nuevo comentario',
            detail: 'en "Campaña Redes Febrero"',
            time: 'Hace 4 horas',
        },
        {
            id: 3,
            icon: '🔄',
            iconStyle: 'bg-orange-100 text-warning',
            text: 'Revisión solicitada:',
            detail: '"Post Instagram Testimonios"',
            time: 'Ayer, 3:45 PM',
        },
    ]

    const calendarDays = [
        // Previous month (inactive)
        { day: 27, inactive: true },
        { day: 28, inactive: true },
        { day: 29, inactive: true },
        { day: 30, inactive: true },
        { day: 31, inactive: true },
        // February
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

    const upcomingEvents = [
        { time: 'Hoy, 6:00 PM', title: 'Reel Promocional – SmileCenter', color: 'border-l-primary' },
        { time: '16 Feb, 5:00 PM', title: 'Campaña Redes – Spa Wellness', color: 'border-l-warning' },
        { time: '18 Feb, 3:00 PM', title: 'Banner Web – Centro Médico', color: 'border-l-success' },
    ]

    const priorityStyles: Record<string, string> = {
        urgent: 'bg-red-50 text-danger',
        high: 'bg-orange-50 text-warning',
        medium: 'bg-blue-50 text-primary',
    }

    const taskBorderStyles: Record<string, string> = {
        urgent: 'border-danger bg-red-50/30',
        high: 'border-gray-200',
        medium: 'border-gray-200',
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar
                role="diseñador"
                userName="María González"
                userRole="Diseñadora Senior"
            />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Hola, María 👋
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Tienes 5 proyectos pendientes esta semana
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                                <span className="text-lg">🔔</span>
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                    5
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
                            <div className="font-display text-3xl font-bold text-primary">5</div>
                        </div>
                        <div className="card hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Completados (Mes)</div>
                            <div className="font-display text-3xl font-bold text-success">18</div>
                        </div>
                        <div className="card hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Tiempo Promedio</div>
                            <div className="font-display text-3xl font-bold text-warning">2.3d</div>
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
                                    <a href="#" className="text-primary text-sm font-medium hover:underline">
                                        Ver todas →
                                    </a>
                                </div>

                                <div className="space-y-3">
                                    {urgentTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${taskBorderStyles[task.priority]}`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-[15px]">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{task.client}</div>
                                                </div>
                                                <span
                                                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${priorityStyles[task.priority]}`}
                                                >
                                                    {task.priorityText}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        📅 Entrega: {task.deadline}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        {task.typeIcon} {task.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-success rounded-full transition-all"
                                                            style={{ width: `${task.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500">{task.progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                    {inProgressTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-4 rounded-xl border-2 border-gray-200 transition-all cursor-pointer hover:border-primary hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-[15px]">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{task.client}</div>
                                                </div>
                                                <span
                                                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${priorityStyles[task.priority]}`}
                                                >
                                                    {task.priorityText}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        📅 Entrega: {task.deadline}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        {task.typeIcon} {task.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-success rounded-full transition-all"
                                                            style={{ width: `${task.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500">{task.progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity Feed */}
                            <div className="card">
                                <div className="mb-5">
                                    <h3 className="font-display text-lg font-semibold">
                                        📊 Actividad Reciente
                                    </h3>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${activity.iconStyle}`}
                                            >
                                                {activity.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-900">
                                                    <strong>{activity.text}</strong> {activity.detail}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Calendar */}
                        <div>
                            <div className="card sticky top-24">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-display text-base font-semibold">Febrero 2026</h3>
                                    <div className="flex gap-2">
                                        <button className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200 transition-all text-sm">
                                            ‹
                                        </button>
                                        <button className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200 transition-all text-sm">
                                            ›
                                        </button>
                                    </div>
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
                                        Próximas Entregas
                                    </h4>
                                    <div className="space-y-2">
                                        {upcomingEvents.map((event, i) => (
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
