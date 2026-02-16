'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function PlanCliente() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

    const currentPlan = {
        name: 'Profesional',
        price: 299,
        projectsUsed: 12,
        projectsTotal: 15,
        revisionsPerProject: 3,
        deliveryTime: '3 días',
        designerDedicated: true,
        priority: true,
        renewalDate: '1 de Marzo 2026',
        startDate: '1 de Febrero 2026',
        autoRenew: true,
    }

    const plans = [
        {
            id: 'basic',
            name: 'Básico',
            monthlyPrice: 99,
            annualPrice: 79,
            isCurrent: false,
            features: [
                '5 proyectos por mes',
                '1 revisión por proyecto',
                'Soporte por email',
                'Entrega en 5 días',
            ],
            buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            buttonText: 'Downgrade',
        },
        {
            id: 'professional',
            name: 'Profesional',
            monthlyPrice: 299,
            annualPrice: 249,
            isCurrent: true,
            features: [
                '15 proyectos por mes',
                '3 revisiones por proyecto',
                'Soporte prioritario',
                'Entrega en 3 días',
                'Diseñador dedicado',
                'Prioridad en cola',
            ],
            buttonStyle: 'bg-primary text-white',
            buttonText: 'Plan Actual',
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            monthlyPrice: 499,
            annualPrice: 399,
            isCurrent: false,
            features: [
                'Proyectos ilimitados',
                'Revisiones ilimitadas',
                'Soporte 24/7',
                'Entrega en 24 horas',
                'Equipo dedicado',
                'Máxima prioridad',
                'Reportes avanzados',
                'Reuniones de estrategia',
            ],
            buttonStyle: 'bg-gradient-to-r from-purple to-violet-700 text-white hover:shadow-lg',
            buttonText: 'Mejorar Plan',
        },
    ]

    const usageHistory = [
        { month: 'Febrero 2026', used: 12, total: 15 },
        { month: 'Enero 2026', used: 14, total: 15 },
        { month: 'Diciembre 2025', used: 11, total: 15 },
        { month: 'Noviembre 2025', used: 15, total: 15 },
        { month: 'Octubre 2025', used: 13, total: 15 },
    ]

    const billingHistory = [
        { date: '1 Feb 2026', amount: '$299.00', status: 'Pagado', method: 'Tarjeta ****4521' },
        { date: '1 Ene 2026', amount: '$299.00', status: 'Pagado', method: 'Tarjeta ****4521' },
        { date: '1 Dic 2025', amount: '$299.00', status: 'Pagado', method: 'Tarjeta ****4521' },
        { date: '1 Nov 2025', amount: '$299.00', status: 'Pagado', method: 'Tarjeta ****4521' },
    ]

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName="Juan Pérez" userRole="Clínica Dental" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-gray-900">Mi Plan</h2>
                        <p className="text-sm text-gray-600 mt-1">Gestiona tu suscripción y facturación</p>
                    </div>
                </header>

                <div className="p-10">
                    {/* Current Plan Banner */}
                    <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-8 mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-display text-2xl font-bold">Plan {currentPlan.name}</h3>
                                    <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold">ACTIVO</span>
                                </div>
                                <p className="text-white/80 text-sm">Renovación: {currentPlan.renewalDate}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-display text-4xl font-bold">${currentPlan.price}</div>
                                <div className="text-white/70 text-sm">/mes</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 mb-6">
                            <div className="bg-white/10 rounded-xl p-4">
                                <div className="text-white/70 text-xs mb-1">Proyectos</div>
                                <div className="font-display text-xl font-bold">{currentPlan.projectsUsed}/{currentPlan.projectsTotal}</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <div className="text-white/70 text-xs mb-1">Revisiones</div>
                                <div className="font-display text-xl font-bold">{currentPlan.revisionsPerProject}/proyecto</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <div className="text-white/70 text-xs mb-1">Entrega</div>
                                <div className="font-display text-xl font-bold">{currentPlan.deliveryTime}</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <div className="text-white/70 text-xs mb-1">Diseñador</div>
                                <div className="font-display text-xl font-bold">{currentPlan.designerDedicated ? 'Dedicado' : 'Compartido'}</div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2 text-sm">
                                <span>Proyectos utilizados este mes</span>
                                <span><strong>{currentPlan.projectsUsed}</strong> de {currentPlan.projectsTotal}</span>
                            </div>
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(currentPlan.projectsUsed / currentPlan.projectsTotal) * 100}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Plans Comparison */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-lg font-semibold">Planes Disponibles</h3>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setBillingPeriod('monthly')}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                                >
                                    Mensual
                                </button>
                                <button
                                    onClick={() => setBillingPeriod('annual')}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingPeriod === 'annual' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                                >
                                    Anual <span className="text-xs px-1.5 py-0.5 bg-success text-white rounded font-bold">-20%</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {plans.map((plan) => (
                                <div key={plan.id} className={`card hover:shadow-lg transition-all ${plan.isCurrent ? 'ring-2 ring-primary' : ''}`}>
                                    {plan.isCurrent && (
                                        <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wide">Tu plan actual</div>
                                    )}
                                    <h4 className="font-display text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="font-display text-3xl font-bold text-gray-900">
                                            ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                                        </span>
                                        <span className="text-gray-500 text-sm">/mes</span>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                <span className="text-success">✓</span> {feature}
                                            </div>
                                        ))}
                                    </div>
                                    <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.buttonStyle}`} disabled={plan.isCurrent}>
                                        {plan.buttonText}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Usage History */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Historial de Uso</h3>
                            <div className="space-y-3">
                                {usageHistory.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm font-medium text-gray-700">{item.month}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${item.used === item.total ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${(item.used / item.total) * 100}%` }} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.used}/{item.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Billing History */}
                        <div className="card">
                            <h3 className="font-display text-lg font-semibold mb-6">Historial de Pagos</h3>
                            <div className="space-y-3">
                                {billingHistory.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{item.amount}</div>
                                            <div className="text-xs text-gray-500">{item.date} · {item.method}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-green-50 text-success rounded text-xs font-semibold">{item.status}</span>
                                            <button className="text-xs text-primary font-medium hover:underline">📥 PDF</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
