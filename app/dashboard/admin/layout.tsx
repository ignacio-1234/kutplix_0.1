'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar
                role="admin"
                userName="Admin User"
                userRole="Administrador"
            />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900 dark:text-white">
                                Panel de Control
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Kutplix – Administración
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>

                            <button className="relative w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                                <span className="text-lg">🔔</span>
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                                    3
                                </span>
                            </button>

                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
