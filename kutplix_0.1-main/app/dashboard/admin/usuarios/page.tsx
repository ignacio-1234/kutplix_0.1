'use client'

import Sidebar from '@/components/Sidebar'
import { useState, useEffect, useCallback } from 'react'

type User = {
    id: string
    email: string
    first_name: string
    last_name: string
    role: 'admin' | 'client' | 'designer'
    avatar_url?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

type Pagination = {
    page: number
    limit: number
    total: number
    totalPages: number
}

type ModalMode = 'create' | 'edit' | null

const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    client: 'Cliente',
    designer: 'Diseñador',
}

const roleStyles: Record<string, string> = {
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    client: 'bg-blue-50 text-blue-700 border-blue-200',
    designer: 'bg-green-50 text-green-700 border-green-200',
}

const roleIcons: Record<string, string> = {
    admin: '🛡️',
    client: '💼',
    designer: '🎨',
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Modal state
    const [modalMode, setModalMode] = useState<ModalMode>(null)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'client' as 'admin' | 'client' | 'designer',
        isActive: true,
        companyName: '',
        specialties: '',
    })
    const [formError, setFormError] = useState('')
    const [formLoading, setFormLoading] = useState(false)

    // Delete confirmation
    const [deleteUser, setDeleteUser] = useState<User | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Action menu
    const [activeMenu, setActiveMenu] = useState<string | null>(null)

    // Notification
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 4000)
    }

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                search,
                role: roleFilter,
                status: statusFilter,
                sortBy,
                sortOrder,
            })

            const res = await fetch(`/api/admin/users?${params}`)
            const data = await res.json()

            if (res.ok) {
                setUsers(data.users)
                setPagination(data.pagination)
            } else {
                showNotification('error', data.error || 'Error al cargar usuarios')
            }
        } catch {
            showNotification('error', 'Error de conexión')
        } finally {
            setLoading(false)
        }
    }, [pagination.page, pagination.limit, search, roleFilter, statusFilter, sortBy, sortOrder])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    // Debounce search
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
    const handleSearchChange = (value: string) => {
        setSearch(value)
        if (searchTimeout) clearTimeout(searchTimeout)
        const timeout = setTimeout(() => {
            setPagination(prev => ({ ...prev, page: 1 }))
        }, 300)
        setSearchTimeout(timeout)
    }

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortBy(column)
            setSortOrder('asc')
        }
    }

    const openCreateModal = () => {
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            role: 'client',
            isActive: true,
            companyName: '',
            specialties: '',
        })
        setFormError('')
        setEditingUser(null)
        setModalMode('create')
    }

    const openEditModal = (user: User) => {
        setFormData({
            email: user.email,
            password: '',
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            isActive: user.is_active,
            companyName: '',
            specialties: '',
        })
        setFormError('')
        setEditingUser(user)
        setModalMode('edit')
        setActiveMenu(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError('')

        try {
            if (modalMode === 'create') {
                const res = await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        role: formData.role,
                        isActive: formData.isActive,
                        companyName: formData.role === 'client' ? formData.companyName : undefined,
                        specialties: formData.role === 'designer' && formData.specialties
                            ? formData.specialties.split(',').map(s => s.trim()).filter(Boolean)
                            : undefined,
                    }),
                })

                const data = await res.json()
                if (!res.ok) {
                    setFormError(data.error)
                    return
                }

                showNotification('success', 'Usuario creado correctamente')
            } else if (modalMode === 'edit' && editingUser) {
                const updatePayload: Record<string, unknown> = {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role,
                    isActive: formData.isActive,
                }
                if (formData.password) {
                    updatePayload.password = formData.password
                }

                const res = await fetch(`/api/admin/users/${editingUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePayload),
                })

                const data = await res.json()
                if (!res.ok) {
                    setFormError(data.error)
                    return
                }

                showNotification('success', 'Usuario actualizado correctamente')
            }

            setModalMode(null)
            fetchUsers()
        } catch {
            setFormError('Error de conexión')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteUser) return
        setDeleteLoading(true)

        try {
            const res = await fetch(`/api/admin/users/${deleteUser.id}`, {
                method: 'DELETE',
            })

            const data = await res.json()
            if (!res.ok) {
                showNotification('error', data.error || 'Error al desactivar usuario')
                return
            }

            showNotification('success', 'Usuario desactivado correctamente')
            setDeleteUser(null)
            fetchUsers()
        } catch {
            showNotification('error', 'Error de conexión')
        } finally {
            setDeleteLoading(false)
        }
    }

    const toggleUserStatus = async (user: User) => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !user.is_active }),
            })

            const data = await res.json()
            if (!res.ok) {
                showNotification('error', data.error || 'Error al cambiar estado')
                return
            }

            showNotification('success', `Usuario ${user.is_active ? 'desactivado' : 'activado'} correctamente`)
            fetchUsers()
        } catch {
            showNotification('error', 'Error de conexión')
        }
        setActiveMenu(null)
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    // Stats
    const totalUsers = pagination.total
    const activeUsers = users.filter(u => u.is_active).length
    const roleCount = {
        admin: users.filter(u => u.role === 'admin').length,
        client: users.filter(u => u.role === 'client').length,
        designer: users.filter(u => u.role === 'designer').length,
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar
                role="admin"
                userName="Admin User"
                userRole="Administrador"
            />

            <main className="flex-1 ml-72">
                {/* Notification */}
                {notification && (
                    <div
                        className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-xl shadow-lg border animate-fadeIn flex items-center gap-3 ${
                            notification.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                        <span className="text-xl">
                            {notification.type === 'success' ? '✅' : '❌'}
                        </span>
                        <span className="font-medium">{notification.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-4 text-lg hover:opacity-70"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Gestión de Usuarios
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Administra los usuarios de la plataforma
                            </p>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="btn-primary flex items-center gap-2"
                        >
                            <span>+</span>
                            <span>Nuevo Usuario</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-10">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        <div className="card border-l-4 border-l-primary">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                                    👥
                                </div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">
                                {totalUsers}
                            </div>
                            <div className="text-sm text-gray-500">Total Usuarios</div>
                        </div>

                        <div className="card border-l-4 border-l-success">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                                    ✅
                                </div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">
                                {activeUsers}
                            </div>
                            <div className="text-sm text-gray-500">Usuarios Activos</div>
                        </div>

                        <div className="card border-l-4 border-l-purple">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
                                    🎨
                                </div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">
                                {roleCount.designer}
                            </div>
                            <div className="text-sm text-gray-500">Diseñadores</div>
                        </div>

                        <div className="card border-l-4 border-l-warning">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                                    💼
                                </div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">
                                {roleCount.client}
                            </div>
                            <div className="text-sm text-gray-500">Clientes</div>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="card mb-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[250px]">
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, email..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>

                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value)
                                    setPagination(prev => ({ ...prev, page: 1 }))
                                }}
                                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all bg-white"
                            >
                                <option value="all">Todos los roles</option>
                                <option value="admin">Administradores</option>
                                <option value="client">Clientes</option>
                                <option value="designer">Diseñadores</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value)
                                    setPagination(prev => ({ ...prev, page: 1 }))
                                }}
                                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all bg-white"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="active">Activos</option>
                                <option value="inactive">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="card">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th
                                            className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:text-gray-700"
                                            onClick={() => handleSort('first_name')}
                                        >
                                            <span className="flex items-center gap-1">
                                                Usuario
                                                {sortBy === 'first_name' && (
                                                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </span>
                                        </th>
                                        <th
                                            className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:text-gray-700"
                                            onClick={() => handleSort('email')}
                                        >
                                            <span className="flex items-center gap-1">
                                                Email
                                                {sortBy === 'email' && (
                                                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </span>
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Rol
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Estado
                                        </th>
                                        <th
                                            className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:text-gray-700"
                                            onClick={() => handleSort('created_at')}
                                        >
                                            <span className="flex items-center gap-1">
                                                Registro
                                                {sortBy === 'created_at' && (
                                                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </span>
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        // Skeleton loading
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-4 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                                                        <div>
                                                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1" />
                                                            <div className="w-20 h-3 bg-gray-100 rounded animate-pulse" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200">
                                                    <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200">
                                                    <div className="w-24 h-6 bg-gray-200 rounded-md animate-pulse" />
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200">
                                                    <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200">
                                                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200" />
                                            </tr>
                                        ))
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-16 text-center">
                                                <div className="text-4xl mb-3">👤</div>
                                                <div className="text-gray-500 font-medium">No se encontraron usuarios</div>
                                                <div className="text-gray-400 text-sm mt-1">
                                                    Intenta cambiar los filtros o crea un nuevo usuario
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                            {getInitials(user.first_name, user.last_name)}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 text-sm">
                                                                {user.first_name} {user.last_name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                ID: {user.id.slice(0, 8)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${roleStyles[user.role]}`}>
                                                        <span>{roleIcons[user.role]}</span>
                                                        {roleLabels[user.role]}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                        user.is_active
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            user.is_active ? 'bg-green-500' : 'bg-red-400'
                                                        }`} />
                                                        {user.is_active ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-500">
                                                    {formatDate(user.created_at)}
                                                </td>
                                                <td className="px-4 py-4 border-b border-gray-200 relative">
                                                    <button
                                                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                                        className="px-2 py-1 rounded-lg hover:bg-gray-100 transition-all text-lg"
                                                    >
                                                        ⋯
                                                    </button>

                                                    {/* Action Dropdown */}
                                                    {activeMenu === user.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-50"
                                                                onClick={() => setActiveMenu(null)}
                                                            />
                                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
                                                                <button
                                                                    onClick={() => openEditModal(user)}
                                                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                                >
                                                                    <span>✏️</span>
                                                                    <span>Editar usuario</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        toggleUserStatus(user)
                                                                    }}
                                                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                                >
                                                                    <span>{user.is_active ? '🔒' : '🔓'}</span>
                                                                    <span>{user.is_active ? 'Desactivar' : 'Activar'}</span>
                                                                </button>
                                                                <div className="border-t border-gray-100" />
                                                                <button
                                                                    onClick={() => {
                                                                        setDeleteUser(user)
                                                                        setActiveMenu(null)
                                                                    }}
                                                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
                                                                >
                                                                    <span>🗑️</span>
                                                                    <span>Eliminar</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                                    {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                                    {pagination.total} usuarios
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={pagination.page === 1}
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Anterior
                                    </button>
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            const current = pagination.page
                                            return page === 1 || page === pagination.totalPages || Math.abs(page - current) <= 1
                                        })
                                        .map((page, i, arr) => (
                                            <span key={page}>
                                                {i > 0 && arr[i - 1] !== page - 1 && (
                                                    <span className="px-2 text-gray-400">...</span>
                                                )}
                                                <button
                                                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                                                        pagination.page === page
                                                            ? 'bg-primary text-white'
                                                            : 'border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            </span>
                                        ))}
                                    <button
                                        disabled={pagination.page === pagination.totalPages}
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Create/Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setModalMode(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-xl font-semibold">
                                    {modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
                                </h3>
                                <button
                                    onClick={() => setModalMode(null)}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {formError}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="input text-sm"
                                        placeholder="Nombre"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="input text-sm"
                                        placeholder="Apellido"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="input text-sm"
                                    placeholder="usuario@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña {modalMode === 'edit' && <span className="text-gray-400">(dejar vacío para no cambiar)</span>}
                                </label>
                                <input
                                    type="password"
                                    required={modalMode === 'create'}
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="input text-sm"
                                    placeholder={modalMode === 'edit' ? '••••••••' : 'Mínimo 8 caracteres'}
                                    minLength={modalMode === 'create' ? 8 : undefined}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rol
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['client', 'designer', 'admin'] as const).map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, role }))}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                                                formData.role === role
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="text-2xl mb-1">{roleIcons[role]}</div>
                                            <div className="text-xs font-semibold">{roleLabels[role]}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Campo condicional: nombre de empresa */}
                            {formData.role === 'client' && modalMode === 'create' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de Empresa <span className="text-gray-400">(opcional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                        className="input text-sm"
                                        placeholder="Nombre de la empresa"
                                    />
                                </div>
                            )}

                            {/* Campo condicional: especialidades del diseñador */}
                            {formData.role === 'designer' && modalMode === 'create' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Especialidades <span className="text-gray-400">(separadas por comas)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.specialties}
                                        onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                                        className="input text-sm"
                                        placeholder="Diseño gráfico, Branding, UI/UX"
                                    />
                                </div>
                            )}

                            {/* Estado activo */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Usuario Activo</div>
                                    <div className="text-xs text-gray-500">
                                        Los usuarios inactivos no pueden iniciar sesión
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                    className={`w-12 h-6 rounded-full transition-all relative ${
                                        formData.isActive ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                            formData.isActive ? 'left-6' : 'left-0.5'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalMode(null)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {modalMode === 'create' ? 'Creando...' : 'Guardando...'}
                                        </span>
                                    ) : (
                                        modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteUser && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setDeleteUser(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                ⚠️
                            </div>
                            <h3 className="font-display text-xl font-semibold mb-2">
                                Desactivar Usuario
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                ¿Estás seguro de que quieres desactivar a{' '}
                                <strong>{deleteUser.first_name} {deleteUser.last_name}</strong>?
                                <br />
                                El usuario no podrá iniciar sesión hasta ser reactivado.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteUser(null)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="flex-1 px-6 py-3 bg-danger text-white rounded-lg font-semibold transition-all hover:bg-red-600 disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Desactivando...
                                        </span>
                                    ) : (
                                        'Sí, Desactivar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
