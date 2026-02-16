import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// Helper: Get designer profile for user
async function getDesignerForUser(userId: string) {
    const { data } = await supabase
        .from('designers')
        .select(`
            id,
            rating,
            avg_completion_time
        `)
        .eq('user_id', userId)
        .single()
    return data
}

export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Verify user is a designer
        const designer = await getDesignerForUser(session.userId)
        if (!designer) {
            return NextResponse.json({ error: 'Perfil de diseñador no encontrado' }, { status: 403 })
        }

        // Fetch all projects for this designer
        const { data: projects, error } = await supabase
            .from('projects')
            .select(`
                id,
                status,
                deadline,
                completed_at,
                priority,
                created_at
            `)
            .eq('designer_id', designer.id)

        if (error) {
            console.error('Error fetching metrics projects:', error)
            return NextResponse.json({ error: 'Error al cargar métricas' }, { status: 500 })
        }

        const allProjects = projects || []
        const totalProjects = allProjects.length

        // 1. Project Status Counts
        const completedProjects = allProjects.filter(p => p.status === 'approved').length
        const activeProjects = allProjects.filter(p => !['approved', 'cancelled'].includes(p.status)).length
        const cancelledProjects = allProjects.filter(p => p.status === 'cancelled').length

        // 2. On-Time Delivery Rate
        // Only consider approved projects that have a completed_at date
        const approvedWithDates = allProjects.filter(p => p.status === 'approved' && p.completed_at && p.deadline)
        let onTimeCount = 0

        approvedWithDates.forEach(p => {
            const finished = new Date(p.completed_at!).getTime()
            const deadline = new Date(p.deadline).getTime()
            // Allow a small buffer (e.g. same day) or strict check? Strict check for now.
            if (finished <= deadline) {
                onTimeCount++
            }
        })

        const onTimeRate = approvedWithDates.length > 0
            ? Math.round((onTimeCount / approvedWithDates.length) * 100)
            : 100 // Default to 100% if no history

        // 3. Revenue (Mock logic: calculate based on priority for now, or just return 0 if no pricing model)
        // Let's assume a base rate per project type/priority for estimation
        // This is purely visual for the dashboard
        const estimatedRevenue = completedProjects * 150 // $150 avg per project

        return NextResponse.json({
            metrics: {
                totalProjects,
                completedProjects,
                activeProjects,
                cancelledProjects,
                onTimeRate,
                rating: designer.rating || 5.0,
                estimatedRevenue,
                avgCompletionTime: designer.avg_completion_time || 2.5 // days
            },
            // Return raw recent activity for a chart if needed
            activity: allProjects
                .filter(p => p.completed_at)
                .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
                .slice(0, 10)
        })

    } catch (error) {
        console.error('Designer metrics error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
