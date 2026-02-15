'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plan } from '@/types/database'

export default function PlansSection() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPlans() {
            try {
                const { data, error } = await supabase
                    .from('plans')
                    .select('*')
                    .eq('is_active', true)
                    .order('price', { ascending: true })

                if (error) {
                    console.error('Error fetching plans:', error)
                } else {
                    setPlans(data || [])
                }
            } catch (error) {
                console.error('Unexpected error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPlans()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <section className="py-20 bg-white" id="plans">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        Nuestros Planes
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Elige el plan que mejor se adapte a tus necesidades de diseño
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col relative"
                        >
                            {/* Etiqueta de Popular (opcional, lógica a añadir si se desea) */}
                            {/* <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div> */}

                            <div className="p-8 flex-grow">
                                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 h-12">
                                    {plan.description}
                                </p>
                                <div className="mb-8">
                                    <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                                        ${plan.price}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">/mes</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{plan.monthly_projects} Proyectos mensuales</span>
                                    </li>
                                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{plan.max_revisions} Revisiones por proyecto</span>
                                    </li>

                                    {/* Parse and display dynamic features from JSON */}
                                    {plan.features && typeof plan.features === 'object' && Object.entries(plan.features).map(([key, value]) => (
                                        <li key={key} className="flex items-center text-gray-700 dark:text-gray-300 capitalize">
                                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{key.replace(/_/g, ' ')}: {String(value)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 bg-gray-50 dark:bg-gray-700/30 mt-auto">
                                <a
                                    href="/register"
                                    className="block w-full text-center py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Comenzar Ahora
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
