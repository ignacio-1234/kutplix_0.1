'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function ConfiguracionDisenador() {
    const [activeTab, setActiveTab] = useState('perfil')
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        newProject: true,
        deadlineReminder: true,
        clientComment: true,
        approvals: true,
        weeklyReport: false,
    })

    const tabs = [
        { id: 'perfil', label: 'Perfil', icon: '👤' },
        { id: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
        { id: 'preferencias', label: 'Preferencias', icon: '⚙️' },
        { id: 'seguridad', label: 'Seguridad', icon: '🔒' },
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName="María González" userRole="Diseñadora Senior" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-gray-900">Configuración</h2>
                        <p className="text-sm text-gray-600 mt-1">Gestiona tu perfil y preferencias</p>
                    </div>
                </header>

                <div className="p-10">
                    <div className="grid grid-cols-[250px_1fr] gap-8">
                        {/* Tabs */}
                        <div className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div>
                            {activeTab === 'perfil' && (
                                <div className="card">
                                    <h3 className="font-display text-lg font-semibold mb-6">Información Personal</h3>
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold">
                                            MG
                                        </div>
                                        <div>
                                            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all">
                                                Cambiar Foto
                                            </button>
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG. Máximo 2MB</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                            <input type="text" defaultValue="María" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                            <input type="text" defaultValue="González" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input type="email" defaultValue="maria@kutplix.com" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                            <input type="tel" defaultValue="+1 234 567 890" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Diseño Gráfico', 'Redes Sociales', 'Video Editing', 'Branding', 'UI/UX'].map((spec) => (
                                                <span key={spec} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                                                    {spec}
                                                </span>
                                            ))}
                                            <button className="px-3 py-1.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-all">
                                                + Agregar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">URL del Portfolio</label>
                                        <input type="url" defaultValue="https://mariagonzalez.design" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                        <textarea
                                            defaultValue="Diseñadora Senior con más de 5 años de experiencia en diseño digital, branding y creación de contenido para redes sociales."
                                            rows={3}
                                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all resize-none"
                                        />
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                        <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Cancelar</button>
                                        <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">Guardar Cambios</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notificaciones' && (
                                <div className="card">
                                    <h3 className="font-display text-lg font-semibold mb-6">Preferencias de Notificaciones</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Canales</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Notificaciones por Email</div>
                                                        <div className="text-xs text-gray-500">Recibe actualizaciones en tu correo</div>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                                                        className={`w-12 h-6 rounded-full transition-all ${notifications.email ? 'bg-primary' : 'bg-gray-300'}`}
                                                    >
                                                        <span className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Notificaciones Push</div>
                                                        <div className="text-xs text-gray-500">Notificaciones en el navegador</div>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                                                        className={`w-12 h-6 rounded-full transition-all ${notifications.push ? 'bg-primary' : 'bg-gray-300'}`}
                                                    >
                                                        <span className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notifications.push ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Eventos</h4>
                                            <div className="space-y-3">
                                                {[
                                                    { key: 'newProject' as const, label: 'Nuevo proyecto asignado', desc: 'Cuando se te asigna un proyecto nuevo' },
                                                    { key: 'deadlineReminder' as const, label: 'Recordatorio de deadline', desc: 'Alerta 24h antes de la entrega' },
                                                    { key: 'clientComment' as const, label: 'Comentario de cliente', desc: 'Cuando un cliente deja un comentario' },
                                                    { key: 'approvals' as const, label: 'Aprobaciones', desc: 'Cuando un proyecto es aprobado' },
                                                    { key: 'weeklyReport' as const, label: 'Reporte semanal', desc: 'Resumen de rendimiento semanal' },
                                                ].map((item) => (
                                                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{item.label}</div>
                                                            <div className="text-xs text-gray-500">{item.desc}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                                            className={`w-12 h-6 rounded-full transition-all ${notifications[item.key] ? 'bg-primary' : 'bg-gray-300'}`}
                                                        >
                                                            <span className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preferencias' && (
                                <div className="card">
                                    <h3 className="font-display text-lg font-semibold mb-6">Preferencias de Trabajo</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Proyectos Simultáneos Máximos</label>
                                            <select className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all">
                                                <option>3 proyectos</option>
                                                <option>4 proyectos</option>
                                                <option selected>5 proyectos</option>
                                                <option>6 proyectos</option>
                                                <option>Sin límite</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Horario de Trabajo</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-gray-500">Inicio</label>
                                                    <input type="time" defaultValue="09:00" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">Fin</label>
                                                    <input type="time" defaultValue="18:00" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
                                            <select className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all">
                                                <option>(UTC-5) Eastern Time</option>
                                                <option selected>(UTC-6) Central Time</option>
                                                <option>(UTC-7) Mountain Time</option>
                                                <option>(UTC-8) Pacific Time</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                                            <select className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all">
                                                <option selected>Español</option>
                                                <option>English</option>
                                                <option>Português</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                        <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Cancelar</button>
                                        <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">Guardar Cambios</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seguridad' && (
                                <div className="space-y-6">
                                    <div className="card">
                                        <h3 className="font-display text-lg font-semibold mb-6">Cambiar Contraseña</h3>
                                        <div className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                                                <input type="password" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                                                <input type="password" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                                <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, incluir mayúsculas y números</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                                                <input type="password" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">Actualizar Contraseña</button>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 className="font-display text-lg font-semibold mb-4">Sesiones Activas</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">💻</span>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Chrome · macOS</div>
                                                        <div className="text-xs text-gray-500">192.168.1.1 · Sesión actual</div>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-2 py-1 bg-success text-white rounded-md font-medium">Activa</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">📱</span>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Safari · iPhone</div>
                                                        <div className="text-xs text-gray-500">Hace 2 días</div>
                                                    </div>
                                                </div>
                                                <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-danger font-medium">
                                                    Cerrar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
