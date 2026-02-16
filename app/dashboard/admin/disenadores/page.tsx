'use client'

import { useState, useEffect } from 'react'

interface Designer {
    id: string
    user_id: string
    specialties: string[]
    max_concurrent_projects: number
    rating: number
    user: {
        first_name: string
        last_name: string
        email: string
        avatar_url: string | null
        is_active: boolean
    }
    stats: {
        totalProjects: number
        completedProjects: number
        activeProjects: number
    }
}

interface Company {
    id: string
    name: string
    users?: {
        first_name: string
        last_name: string
        email: string
    }
}

interface Project {
    id: string
    title: string
    company_name?: string
}

export default function AdminDesignersPage() {
    const [designers, setDesigners] = useState<Designer[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    // Modals state
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null)
    const [assignMode, setAssignMode] = useState<'new' | 'existing'>('new')

    // Task Form
    const [taskForm, setTaskForm] = useState({
        companyId: '',
        title: '',
        description: '',
        contentType: 'static',
        priority: 'medium',
        deadline: '',
    })

    const [selectedProjectId, setSelectedProjectId] = useState('')

    // Message Form
    const [messageForm, setMessageForm] = useState({
        title: '',
        message: ''
    })

    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const fetchDesigners = async () => {
        try {
            const res = await fetch('/api/admin/designers')
            const data = await res.json()
            if (res.ok) setDesigners(data.designers || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/admin/companies')
            const data = await res.json()
            if (res.ok) setCompanies(data.companies || [])
        } catch (err) {
            console.error(err)
        }
    }

    const fetchUnassignedProjects = async () => {
        try {
            const res = await fetch('/api/projects?unassigned=true')
            const data = await res.json()
            if (res.ok) setUnassignedProjects(data.projects || [])
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchDesigners()
        fetchCompanies()
        fetchUnassignedProjects()
    }, [])

    const showNotify = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 4000)
    }

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedDesigner) return

        try {
            if (assignMode === 'new') {
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...taskForm,
                        content_type: taskForm.contentType, // Fix: snake_case payload
                        designer_id: selectedDesigner.id
                    })
                })

                if (res.ok) {
                    showNotify('success', 'Nueva tarea creada y asignada')
                    closeTaskModal()
                    fetchDesigners()
                } else {
                    const data = await res.json()
                    showNotify('error', data.error || 'Error al crear tarea')
                }
            } else {
                // Assign existing
                if (!selectedProjectId) {
                    showNotify('error', 'Selecciona un proyecto')
                    return
                }

                const res = await fetch(`/api/projects/${selectedProjectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        designer_id: selectedDesigner.id,
                        status: 'pending' // Ensure it's active
                    })
                })

                if (res.ok) {
                    showNotify('success', 'Proyecto asignado correctamente')
                    closeTaskModal()
                    fetchDesigners()
                    fetchUnassignedProjects() // Refresh list
                } else {
                    const data = await res.json()
                    showNotify('error', data.error || 'Error al asignar proyecto')
                }
            }
        } catch (err) {
            showNotify('error', 'Error de conexión')
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedDesigner) return

        try {
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: selectedDesigner.user_id,
                    title: messageForm.title || 'Mensaje del Administrador',
                    message: messageForm.message,
                    type: 'info'
                })
            })

            if (res.ok) {
                showNotify('success', `Mensaje enviado a ${selectedDesigner.user.first_name}`)
                setShowMessageModal(false)
                setMessageForm({ title: '', message: '' })
            } else {
                const data = await res.json()
                showNotify('error', data.error || 'Error al enviar mensaje')
            }
        } catch (err) {
            showNotify('error', 'Error de conexión')
        }
    }

    const openTaskModal = (designer: Designer) => {
        setSelectedDesigner(designer)
        fetchUnassignedProjects() // Refresh before showing
        setShowTaskModal(true)
    }

    const closeTaskModal = () => {
        setShowTaskModal(false)
        setTaskForm({ companyId: '', title: '', description: '', contentType: 'static', priority: 'medium', deadline: '' })
        setSelectedProjectId('')
        setAssignMode('new')
    }

    const openMessageModal = (designer: Designer) => {
        setSelectedDesigner(designer)
        setShowMessageModal(true)
    }

    return (
        <div className="p-6">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg border animate-fadeIn flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    <span className="text-xl">{notification.type === 'success' ? '✅' : '❌'}</span>
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Diseñadores</h1>
                    <p className="text-gray-600 text-sm">Gestiona el equipo de diseño y asigna tareas</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="text-4xl animate-spin mb-3">⏳</div>
                    <p className="text-gray-500">Cargando equipo...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {designers.map(designer => (
                        <div key={designer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                        {designer.user.first_name[0]}{designer.user.last_name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{designer.user.first_name} {designer.user.last_name}</h3>
                                        <div className="text-xs text-gray-500">{designer.user.email}</div>
                                    </div>
                                    <div className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase ${designer.user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {designer.user.is_active ? 'Activo' : 'Inactivo'}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{designer.stats.activeProjects}</div>
                                        <div className="text-xs">Activos</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{designer.stats.completedProjects}</div>
                                        <div className="text-xs">Completados</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{designer.rating || '-'}</div>
                                        <div className="text-xs">Rating</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => openTaskModal(designer)}
                                        className="w-full py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>📋</span> Asignar Tarea
                                    </button>
                                    <button
                                        onClick={() => openMessageModal(designer)}
                                        className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>💬</span> Enviar Mensaje
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Task Modal */}
            {showTaskModal && selectedDesigner && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900">Asignar a {selectedDesigner.user.first_name}</h3>
                            <button onClick={closeTaskModal} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="p-6">
                            {/* Tabs */}
                            <div className="flex gap-4 border-b border-gray-200 mb-6">
                                <button
                                    onClick={() => setAssignMode('new')}
                                    className={`pb-2 text-sm font-medium ${assignMode === 'new' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Crear Nueva
                                </button>
                                <button
                                    onClick={() => setAssignMode('existing')}
                                    className={`pb-2 text-sm font-medium ${assignMode === 'existing' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Existente ({unassignedProjects.length})
                                </button>
                            </div>

                            <form onSubmit={handleAssignTask} className="space-y-4">
                                {assignMode === 'new' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente / Empresa</label>
                                            <select
                                                required
                                                value={taskForm.companyId}
                                                onChange={e => setTaskForm({ ...taskForm, companyId: e.target.value })}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                            >
                                                <option value="">Seleccionar Cliente...</option>
                                                {companies.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name} ({c.users?.first_name} {c.users?.last_name})</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Título del Proyecto</label>
                                            <input
                                                type="text"
                                                required
                                                value={taskForm.title}
                                                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                                placeholder="Ej: Diseño de Logo"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={taskForm.description}
                                                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                                placeholder="Detalles del trabajo..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                                <select
                                                    value={taskForm.contentType}
                                                    onChange={e => setTaskForm({ ...taskForm, contentType: e.target.value })}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                                >
                                                    <option value="static">Static Post</option>
                                                    <option value="reel">Reel</option>
                                                    <option value="story">Story</option>
                                                    <option value="carousel">Carousel</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                                                <select
                                                    value={taskForm.priority}
                                                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                                >
                                                    <option value="low">Baja</option>
                                                    <option value="medium">Media</option>
                                                    <option value="high">Alta</option>
                                                    <option value="urgent">Urgente</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega</label>
                                            <input
                                                type="datetime-local"
                                                required
                                                value={taskForm.deadline}
                                                onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Proyecto Pendiente</label>
                                        <select
                                            required
                                            value={selectedProjectId}
                                            onChange={e => setSelectedProjectId(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                        >
                                            <option value="">Seleccionar Proyecto...</option>
                                            {unassignedProjects.map(p => (
                                                <option key={p.id} value={p.id}>{p.title} {p.company_name ? `- ${p.company_name}` : ''}</option>
                                            ))}
                                        </select>
                                        {unassignedProjects.length === 0 && (
                                            <p className="text-xs text-gray-500 mt-2">No hay proyectos sin asignar.</p>
                                        )}
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeTaskModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-700"
                                    >
                                        Confirmar Asignación
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Modal */}
            {showMessageModal && selectedDesigner && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900">Mensaje para {selectedDesigner.user.first_name}</h3>
                            <button onClick={() => setShowMessageModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                                <input
                                    type="text"
                                    value={messageForm.title}
                                    onChange={e => setMessageForm({ ...messageForm, title: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                    placeholder="Importante..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={messageForm.message}
                                    onChange={e => setMessageForm({ ...messageForm, message: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                                    placeholder="Escribe tu mensaje aquí..."
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMessageModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-700"
                                >
                                    Enviar Mensaje
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
