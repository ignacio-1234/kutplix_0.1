import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// GET /api/admin/companies
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { data: companies, error } = await supabase
            .from('companies')
            .select(`
                id,
                name,
                user_id,
                created_at,
                users!user_id (
                    email,
                    first_name,
                    last_name
                )
            `)
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching companies:', error)
            return NextResponse.json({ error: 'Error al cargar empresas' }, { status: 500 })
        }

        return NextResponse.json({ companies })

    } catch (error) {
        console.error('Admin companies error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
