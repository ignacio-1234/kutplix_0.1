import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

// GET /api/projects/[id] — Get single project with full details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = params

        // Use projects_full view for enriched data
        let query = supabase.from('projects_full').select('*').eq('id', id)

        // Non-admin users: verify access
        if (session.role === 'client') {
            const { data: company } = await supabase
                .from('companies')
                .select('id')
                .eq('user_id', session.userId)
                .single()
            if (company) {
                query = query.eq('company_id', company.id)
            }
        } else if (session.role === 'designer') {
            const { data: designer } = await supabase
                .from('designers')
                .select('id')
                .eq('user_id', session.userId)
                .single()
            if (designer) {
                query = query.eq('designer_id', designer.id)
            }
        }

        const { data: project, error } = await query.single()

        if (error || !project) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
        }

        // Get deliveries for this project
        const { data: deliveries } = await supabase
            .from('deliveries')
            .select('*')
            .eq('project_id', id)
            .order('version', { ascending: false })

        // Get resources for this project
        const { data: resources } = await supabase
            .from('resources')
            .select('*')
            .eq('project_id', id)
            .order('uploaded_at', { ascending: false })

        return NextResponse.json({
            project,
            deliveries: deliveries || [],
            resources: resources || [],
        })
    } catch (error) {
        console.error('Project GET error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// PUT /api/projects/[id] — Update project
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = params
        const body = await request.json()

        // Verify project exists
        const { data: existing, error: checkError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single()

        if (checkError || !existing) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
        }

        // Verify access for non-admin
        if (session.role === 'client') {
            const { data: company } = await supabase
                .from('companies')
                .select('id')
                .eq('user_id', session.userId)
                .single()
            if (!company || existing.company_id !== company.id) {
                return NextResponse.json({ error: 'Sin acceso' }, { status: 403 })
            }
        }

        const updateData: Record<string, unknown> = {}

        // Handle specific actions
        if (body.action === 'approve') {
            updateData.status = 'approved'
            updateData.completed_at = new Date().toISOString()
        } else if (body.action === 'request_changes') {
            // Check revision limit from subscription plan
            const { data: sub } = await supabase
                .from('subscriptions')
                .select('*, plans(*)')
                .eq('company_id', existing.company_id)
                .eq('status', 'active')
                .single()

            const maxRevisions = (sub?.plans as any)?.max_revisions || 1
            if (existing.revision_count >= maxRevisions) {
                return NextResponse.json(
                    { error: 'Has alcanzado el máximo de revisiones para tu plan' },
                    { status: 400 }
                )
            }
            updateData.status = 'changes_requested'
            updateData.revision_count = existing.revision_count + 1
        } else if (body.action === 'cancel') {
            updateData.status = 'cancelled'
        } else {
            // General update (admin/designer)
            const allowedFields = ['title', 'description', 'status', 'priority', 'deadline', 'designer_id']
            for (const field of allowedFields) {
                if (body[field] !== undefined) {
                    updateData[field] = body[field]
                }
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 })
        }

        const { data: project, error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating project:', error)
            return NextResponse.json({ error: 'Error al actualizar el proyecto' }, { status: 500 })
        }

        return NextResponse.json({ project })
    } catch (error) {
        console.error('Project PUT error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
