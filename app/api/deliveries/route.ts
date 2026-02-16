import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'
import { createNotification, createReminder } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

// POST /api/deliveries - Create a new delivery
export async function POST(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { project_id, content_url, notes, version } = body

        if (!project_id || !content_url || !version) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            )
        }

        // Verify designer has access to this project
        const { data: project } = await supabase
            .from('projects')
            .select('designer_id')
            .eq('id', project_id)
            .single()

        if (!project) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
        }

        // Check if user is the assigned designer
        if (session.role === 'designer') {
            const { data: designer } = await supabase
                .from('designers')
                .select('id')
                .eq('user_id', session.userId)
                .single()

            if (!designer || designer.id !== project.designer_id) {
                return NextResponse.json({ error: 'No tienes permiso para este proyecto' }, { status: 403 })
            }
        } else if (session.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const { data: delivery, error } = await supabase
            .from('deliveries')
            .insert({
                project_id,
                designer_id: project.designer_id, // Ensure it links to the designer
                content_url,
                notes,
                version,
                status: 'pending_review'
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating delivery:', error)
            return NextResponse.json({ error: 'Error al crear la entrega' }, { status: 500 })
        }

        // Update project status to 'in_review' automatically
        await supabase
            .from('projects')
            .update({ status: 'in_review' })
            .eq('id', project_id)

        // Auto-notify: Find the client who owns this project and notify them
        const { data: projectFull } = await supabase
            .from('projects')
            .select('title, company_id, companies(user_id)')
            .eq('id', project_id)
            .single()

        if (projectFull?.companies) {
            const clientUserId = (projectFull.companies as any).user_id
            if (clientUserId) {
                await createNotification({
                    userId: clientUserId,
                    title: `Nueva entrega: "${projectFull.title}"`,
                    message: `Se ha entregado la versión ${version} de tu proyecto "${projectFull.title}". Revisa y aprueba para continuar.`,
                    type: 'info',
                })

                // Start a reminder timer for this project
                await createReminder(clientUserId, 'project', project_id)
            }
        }

        return NextResponse.json({ delivery }, { status: 201 })
    } catch (error) {
        console.error('Deliveries POST error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
