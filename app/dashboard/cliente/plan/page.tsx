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

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

type Plan = {
    id: string
    name: string
    description: string
    monthly_projects: number
    max_revisions: number
    price: number
    features: string[]
    is_active: boolean
}

type ClientPlan = {
    name: string
    monthlyProjects: number
    maxRevisions: number
    projectsUsed: number
    renewalDate: string
} | null

export default function MiPlanPage() {
    const { user } = useAuth()
    const [currentPlan, setCurrentPlan] = useState<ClientPlan>(null)
    const [availablePlans, setAvailablePlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, plansRes] = await Promise.all([
                    fetch('/api/client/stats'),
                    fetch('/api/plans'),
                ])

                if (statsRes.ok) {
                    const data = await statsRes.json()
                    setCurrentPlan(data.plan)
                }

                if (plansRes.ok) {
                    const data = await plansRes.json()
                    setAvailablePlans(data.plans || data || [])
                }
            } catch (error) {
                console.error('Error loading plan data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'
    const usagePercent = currentPlan?.monthlyProjects
        ? Math.min(Math.round((currentPlan.projectsUsed / currentPlan.monthlyProjects) * 100), 100)
        : 0

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName={userName} userRole="Cliente" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Mi Plan</h2>
                            <p className="text-sm text-gray-600 mt-1">Gestiona tu suscripción y uso</p>
                        </div>

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

                    {/* Current Plan */}
                    <div className="bg-gradient-to-br from-primary to-blue-800 text-white rounded-2xl p-8 mb-10">
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="h-6 w-40 bg-white/20 rounded mb-4" />
                                <div className="h-4 w-60 bg-white/20 rounded" />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <div className="text-sm text-white/70 mb-1">Plan Actual</div>
                                        <h3 className="font-display text-3xl font-bold">
                                            {currentPlan?.name || 'Sin plan activo'}
                                        </h3>
                                    </div>
                                    <span className="px-4 py-2 bg-white/20 rounded-lg font-bold text-sm">
                                        ACTIVO
                                    </span>
                                </div>

                                {/* Usage Bars */}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="text-white/80">Proyectos mensuales</span>
                                            <span className="font-semibold">
                                                {currentPlan?.projectsUsed ?? 0} / {currentPlan?.monthlyProjects || '∞'}
                                            </span>
                                        </div>
                                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${usagePercent > 80 ? 'bg-orange-400' : 'bg-white'}`}
                                                style={{ width: `${usagePercent}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="text-white/80">Revisiones por proyecto</span>
                                            <span className="font-semibold">{currentPlan?.maxRevisions ?? 2}</span>
                                        </div>
                                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/20 text-sm">
                                    <span className="text-white/70">
                                        {currentPlan?.renewalDate
                                            ? `Próxima renovación: ${new Date(currentPlan.renewalDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                            : 'Contrata un plan para comenzar'
                                        }
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Available Plans */}
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-6">
                        Planes Disponibles
                    </h3>

                    <div className="grid grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                                    <div className="h-8 w-20 bg-gray-200 rounded mb-4" />
                                    <div className="space-y-2">
                                        {Array.from({ length: 4 }).map((_, j) => (
                                            <div key={j} className="h-3 bg-gray-100 rounded" />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : availablePlans.length === 0 ? (
                            <div className="col-span-3 card text-center py-12">
                                <div className="text-4xl mb-3">💎</div>
                                <p className="text-gray-500">No hay planes disponibles en este momento</p>
                            </div>
                        ) : (
                            availablePlans.map((plan) => {
                                const isCurrentPlan = currentPlan?.name === plan.name
                                return (
                                    <div
                                        key={plan.id}
                                        className={`card relative overflow-hidden transition-all hover:shadow-lg ${isCurrentPlan ? 'border-2 border-primary ring-4 ring-primary/10' : ''
                                            }`}
                                    >
                                        {isCurrentPlan && (
                                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                                ACTUAL
                                            </div>
                                        )}

                                        <h4 className="font-display text-lg font-semibold text-gray-900 mb-2">
                                            {plan.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

                                        <div className="mb-6">
                                            <span className="font-display text-3xl font-bold text-gray-900">
                                                ${plan.price?.toLocaleString()}
                                            </span>
                                            <span className="text-gray-500 text-sm">/mes</span>
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            <li className="flex items-center gap-2 text-sm">
                                                <span className="text-green-500">✓</span>
                                                <span>{plan.monthly_projects} proyectos mensuales</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <span className="text-green-500">✓</span>
                                                <span>{plan.max_revisions} revisiones por proyecto</span>
                                            </li>
                                            {Array.isArray(plan.features) && plan.features.map((feat: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2 text-sm">
                                                    <span className="text-green-500">✓</span>
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            className={`w-full py-3 rounded-lg font-semibold transition-all ${isCurrentPlan
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'btn-primary'
                                                }`}
                                            disabled={isCurrentPlan}
                                        >
                                            {isCurrentPlan ? 'Plan Actual' : 'Seleccionar Plan'}
                                        </button>
                                    </div>
                                )
                            })
                        )}

                    </div>
                </div>
            </main>
        </div>
    )
}
