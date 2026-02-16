import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await verifySession()

        if (!session) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        // Obtener datos completos del usuario
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, first_name, last_name, role, avatar_url, is_active')
            .eq('id', session.userId)
            .single()

        if (error || !user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Obtener información adicional según el rol
        let additionalData = null

        if (user.role === 'client') {
            const { data: company } = await supabase
                .from('companies')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (company) {
                // Obtener suscripción activa
                const { data: subscription } = await supabase
                    .from('subscriptions')
                    .select(`
            *,
            plans (*)
          `)
                    .eq('company_id', company.id)
                    .eq('status', 'active')
                    .single()

                additionalData = { company, subscription }
            }
        } else if (user.role === 'designer') {
            const { data: designer } = await supabase
                .from('designers')
                .select('*')
                .eq('user_id', user.id)
                .single()

            additionalData = { designer }
        }

        return NextResponse.json({
            user,
            ...additionalData,
        })
    } catch (error) {
        console.error('Session error:', error)
        return NextResponse.json(
            { error: 'Error al obtener sesión' },
            { status: 500 }
        )
    }
}
