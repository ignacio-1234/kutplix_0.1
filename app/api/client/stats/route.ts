import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// GET /api/client/stats — Dashboard KPI stats for the logged-in client
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Get company for this client
        const { data: company } = await supabase
            .from('companies')
            .select('id, name')
            .eq('user_id', session.userId)
            .single()

        if (!company) {
            return NextResponse.json({
                stats: { activeProjects: 0, completedProjects: 0, inReviewProjects: 0, totalProjects: 0, thisMonthNew: 0, thisMonthCompleted: 0 },
                plan: null,
                company: null,
            })
        }

        // Get all projects for this company
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, status, created_at, completed_at')
            .eq('company_id', company.id)

        if (error) {
            console.error('Error fetching stats:', error)
            return NextResponse.json({ error: 'Error al cargar estadísticas' }, { status: 500 })
        }

        const allProjects = projects || []

        const activeStatuses = ['pending', 'in_progress', 'in_review', 'changes_requested']
        const completedStatuses = ['approved']

        const activeProjects = allProjects.filter(p => activeStatuses.includes(p.status))
        const completedProjects = allProjects.filter(p => completedStatuses.includes(p.status))
        const inReviewProjects = allProjects.filter(p => p.status === 'in_review')

        // Count projects created this month
        const now = new Date()
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const thisMonthProjects = allProjects.filter(
            p => new Date(p.created_at) >= firstOfMonth
        )
        const thisMonthCompleted = completedProjects.filter(
            p => p.completed_at && new Date(p.completed_at) >= firstOfMonth
        )

        // Get subscription + plan info
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*, plans(*)')
            .eq('company_id', company.id)
            .eq('status', 'active')
            .single()

        const plan = subscription?.plans as any

        return NextResponse.json({
            stats: {
                activeProjects: activeProjects.length,
                completedProjects: completedProjects.length,
                inReviewProjects: inReviewProjects.length,
                totalProjects: allProjects.length,
                thisMonthNew: thisMonthProjects.length,
                thisMonthCompleted: thisMonthCompleted.length,
            },
            plan: subscription ? {
                name: plan?.name || 'Sin plan',
                monthlyProjects: plan?.monthly_projects,
                maxRevisions: plan?.max_revisions || 0,
                projectsUsed: subscription.projects_used || 0,
                renewalDate: subscription.end_date,
            } : null,
            company: {
                id: company.id,
                name: company.name,
            },
        })
    } catch (error) {
        console.error('Client stats error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
