import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// GET /api/admin/designers
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Fetch all designers with their user details
        const { data: designers, error } = await supabase
            .from('designers')
            .select(`
                *,
                user:users!user_id (
                    first_name,
                    last_name,
                    email,
                    avatar_url,
                    is_active
                )
            `)

        if (error) {
            console.error('Error fetching designers:', error)
            return NextResponse.json({ error: 'Error al cargar diseñadores' }, { status: 500 })
        }

        // Fetch project stats for each designer
        const designersWithStats = await Promise.all(designers.map(async (designer) => {
            const { count: totalProjects } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('designer_id', designer.id)

            const { count: completedProjects } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('designer_id', designer.id)
                .eq('status', 'approved')

            const { count: activeProjects } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('designer_id', designer.id)
                .in('status', ['pending', 'in_progress', 'in_review', 'changes_requested'])

            return {
                ...designer,
                stats: {
                    totalProjects: totalProjects || 0,
                    completedProjects: completedProjects || 0,
                    activeProjects: activeProjects || 0
                }
            }
        }))

        return NextResponse.json({ designers: designersWithStats })

    } catch (error) {
        console.error('Admin designers error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
