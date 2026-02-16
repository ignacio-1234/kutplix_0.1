'use client'

import { useState, useEffect, useRef } from 'react'

type Notification = {
    id: string
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
    is_read: boolean
    created_at: string
}

const typeStyles: Record<string, string> = {
    info: 'border-l-blue-500',
    warning: 'border-l-orange-500',
    success: 'border-l-green-500',
    error: 'border-l-red-500',
}

const typeIcons: Record<string, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    error: '🚨',
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications?limit=15')
            if (res.ok) {
                const data = await res.json()
                setNotifications(data.notifications || [])
                setUnreadCount(data.unreadCount || 0)
            }
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    // Fetch on mount and poll every 60 seconds
    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 60000)
        return () => clearInterval(interval)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleOpen = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            fetchNotifications()
        }
    }

    const markAllRead = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true }),
            })
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
                setUnreadCount(0)
            }
        } catch (error) {
            console.error('Error marking notifications read:', error)
        } finally {
            setLoading(false)
        }
    }

    const markOneRead = async (id: string) => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [id] }),
            })
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, is_read: true } : n)
                )
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Error marking notification read:', error)
        }
    }

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return 'ahora'
        if (minutes < 60) return `hace ${minutes}m`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `hace ${hours}h`
        const days = Math.floor(hours / 24)
        return `hace ${days}d`
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all"
            >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-display font-semibold text-gray-900">
                            Notificaciones
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                disabled={loading}
                                className="text-xs text-primary font-medium hover:underline disabled:opacity-50"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-5 py-10 text-center">
                                <div className="text-3xl mb-2">🔔</div>
                                <p className="text-sm text-gray-500">No tienes notificaciones</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => !notif.is_read && markOneRead(notif.id)}
                                    className={`px-5 py-4 border-b border-gray-100 border-l-4 cursor-pointer transition-all hover:bg-gray-50
                                        ${typeStyles[notif.type] || 'border-l-gray-300'}
                                        ${!notif.is_read ? 'bg-blue-50/50' : ''}
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg flex-shrink-0 mt-0.5">
                                            {typeIcons[notif.type] || 'ℹ️'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm text-gray-900 truncate">
                                                    {notif.title}
                                                </span>
                                                {!notif.is_read && (
                                                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <span className="text-xs text-gray-400 mt-1 block">
                                                {formatTimeAgo(notif.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
