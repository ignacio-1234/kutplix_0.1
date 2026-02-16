import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// GET /api/client/reports — Computed report data for the client dashboard
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Get company
        const { data: company } = await supabase
            .from('companies')
            .select('id, name')
            .eq('user_id', session.userId)
            .single()

        if (!company) {
            return NextResponse.json({
                summary: { total: 0, completed: 0, active: 0, cancelled: 0, avgRevisions: 0, onTimeRate: 0 },
                byStatus: {},
                byContentType: {},
                byPriority: {},
                monthlyActivity: [],
                planUsage: null,
            })
        }

        // Get all projects with full details
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, status, content_type, priority, deadline, created_at, completed_at, revision_count')
            .eq('company_id', company.id)

        if (error) {
            console.error('Error fetching report data:', error)
            return NextResponse.json({ error: 'Error al generar reportes' }, { status: 500 })
        }

        const allProjects = projects || []

        // --- Summary KPIs ---
        const completed = allProjects.filter(p => p.status === 'approved')
        const active = allProjects.filter(p => ['pending', 'in_progress', 'in_review', 'changes_requested'].includes(p.status))
        const cancelled = allProjects.filter(p => p.status === 'cancelled')

        const totalRevisions = allProjects.reduce((sum, p) => sum + (p.revision_count || 0), 0)
        const avgRevisions = allProjects.length > 0 ? Math.round((totalRevisions / allProjects.length) * 10) / 10 : 0

        // On-time rate: completed projects where completed_at <= deadline
        let onTimeCount = 0
        for (const p of completed) {
            if (p.completed_at && p.deadline) {
                if (new Date(p.completed_at) <= new Date(p.deadline)) {
                    onTimeCount++
                }
            }
        }
        const onTimeRate = completed.length > 0 ? Math.round((onTimeCount / completed.length) * 100) : 0

        // Average delivery time (days) for completed projects
        let totalDays = 0
        let countWithDays = 0
        for (const p of completed) {
            if (p.completed_at && p.created_at) {
                const days = Math.ceil((new Date(p.completed_at).getTime() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
                totalDays += days
                countWithDays++
            }
        }
        const avgDeliveryDays = countWithDays > 0 ? Math.round(totalDays / countWithDays) : 0

        // --- By Status ---
        const byStatus: Record<string, number> = {}
        for (const p of allProjects) {
            byStatus[p.status] = (byStatus[p.status] || 0) + 1
        }

        // --- By Content Type ---
        const byContentType: Record<string, number> = {}
        for (const p of allProjects) {
            byContentType[p.content_type] = (byContentType[p.content_type] || 0) + 1
        }

        // --- By Priority ---
        const byPriority: Record<string, number> = {}
        for (const p of allProjects) {
            byPriority[p.priority] = (byPriority[p.priority] || 0) + 1
        }

        // --- Monthly Activity (last 6 months) ---
        const now = new Date()
        const monthlyActivity: { month: string; label: string; created: number; completed: number }[] = []
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`

            const created = allProjects.filter(p => {
                const cd = new Date(p.created_at)
                return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth()
            }).length

            const completedInMonth = completed.filter(p => {
                if (!p.completed_at) return false
                const cd = new Date(p.completed_at)
                return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth()
            }).length

            monthlyActivity.push({ month: monthKey, label, created, completed: completedInMonth })
        }

        // --- Plan Usage ---
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*, plans(*)')
            .eq('company_id', company.id)
            .eq('status', 'active')
            .single()

        const plan = subscription?.plans as any
        const planUsage = subscription ? {
            name: plan?.name || 'Sin plan',
            monthlyLimit: plan?.monthly_projects || 0,
            used: subscription.projects_used || 0,
            maxRevisions: plan?.max_revisions || 0,
        } : null

        return NextResponse.json({
            summary: {
                total: allProjects.length,
                completed: completed.length,
                active: active.length,
                cancelled: cancelled.length,
                avgRevisions,
                onTimeRate,
                avgDeliveryDays,
            },
            byStatus,
            byContentType,
            byPriority,
            monthlyActivity,
            planUsage,
        })
    } catch (error) {
        console.error('Reports error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
