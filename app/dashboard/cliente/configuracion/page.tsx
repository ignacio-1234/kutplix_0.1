'use client'

import Sidebar from '@/components/Sidebar'
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
                        <h2 className="font-display text-2xl font-semibold text-gray-900">
                            Configuración
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Gestiona tu perfil y preferencias
                        </p>
                    </div>
                </header>

                <div className="p-10">
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
