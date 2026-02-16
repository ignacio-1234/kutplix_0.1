
'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function ConfiguracionAdmin() {
    const [activeTab, setActiveTab] = useState('general')
    const [notifications, setNotifications] = useState({
        newUser: true,
        projectAlert: true,
        paymentReceived: true,
        systemUpdate: true,
        weeklyDigest: true,
        overdueBilling: true,
    })

    const tabs = [
        { id: 'general', label: 'General', icon: '⚙️' },
        { id: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
        { id: 'seguridad', label: 'Seguridad', icon: '🔒' },
        { id: 'sistema', label: 'Sistema', icon: '🖥️' },
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar role="admin" userName="Admin User" userRole="Administrador" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-gray-900">Configuración</h2>
                        <p className="text-sm text-gray-600 mt-1">Configuración general de la plataforma</p>
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
                                        activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div>
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <div className="card">
                                        <h3 className="font-display text-lg font-semibold mb-6">Información de la Plataforma</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Plataforma</label>
                                                <input type="text" defaultValue="KUTPLIX" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
                                                <input type="email" defaultValue="admin@kutplix.com" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                                <input type="tel" defaultValue="+1 800 KUTPLIX" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                                                <input type="url" defaultValue="https://kutplix.com" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                            <textarea
                                                defaultValue="Plataforma de gestión de contenido digital que conecta clientes con diseñadores profesionales."
                                                rows={3}
                                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all resize-none"
                                            />
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                            <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Cancelar</button>
                                            <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">Guardar Cambios</button>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 className="font-display text-lg font-semibold mb-6">Configuración Regional</h3>
                                        <div className="grid grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                                                <select className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all">
                                                    <option selected>Español</option>
                                                    <option>English</option>
                                                    <option>Português</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
                                                <select className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all">
                                                    <option>(UTC-5) Eastern</option>
                                                    <option selected>(UTC-6) Central</option>
                                                    <option>(UTC-7) Mountain</option>
                                                    <option>(UTC-8) Pacific</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                                                <select className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all">
                                                    <option selected>USD ($)</option>
                                                    <option>EUR (€)</option>
                                                    <option>MXN ($)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                                            <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notificaciones' && (
                                <div className="card">
                                    <h3 className="font-display text-lg font-semibold mb-6">Notificaciones del Sistema</h3>
                                    <div className="space-y-3">
                                        {[
                                            { key: 'newUser' as const, label: 'Nuevo usuario registrado', desc: 'Notificar cuando un nuevo usuario se registra' },
                                            { key: 'projectAlert' as const, label: 'Alertas de proyecto', desc: 'Proyectos en riesgo o atrasados' },
                                            { key: 'paymentReceived' as const, label: 'Pago recibido', desc: 'Cuando se recibe un pago de suscripción' },
                                            { key: 'systemUpdate' as const, label: 'Actualizaciones del sistema', desc: 'Notificaciones de mantenimiento' },
                                            { key: 'weeklyDigest' as const, label: 'Resumen semanal', desc: 'Resumen de actividad de la plataforma' },
                                            { key: 'overdueBilling' as const, label: 'Facturación vencida', desc: 'Alertar sobre pagos vencidos' },
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
                            )}

                            {activeTab === 'seguridad' && (
                                <div className="space-y-6">
                                    <div className="card">
                                        <h3 className="font-display text-lg font-semibold mb-6">Cambiar Contraseña de Admin</h3>
                                        <div className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                                                <input type="password" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                                                <input type="password" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
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
                                        <h3 className="font-display text-lg font-semibold mb-4">Políticas de Seguridad</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Autenticación de dos factores (2FA)</div>
                                                    <div className="text-xs text-gray-500">Requerir 2FA para todos los administradores</div>
                                                </div>
                                                <button className="w-12 h-6 rounded-full bg-primary transition-all">
                                                    <span className="block w-5 h-5 bg-white rounded-full shadow-sm translate-x-6" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Expiración de sesión</div>
                                                    <div className="text-xs text-gray-500">Cerrar sesiones inactivas después de 24 horas</div>
                                                </div>
                                                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                                                    <option>8 horas</option>
                                                    <option selected>24 horas</option>
                                                    <option>7 días</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Complejidad de contraseña</div>
                                                    <div className="text-xs text-gray-500">Requisitos mínimos para contraseñas</div>
                                                </div>
                                                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                                                    <option>Básica (6+ chars)</option>
                                                    <option selected>Media (8+ chars, mixto)</option>
                                                    <option>Alta (12+ chars, especiales)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sistema' && (
                                <div className="space-y-6">
                                    <div className="card">
                                        <h3 className="font-display text-lg font-semibold mb-6">Información del Sistema</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Versión', value: '1.0.0' },
                                                { label: 'Entorno', value: 'Producción' },
                                                { label: 'Base de Datos', value: 'Supabase (PostgreSQL)' },
                                                { label: 'Framework', value: 'Next.js 14' },
                                                { label: 'Último Deploy', value: '14 Feb 2026, 10:30 AM' },
                                                { label: 'Uptime', value: '99.9%' },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                    <span className="text-sm text-gray-600">{item.label}</span>
                                                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 className="font-display text-lg font-semibold mb-6">Almacenamiento</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm text-gray-700">Archivos subidos</span>
                                                    <span className="text-sm font-semibold">12.5 GB / 50 GB</span>
                                                </div>
                                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full" style={{ width: '25%' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm text-gray-700">Base de datos</span>
                                                    <span className="text-sm font-semibold">2.1 GB / 10 GB</span>
                                                </div>
                                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-success rounded-full" style={{ width: '21%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card border border-red-200 bg-red-50/30">
                                        <h3 className="font-display text-lg font-semibold text-danger mb-4">Zona de Peligro</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Limpiar caché del sistema</div>
                                                    <div className="text-xs text-gray-500">Elimina todos los archivos de caché temporales</div>
                                                </div>
                                                <button className="px-4 py-2 border border-danger text-danger rounded-lg text-sm font-medium hover:bg-red-50 transition-all">
                                                    Limpiar
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Exportar datos</div>
                                                    <div className="text-xs text-gray-500">Exportar todos los datos de la plataforma</div>
                                                </div>
                                                <button className="px-4 py-2 border border-danger text-danger rounded-lg text-sm font-medium hover:bg-red-50 transition-all">
                                                    Exportar
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

export default function AdminSettingsPage() {
    return (
        <div className="bg-white rounded-lg shadow p-6 h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Configuración</h1>
            <p className="text-gray-600">Esta sección está en construcción.</p>

        </div>
    )
}
