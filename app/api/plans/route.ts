import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/plans — List all active plans
export async function GET() {
    try {
        const { data: plans, error } = await supabase
            .from('plans')
            .select('*')
            .eq('is_active', true)
            .order('price', { ascending: true })

        if (error) {
            console.error('Error fetching plans:', error)
            return NextResponse.json({ error: 'Error al cargar planes' }, { status: 500 })
        }

        return NextResponse.json({ plans: plans || [] })
    } catch (error) {
        console.error('Plans GET error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'Missing plan ID' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('plans')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            throw error
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error updating plan:', error)
        return NextResponse.json({ error: 'Error updating plan' }, { status: 500 })
    }
}
