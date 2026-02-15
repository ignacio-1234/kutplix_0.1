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

// GET - Listar todos los planes
export async function GET() {
    try {
        const session = await verifyAdmin()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const { data: plans, error } = await supabase
            .from('plans')
            .select('*')
            .order('price', { ascending: true })

        if (error) {
            console.error('Error fetching plans:', error)
            return NextResponse.json(
                { error: 'Error al obtener planes' },
                { status: 500 }
            )
        }

        return NextResponse.json({ plans: plans || [] })
    } catch (error) {
        console.error('Plans list error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}

// POST - Crear nuevo plan
const createPlanSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
    price: z.number().min(0, 'El precio no puede ser negativo'),
    max_reels: z.number().int().min(-1),
    max_images: z.number().int().min(-1),
    max_stories: z.number().int().min(-1),
    max_carousels: z.number().int().min(-1),
    max_revisions: z.number().int().min(-1),
    includes_campaigns: z.boolean().default(false),
    is_active: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
    try {
        const session = await verifyAdmin()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const body = await request.json()

        const validation = createPlanSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        // Verificar si ya existe un plan con el mismo nombre
        const { data: existingPlan } = await supabase
            .from('plans')
            .select('id')
            .ilike('name', validation.data.name)
            .single()

        if (existingPlan) {
            return NextResponse.json(
                { error: 'Ya existe un plan con este nombre' },
                { status: 409 }
            )
        }

        const { data: plan, error } = await supabase
            .from('plans')
            .insert(validation.data)
            .select()
            .single()

        if (error) {
            console.error('Error creating plan:', error)
            return NextResponse.json(
                { error: 'Error al crear el plan' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, plan }, { status: 201 })
    } catch (error) {
        console.error('Create plan error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}
