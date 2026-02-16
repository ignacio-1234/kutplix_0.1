import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// GET /api/grids — List grids (filtered by role)
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const companyId = searchParams.get('company_id')
        const month = searchParams.get('month')
        const year = searchParams.get('year')
        const status = searchParams.get('status')

        let query = supabase
            .from('grids')
            .select(`
                *,
                companies (name),
                grid_items (*)
            `)
            .order('year', { ascending: false })
            .order('month', { ascending: false })

        // Role-based filtering
        if (session.role === 'client') {
            const { data: company } = await supabase
                .from('companies')
                .select('id')
                .eq('user_id', session.userId)
                .single()

            if (!company) {
                return NextResponse.json({ grids: [] })
            }
            // Clients only see grids that have been sent or beyond
            query = query
                .eq('company_id', company.id)
                .neq('status', 'draft')
        }

        if (companyId) query = query.eq('company_id', companyId)
        if (month) query = query.eq('month', parseInt(month))
        if (year) query = query.eq('year', parseInt(year))
        if (status) query = query.eq('status', status)

        const { data: grids, error } = await query

        if (error) {
            console.error('Error fetching grids:', error)
            return NextResponse.json({ error: 'Error al obtener grillas' }, { status: 500 })
        }

        // Flatten company name
        const flatGrids = (grids || []).map((g: any) => ({
            ...g,
            company_name: g.companies?.name,
            items: g.grid_items || [],
            companies: undefined,
            grid_items: undefined,
        }))

        return NextResponse.json({ grids: flatGrids })
    } catch (error) {
        console.error('Grids GET error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// POST /api/grids — Create a new grid (admin/designer only)
export async function POST(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session || session.role === 'client') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { company_id, month, year } = body

        if (!company_id || !month || !year) {
            return NextResponse.json({ error: 'Faltan datos requeridos: company_id, month, year' }, { status: 400 })
        }

        if (month < 1 || month > 12) {
            return NextResponse.json({ error: 'Mes inválido' }, { status: 400 })
        }

        // Check for existing grid
        const { data: existing } = await supabase
            .from('grids')
            .select('id')
            .eq('company_id', company_id)
            .eq('month', month)
            .eq('year', year)
            .maybeSingle()

        if (existing) {
            return NextResponse.json({ error: 'Ya existe una grilla para este mes y empresa' }, { status: 409 })
        }

        const { data: grid, error } = await supabase
            .from('grids')
            .insert({
                company_id,
                month,
                year,
                status: 'draft',
                created_by: session.userId,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating grid:', error)
            return NextResponse.json({ error: 'Error al crear la grilla' }, { status: 500 })
        }

        return NextResponse.json({ grid }, { status: 201 })
    } catch (error) {
        console.error('Grids POST error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
