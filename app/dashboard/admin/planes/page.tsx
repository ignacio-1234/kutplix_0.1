'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function PlanesAdmin() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

    const plans = [
        {
            id: 1,
            name: 'Básico',
            description: 'Ideal para pequeños negocios que inician su presencia digital.',
            monthlyPrice: 99,
            annualPrice: 79,
            color: 'border-t-gray-400',
            buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            popular: false,
            features: [
                { text: '5 proyectos por mes', included: true },
                { text: '1 revisión por proyecto', included: true },
                { text: 'Soporte por email', included: true },
                { text: 'Tiempo de entrega: 5 días', included: true },
                { text: 'Diseñador dedicado', included: false },
                { text: 'Prioridad en cola', included: false },
                { text: 'Reportes avanzados', included: false },
                { text: 'Reuniones de estrategia', included: false },
            ],
            subscribers: 45,
            revenue: 4455,
        },
        {
            id: 2,
            name: 'Profesional',
            description: 'Para negocios en crecimiento que necesitan contenido constante.',
            monthlyPrice: 299,
            annualPrice: 249,
            color: 'border-t-primary',
            buttonStyle: 'bg-primary text-white hover:bg-primary-dark',
            popular: true,
            features: [
                { text: '15 proyectos por mes', included: true },
                { text: '3 revisiones por proyecto', included: true },
                { text: 'Soporte prioritario', included: true },
                { text: 'Tiempo de entrega: 3 días', included: true },
                { text: 'Diseñador dedicado', included: true },
                { text: 'Prioridad en cola', included: true },
                { text: 'Reportes avanzados', included: false },
                { text: 'Reuniones de estrategia', included: false },
            ],
            subscribers: 82,
            revenue: 24518,
        },
        {
            id: 3,
            name: 'Enterprise',
            description: 'Solución completa para empresas con alto volumen de contenido.',
            monthlyPrice: 499,
            annualPrice: 399,
            color: 'border-t-purple',
            buttonStyle: 'bg-gradient-to-r from-purple to-violet-700 text-white hover:shadow-lg',
            popular: false,
            features: [
                { text: 'Proyectos ilimitados', included: true },
                { text: 'Revisiones ilimitadas', included: true },
                { text: 'Soporte 24/7', included: true },
                { text: 'Tiempo de entrega: 24h', included: true },
                { text: 'Equipo dedicado', included: true },
                { text: 'Máxima prioridad', included: true },
                { text: 'Reportes avanzados', included: true },
                { text: 'Reuniones de estrategia', included: true },
            ],
            subscribers: 30,
            revenue: 14970,
        },
    ]

    const totalRevenue = plans.reduce((sum, p) => sum + p.revenue, 0)
    const totalSubscribers = plans.reduce((sum, p) => sum + p.subscribers, 0)

    return (
        <div className="flex min-h-screen">
            <Sidebar role="admin" userName="Admin User" userRole="Administrador" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Planes y Precios</h2>
                            <p className="text-sm text-gray-600 mt-1">Gestión de suscripciones y precios</p>
                        </div>
                        <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
                            + Crear Plan
                        </button>
                    </div>
                </header>

                <div className="p-10">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-5 mb-10">
                        <div className="card border-l-4 border-l-primary hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Suscriptores Totales</div>
                            <div className="font-display text-3xl font-bold text-primary">{totalSubscribers}</div>
                        </div>
                        <div className="card border-l-4 border-l-success hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Ingresos Mensuales</div>
                            <div className="font-display text-3xl font-bold text-success">${totalRevenue.toLocaleString()}</div>
                        </div>
                        <div className="card border-l-4 border-l-warning hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Plan Más Popular</div>
                            <div className="font-display text-3xl font-bold text-warning">Pro</div>
                        </div>
                        <div className="card border-l-4 border-l-purple hover:shadow-lg transition-all">
                            <div className="text-sm text-gray-500 mb-2">Ticket Promedio</div>
                            <div className="font-display text-3xl font-bold text-purple">${Math.round(totalRevenue / totalSubscribers)}</div>
                        </div>
                    </div>

                    {/* Billing Period Toggle */}
                    <div className="flex justify-center mb-10">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setBillingPeriod('monthly')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    billingPeriod === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                }`}
                            >
                                Mensual
                            </button>
                            <button
                                onClick={() => setBillingPeriod('annual')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                    billingPeriod === 'annual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                }`}
                            >
                                Anual
                                <span className="text-xs px-2 py-0.5 bg-success text-white rounded-md font-bold">-20%</span>
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-3 gap-6 mb-10">
                        {plans.map((plan) => (
                            <div key={plan.id} className={`card border-t-4 ${plan.color} hover:shadow-lg transition-all relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                                        MÁS POPULAR
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-sm text-gray-500">{plan.description}</p>
                                </div>

                                <div className="text-center mb-6">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="font-display text-4xl font-bold text-gray-900">
                                            ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                                        </span>
                                        <span className="text-gray-500 text-sm">/mes</span>
                                    </div>
                                    {billingPeriod === 'annual' && (
                                        <div className="text-xs text-gray-400 mt-1 line-through">${plan.monthlyPrice}/mes</div>
                                    )}
                                </div>

                                <div className="space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <span className={feature.included ? 'text-success' : 'text-gray-300'}>
                                                {feature.included ? '✓' : '✕'}
                                            </span>
                                            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${plan.buttonStyle}`}>
                                    Editar Plan
                                </button>

                                <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                                    <span>{plan.subscribers} suscriptores</span>
                                    <span className="font-semibold text-gray-900">${plan.revenue.toLocaleString()}/mes</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Distribution */}
                    <div className="card">
                        <h3 className="font-display text-lg font-semibold mb-6">Distribución de Suscriptores</h3>
                        <div className="space-y-4">
                            {plans.map((plan) => {
                                const percentage = Math.round((plan.subscribers / totalSubscribers) * 100)
                                return (
                                    <div key={plan.id}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">{plan.name}</span>
                                            <span className="text-sm text-gray-500">{plan.subscribers} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    plan.name === 'Básico' ? 'bg-gray-400' :
                                                    plan.name === 'Profesional' ? 'bg-primary' : 'bg-purple'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </main>

import AdminPlansEditor from '@/components/AdminPlansEditor'

export default function AdminPlansPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Planes
                </h1>
                {/* Aquí podríamos agregar un botón para "Crear Plan" en el futuro */}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Estos son los planes actualmente visibles para los usuarios.
                </p>

                {/* Reutilizamos el componente PlansSection por ahora para visualizar */}
                <AdminPlansEditor />
            </div>

        </div>
    )
}
