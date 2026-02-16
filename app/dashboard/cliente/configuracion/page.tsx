'use client'

import Sidebar from '@/components/Sidebar'

import { useState } from 'react'

export default function ConfiguracionCliente() {
    const [activeTab, setActiveTab] = useState('perfil')
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        projectUpdate: true,
        designReady: true,
        deadlineReminder: true,
        billing: true,
        newsletter: false,
    })

    const tabs = [
        { id: 'perfil', label: 'Perfil', icon: '👤' },
        { id: 'empresa', label: 'Empresa', icon: '🏢' },
        { id: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
        { id: 'seguridad', label: 'Seguridad', icon: '🔒' },
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName="Juan Pérez" userRole="Clínica Dental" />

import { useAuth } from '@/lib/auth-context'

export default function ConfiguracionPage() {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName={userName} userRole="Cliente" />


            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div>

                        <h2 className="font-display text-2xl font-semibold text-gray-900">Configuración</h2>
                        <p className="text-sm text-gray-600 mt-1">Gestiona tu cuenta y preferencias</p>

                        <h2 className="font-display text-2xl font-semibold text-gray-900">
                            Configuración
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Gestiona tu perfil y preferencias
                        </p>

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
                            {activeTab === 'perfil' && (
                                <div className="card">
                                    <h3 className="font-display text-lg font-semibold mb-6">Información Personal</h3>
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold">
                                            JP
                                        </div>
                                        <div>
                                            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all">Cambiar Foto</button>
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG. Máximo 2MB</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                            <input type="text" defaultValue="Juan" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                            <input type="text" defaultValue="Pérez" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input type="email" defaultValue="juan@smilecenter.com" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                            <input type="tel" defaultValue="+1 234 567 890" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                        <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Cancelar</button>
                                        <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">Guardar Cambios</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'empresa' && (
                                <div className="card">
                                    <h3 className="font-display text-lg font-semibold mb-6">Información de la Empresa</h3>

                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
                                            🏥
                                        </div>
                                        <div>
                                            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all">Cambiar Logo</button>
                                            <p className="text-xs text-gray-500 mt-1">PNG, SVG. Máximo 5MB</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
                                            <input type="text" defaultValue="Clínica Dental SmileCenter" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Industria</label>
                                            <select className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all">
                                                <option selected>Salud</option>
                                                <option>Belleza</option>
                                                <option>Gastronomía</option>
                                                <option>Tecnología</option>
                                                <option>Educación</option>
                                                <option>Otro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                                            <input type="url" defaultValue="https://smilecenter.com" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                            <input type="tel" defaultValue="+1 234 567 890" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Colores de Marca</label>
                                        <div className="flex gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-blue-600 border-2 border-gray-200 cursor-pointer" />
                                                <span className="text-xs text-gray-500">#2563EB</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-white border-2 border-gray-200 cursor-pointer" />
                                                <span className="text-xs text-gray-500">#FFFFFF</span>
                                            </div>
                                            <button className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm hover:border-primary transition-all">+</button>
                                        </div>
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
                                                {[
                                                    { key: 'email' as const, label: 'Email', desc: 'Recibe actualizaciones por correo' },
                                                    { key: 'push' as const, label: 'Push', desc: 'Notificaciones en el navegador' },
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
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Eventos</h4>
                                            <div className="space-y-3">
                                                {[
                                                    { key: 'projectUpdate' as const, label: 'Actualización de proyecto', desc: 'Cuando hay avances en tus proyectos' },
                                                    { key: 'designReady' as const, label: 'Diseño listo para revisión', desc: 'Cuando un diseño está listo' },
                                                    { key: 'deadlineReminder' as const, label: 'Recordatorio de fecha', desc: 'Próximas entregas' },
                                                    { key: 'billing' as const, label: 'Facturación', desc: 'Pagos y renovaciones' },
                                                    { key: 'newsletter' as const, label: 'Newsletter', desc: 'Noticias y actualizaciones de Kutplix' },
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
                                                <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
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
                                                        <div className="text-sm font-medium text-gray-900">Chrome · Windows</div>
                                                        <div className="text-xs text-gray-500">Sesión actual</div>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-2 py-1 bg-success text-white rounded-md font-medium">Activa</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card border border-red-200 bg-red-50/30">
                                        <h3 className="font-display text-lg font-semibold text-danger mb-4">Zona de Peligro</h3>
                                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Eliminar cuenta</div>
                                                <div className="text-xs text-gray-500">Esta acción es irreversible</div>
                                            </div>
                                            <button className="px-4 py-2 border border-danger text-danger rounded-lg text-sm font-medium hover:bg-red-50 transition-all">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                    {/* Profile Section */}
                    <div className="card mb-6">
                        <h3 className="font-display text-lg font-semibold text-gray-900 mb-6">
                            Perfil
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={user?.firstName || ''}
                                    readOnly
                                    className="input bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                                <input
                                    type="text"
                                    value={user?.lastName || ''}
                                    readOnly
                                    className="input bg-gray-50"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="input bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="card">
                        <h3 className="font-display text-lg font-semibold text-gray-900 mb-6">
                            Notificaciones
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Correo al recibir una entrega', desc: 'Notificarte cuando un diseñador suba su trabajo', checked: true },
                                { label: 'Recordatorios de revisión', desc: 'Avisos cuando tengas entregas pendientes de revisar', checked: true },
                                { label: 'Actualizaciones de proyectos', desc: 'Notificaciones de cambios de estado en tus proyectos', checked: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <div className="font-medium text-gray-900">{item.label}</div>
                                        <div className="text-sm text-gray-500">{item.desc}</div>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full cursor-pointer transition-colors ${item.checked ? 'bg-primary' : 'bg-gray-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm mt-1 transition-transform ${item.checked ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
