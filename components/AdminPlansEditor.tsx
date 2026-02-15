'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plan } from '@/types/database'

export default function AdminPlansEditor() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        fetchPlans()
    }, [])

    async function fetchPlans() {
        try {
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .order('price', { ascending: true })

            if (error) throw error
            setPlans(data || [])
        } catch (error) {
            console.error('Error fetching plans:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (id: string, field: keyof Plan, value: any) => {
        setPlans(plans.map(plan =>
            plan.id === id ? { ...plan, [field]: value } : plan
        ))
    }

    const handleFeatureChange = (id: string, key: string, value: string) => {
        setPlans(plans.map(plan => {
            if (plan.id !== id) return plan

            const newFeatures = { ...plan.features, [key]: value }
            return { ...plan, features: newFeatures }
        }))
    }

    const savePlan = async (plan: Plan) => {
        setSaving(plan.id)
        setMessage(null)

        try {
            const response = await fetch('/api/plans', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(plan),
            })

            if (!response.ok) throw new Error('Error updating plan')

            setMessage({ text: 'Plan actualizado correctamente', type: 'success' })

            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            console.error('Error saving plan:', error)
            setMessage({ text: 'Error al actualizar el plan', type: 'error' })
        } finally {
            setSaving(null)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col"
                    >
                        <div className="p-6 flex-grow space-y-4">
                            {/* Header Edit */}
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={plan.name}
                                    onChange={(e) => handleChange(plan.id, 'name', e.target.value)}
                                    className="w-full text-xl font-bold text-neutral-dark bg-neutral-light border border-transparent focus:border-primary rounded px-2 py-1"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Descripción</label>
                                <textarea
                                    value={plan.description}
                                    onChange={(e) => handleChange(plan.id, 'description', e.target.value)}
                                    className="w-full text-sm text-gray-500 bg-neutral-light border border-transparent focus:border-primary rounded px-2 py-1 h-20 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Precio</label>
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold text-gray-400 mr-1">$</span>
                                    <input
                                        type="number"
                                        value={plan.price}
                                        onChange={(e) => handleChange(plan.id, 'price', Number(e.target.value))}
                                        className="w-24 text-3xl font-extrabold text-primary bg-neutral-light border border-transparent focus:border-primary rounded px-2 py-1"
                                    />
                                    <span className="text-gray-500 ml-2">/mes</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Proyectos Mensuales</label>
                                    <input
                                        type="number"
                                        value={plan.monthly_projects}
                                        onChange={(e) => handleChange(plan.id, 'monthly_projects', Number(e.target.value))}
                                        className="w-full bg-neutral-light border border-gray-200 rounded px-2 py-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">Revisiones</label>
                                    <input
                                        type="number"
                                        value={plan.max_revisions}
                                        onChange={(e) => handleChange(plan.id, 'max_revisions', Number(e.target.value))}
                                        className="w-full bg-neutral-light border border-gray-200 rounded px-2 py-1"
                                    />
                                </div>
                            </div>

                            {/* Features Edit */}
                            <div className="border-t border-gray-200 pt-4">
                                <label className="block text-xs text-gray-500 uppercase font-semibold mb-2">Características Adicionales</label>
                                {plan.features && typeof plan.features === 'object' && Object.entries(plan.features).map(([key, value]) => (
                                    <div key={key} className="flex flex-col mb-2">
                                        <span className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                        <input
                                            type="text"
                                            value={String(value)}
                                            onChange={(e) => handleFeatureChange(plan.id, key, e.target.value)}
                                            className="w-full bg-neutral-light border border-gray-200 rounded px-2 py-1 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-neutral-light mt-auto">
                            <button
                                onClick={() => savePlan(plan)}
                                disabled={saving === plan.id}
                                className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${saving === plan.id
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-primary hover:bg-primary-dark text-white'
                                    }`}
                            >
                                {saving === plan.id ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
