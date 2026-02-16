
'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function FacturacionAdmin() {
    const [period, setPeriod] = useState('mes')
    const [statusFilter, setStatusFilter] = useState('all')

    const invoices = [
        {
            id: 'INV-2026-0214',
            client: 'Clínica Dental SmileCenter',
            clientInitials: 'CS',
            plan: 'Profesional',
            amount: 299,
            status: 'paid' as const,
            statusText: 'Pagado',
            date: '14 Feb 2026',
            dueDate: '14 Feb 2026',
            method: 'Tarjeta ****4521',
        },
        {
            id: 'INV-2026-0213',
            client: 'Spa Wellness & Beauty',
            clientInitials: 'SW',
            plan: 'Enterprise',
            amount: 499,
            status: 'paid' as const,
            statusText: 'Pagado',
            date: '12 Feb 2026',
            dueDate: '12 Feb 2026',
            method: 'Transferencia',
        },
        {
            id: 'INV-2026-0210',
            client: 'Centro Médico Integral',
            clientInitials: 'CM',
            plan: 'Profesional',
            amount: 299,
            status: 'pending' as const,
            statusText: 'Pendiente',
            date: '10 Feb 2026',
            dueDate: '17 Feb 2026',
            method: '-',
        },
        {
            id: 'INV-2026-0208',
            client: 'Salón de Belleza Glamour',
            clientInitials: 'SG',
            plan: 'Básico',
            amount: 99,
            status: 'paid' as const,
            statusText: 'Pagado',
            date: '8 Feb 2026',
            dueDate: '8 Feb 2026',
            method: 'Tarjeta ****8832',
        },
        {
            id: 'INV-2026-0205',
            client: 'Pet Shop Happy',
            clientInitials: 'PH',
            plan: 'Básico',
            amount: 99,
            status: 'overdue' as const,
            statusText: 'Vencido',
            date: '5 Feb 2026',
            dueDate: '12 Feb 2026',
            method: '-',
        },
        {
            id: 'INV-2026-0201',
            client: 'Restaurante El Buen Sabor',
            clientInitials: 'BS',
            plan: 'Profesional',
            amount: 299,
            status: 'cancelled' as const,
            statusText: 'Cancelado',
            date: '1 Feb 2026',
            dueDate: '1 Feb 2026',
            method: '-',
        },
    ]

    const statusStyles: Record<string, string> = {
        paid: 'bg-green-50 text-success',
        pending: 'bg-orange-50 text-warning',
        overdue: 'bg-red-50 text-danger',
        cancelled: 'bg-gray-100 text-gray-500',
    }

    const filteredInvoices = statusFilter === 'all'
        ? invoices
        : invoices.filter(inv => inv.status === statusFilter)

    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
    const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)

    const monthlyRevenue = [
        { month: 'Sep', amount: 3200 },
        { month: 'Oct', amount: 3800 },
        { month: 'Nov', amount: 4100 },
        { month: 'Dic', amount: 3900 },
        { month: 'Ene', amount: 4500 },
        { month: 'Feb', amount: 4800 },
    ]

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount))

    return (
        <div className="flex min-h-screen">
            <Sidebar role="admin" userName="Admin User" userRole="Administrador" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Facturación</h2>
                            <p className="text-sm text-gray-600 mt-1">Control de pagos y facturación</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {['mes', 'trimestre', 'año'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                                        period === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Revenue Stats */}
                    <div className="grid grid-cols-4 gap-5 mb-10">
                        <div className="card border-l-4 border-l-success hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">💰</div>
                                <span className="text-xs px-2 py-1 bg-green-50 text-success rounded-md font-semibold">↑ 12%</span>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">${totalPaid.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Cobrado</div>
                        </div>
                        <div className="card border-l-4 border-l-warning hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">⏳</div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">${totalPending.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Pendiente</div>
                        </div>
                        <div className="card border-l-4 border-l-danger hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl">⚠️</div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">${totalOverdue.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Vencido</div>
                        </div>
                        <div className="card border-l-4 border-l-primary hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">📊</div>
                            </div>
                            <div className="font-display text-3xl font-bold text-gray-900">{invoices.length}</div>
                            <div className="text-sm text-gray-500">Facturas (Mes)</div>
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="card mb-10">
                        <h3 className="font-display text-lg font-semibold mb-6">Ingresos por Mes</h3>
                        <div className="flex items-end gap-6 h-48">
                            {monthlyRevenue.map((data, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-700">${(data.amount / 1000).toFixed(1)}K</span>
                                    <div className="w-full flex-1 flex flex-col justify-end">
                                        <div
                                            className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg hover:from-primary-dark hover:to-primary transition-all"
                                            style={{ height: `${(data.amount / maxRevenue) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invoices Table */}
                    <div className="card p-0 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h3 className="font-display text-lg font-semibold">Facturas Recientes</h3>
                            <div className="flex gap-2">
                                {[
                                    { id: 'all', label: 'Todas' },
                                    { id: 'paid', label: 'Pagadas' },
                                    { id: 'pending', label: 'Pendientes' },
                                    { id: 'overdue', label: 'Vencidas' },
                                ].map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setStatusFilter(filter.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            statusFilter === filter.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Factura</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Cliente</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Plan</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Monto</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Estado</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Vencimiento</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Método</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <span className="text-sm font-semibold text-primary">{invoice.id}</span>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[10px] font-bold">
                                                    {invoice.clientInitials}
                                                </div>
                                                <span className="text-sm text-gray-700">{invoice.client}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-600">{invoice.plan}</td>
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm font-bold text-gray-900">${invoice.amount}</td>
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <span className={`px-3 py-1.5 rounded-md text-xs font-semibold ${statusStyles[invoice.status]}`}>
                                                {invoice.statusText}
                                            </span>
                                        </td>
                                        <td className={`px-5 py-4 border-b border-gray-100 text-sm ${invoice.status === 'overdue' ? 'text-danger font-semibold' : 'text-gray-600'}`}>
                                            {invoice.dueDate}
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-500">{invoice.method}</td>
                                        <td className="px-5 py-4 border-b border-gray-100">
                                            <div className="flex gap-1">
                                                <button className="px-2 py-1 rounded hover:bg-gray-100 text-sm transition-all" title="Ver">👁️</button>
                                                <button className="px-2 py-1 rounded hover:bg-gray-100 text-sm transition-all" title="Descargar">📥</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

export default function AdminBillingPage() {
    return (
        <div className="bg-white rounded-lg shadow p-6 h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Facturación</h1>
            <p className="text-gray-600">Esta sección está en construcción.</p>

        </div>
    )
}
