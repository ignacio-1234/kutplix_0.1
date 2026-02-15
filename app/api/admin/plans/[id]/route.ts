import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'
import { z } from 'zod'

async function verifyAdmin() {
    const session = await verifySession()
    if (!session || session.role !== 'admin') {
        return null
    }
    return session
}

// PUT - Actualizar plan
const updatePlanSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    price: z.number().min(0).optional(),
    monthly_projects: z.number().int().min(1).nullable().optional(),
    max_revisions: z.number().int().min(1).optional(),
    features: z.record(z.string()).optional(),
    is_active: z.boolean().optional(),
})

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifyAdmin()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const planId = params.id
        const body = await request.json()

        const validation = updatePlanSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        // Verificar que el plan existe
        const { data: existingPlan, error: fetchError } = await supabase
            .from('plans')
            .select('id')
            .eq('id', planId)
            .single()

        if (fetchError || !existingPlan) {
            return NextResponse.json(
                { error: 'Plan no encontrado' },
                { status: 404 }
            )
        }

        // Si se cambia el nombre, verificar que no exista otro con ese nombre
        if (validation.data.name) {
            const { data: namePlan } = await supabase
                .from('plans')
                .select('id')
                .ilike('name', validation.data.name)
                .neq('id', planId)
                .single()

            if (namePlan) {
                return NextResponse.json(
                    { error: 'Ya existe otro plan con este nombre' },
                    { status: 409 }
                )
            }
        }

        const { data: plan, error } = await supabase
            .from('plans')
            .update(validation.data)
            .eq('id', planId)
            .select()
            .single()

        if (error) {
            console.error('Error updating plan:', error)
            return NextResponse.json(
                { error: 'Error al actualizar el plan' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, plan })
    } catch (error) {
        console.error('Update plan error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}

// DELETE - Desactivar plan
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifyAdmin()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const planId = params.id

        // Verificar que el plan existe
        const { data: existingPlan, error: fetchError } = await supabase
            .from('plans')
            .select('id, name')
            .eq('id', planId)
            .single()

        if (fetchError || !existingPlan) {
            return NextResponse.json(
                { error: 'Plan no encontrado' },
                { status: 404 }
            )
        }

        // Verificar si hay suscripciones activas usando este plan
        const { count } = await supabase
            .from('subscriptions')
            .select('id', { count: 'exact', head: true })
            .eq('plan_id', planId)
            .eq('status', 'active')

        if (count && count > 0) {
            const { error } = await supabase
                .from('plans')
                .update({ is_active: false })
                .eq('id', planId)

            if (error) {
                return NextResponse.json(
                    { error: 'Error al desactivar el plan' },
                    { status: 500 }
                )
            }

            return NextResponse.json({
                success: true,
                message: `Plan desactivado. Hay ${count} suscripciones activas que mantienen este plan.`,
            })
        }

        const { error } = await supabase
            .from('plans')
            .update({ is_active: false })
            .eq('id', planId)

        if (error) {
            return NextResponse.json(
                { error: 'Error al eliminar el plan' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Plan desactivado correctamente',
        })
    } catch (error) {
        console.error('Delete plan error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}
