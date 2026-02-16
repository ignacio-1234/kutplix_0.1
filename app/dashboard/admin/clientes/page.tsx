'use client'

import { useState, useEffect, useCallback } from 'react'

type Client = {
    id: string
    email: string
    first_name: string
    last_name: string
    role: 'client'
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

export default function AdminClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Action menu
    const [activeMenu, setActiveMenu] = useState<string | null>(null)

    // Notification
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 4000)
    }

    const fetchClients = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                search,
                role: 'client',
                status: statusFilter,
                sortBy,
                sortOrder,
            })

            const res = await fetch(`/api/admin/users?${params}`)
            const data = await res.json()

            if (res.ok) {
                setClients(data.users)
                setPagination(data.pagination)
            } else {
                showNotification('error', data.error || 'Error al cargar clientes')
            }
        } catch {
            showNotification('error', 'Error de conexion')
        } finally {
            setLoading(false)
        }
    }, [pagination.page, pagination.limit, search, statusFilter, sortBy, sortOrder])

    useEffect(() => {
        fetchClients()
    }, [fetchClients])

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

    const toggleClientStatus = async (client: Client) => {
        try {
            const res = await fetch(`/api/admin/users/${client.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !client.is_active }),
            })

            const data = await res.json()
            if (!res.ok) {
                showNotification('error', data.error || 'Error al cambiar estado')
                return
            }

            showNotification('success', `Cliente ${client.is_active ? 'desactivado' : 'activado'} correctamente`)
            fetchClients()
        } catch {
            showNotification('error', 'Error de conexion')
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
    const totalClients = pagination.total
    const activeClients = clients.filter(c => c.is_active).length
    const inactiveClients = clients.filter(c => !c.is_active).length

    // New clients this month (from loaded page)
    const now = new Date()
    const newThisMonth = clients.filter(c => {
        const created = new Date(c.created_at)
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length

    return (
        <div>
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
                        {notification.type === 'success' ? '\u2705' : '\u274C'}
                    </span>
                    <span className="font-medium">{notification.message}</span>
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-4 text-lg hover:opacity-70"
                    >
                        \u2715
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900">
                        Clientes
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Gestiona los clientes de la plataforma
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="card border-l-4 border-l-primary">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                            \uD83D\uDCBC
                        </div>
                    </div>
                    <div className="font-display text-3xl font-bold text-gray-900">
                        {totalClients}
                    </div>
                    <div className="text-sm text-gray-500">Total Clientes</div>
                </div>

                <div className="card border-l-4 border-l-success">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                            \u2705
                        </div>
                    </div>
                    <div className="font-display text-3xl font-bold text-gray-900">
                        {activeClients}
                    </div>
                    <div className="text-sm text-gray-500">Clientes Activos</div>
                </div>

                <div className="card border-l-4 border-l-danger">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl">
                            \u26D4
                        </div>
                    </div>
                    <div className="font-display text-3xl font-bold text-gray-900">
                        {inactiveClients}
                    </div>
                    <div className="text-sm text-gray-500">Clientes Inactivos</div>
                </div>

                <div className="card border-l-4 border-l-warning">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                            \u2728
                        </div>
                    </div>
                    <div className="font-display text-3xl font-bold text-gray-900">
                        {newThisMonth}
                    </div>
                    <div className="text-sm text-gray-500">Nuevos este mes</div>
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
                            \uD83D\uDD0D
                        </span>
                    </div>

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

            {/* Clients Table */}
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
                                        Cliente
                                        {sortBy === 'first_name' && (
                                            <span>{sortOrder === 'asc' ? '\u2191' : '\u2193'}</span>
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
                                            <span>{sortOrder === 'asc' ? '\u2191' : '\u2193'}</span>
                                        )}
                                    </span>
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
                                            <span>{sortOrder === 'asc' ? '\u2191' : '\u2193'}</span>
                                        )}
                                    </span>
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
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
                                            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
                                        </td>
                                        <td className="px-4 py-4 border-b border-gray-200">
                                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-4 py-4 border-b border-gray-200" />
                                    </tr>
                                ))
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <div className="text-4xl mb-3">\uD83D\uDCBC</div>
                                        <div className="text-gray-500 font-medium">No se encontraron clientes</div>
                                        <div className="text-gray-400 text-sm mt-1">
                                            Intenta cambiar los filtros de busqueda
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                    {getInitials(client.first_name, client.last_name)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">
                                                        {client.first_name} {client.last_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {client.id.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                                            {client.email}
                                        </td>
                                        <td className="px-4 py-4 border-b border-gray-200">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                client.is_active
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full ${
                                                    client.is_active ? 'bg-green-500' : 'bg-red-400'
                                                }`} />
                                                {client.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-500">
                                            {formatDate(client.created_at)}
                                        </td>
                                        <td className="px-4 py-4 border-b border-gray-200 relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                                                className="px-2 py-1 rounded-lg hover:bg-gray-100 transition-all text-lg"
                                            >
                                                \u22EF
                                            </button>

                                            {/* Action Dropdown */}
                                            {activeMenu === client.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-50"
                                                        onClick={() => setActiveMenu(null)}
                                                    />
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
                                                        <button
                                                            onClick={() => {
                                                                toggleClientStatus(client)
                                                            }}
                                                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                        >
                                                            <span>{client.is_active ? '\uD83D\uDD12' : '\uD83D\uDD13'}</span>
                                                            <span>{client.is_active ? 'Desactivar' : 'Activar'}</span>
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
                            {pagination.total} clientes
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
    )
}
