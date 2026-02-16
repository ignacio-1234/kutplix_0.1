'use client'

import Sidebar from '@/components/Sidebar'
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
