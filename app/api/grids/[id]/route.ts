import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'
import { createNotification, createReminder, resolveReminder } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

// GET /api/grids/[id] — Get single grid with items and comments
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

        const { data: grid, error } = await supabase
            .from('grids')
            .select(`
                *,
                companies (name, user_id),
                grid_items (*),
                grid_comments (
                    *,
                    users (first_name, last_name, role)
                )
            `)
            .eq('id', id)
            .single()

        if (error || !grid) {
            return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
        }

        // Access control
        if (session.role === 'client') {
            const { data: company } = await supabase
                .from('companies')
                .select('id')
                .eq('user_id', session.userId)
                .single()

            if (!company || grid.company_id !== company.id) {
                return NextResponse.json({ error: 'Sin acceso' }, { status: 403 })
            }
        }

        // Flatten
        const result = {
            ...grid,
            company_name: (grid as any).companies?.name,
            items: ((grid as any).grid_items || []).sort((a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
            comments: ((grid as any).grid_comments || []).map((c: any) => ({
                id: c.id,
                grid_id: c.grid_id,
                user_id: c.user_id,
                message: c.message,
                created_at: c.created_at,
                user_name: c.users ? `${c.users.first_name} ${c.users.last_name}` : 'Usuario',
                user_role: c.users?.role || 'unknown',
            })),
            companies: undefined,
            grid_items: undefined,
            grid_comments: undefined,
        }

        return NextResponse.json({ grid: result })
    } catch (error) {
        console.error('Grid GET error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// PUT /api/grids/[id] — Update grid status (send, approve, request_changes)
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

        // Get existing grid
        const { data: existing, error: checkError } = await supabase
            .from('grids')
            .select('*, companies(user_id, name)')
            .eq('id', id)
            .single()

        if (checkError || !existing) {
            return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
        }

        const updateData: Record<string, unknown> = {}
        const now = new Date().toISOString()
        const clientUserId = (existing as any).companies?.user_id
        const companyName = (existing as any).companies?.name || 'empresa'
        const gridLabel = `Grilla ${existing.month}/${existing.year} - ${companyName}`

        if (body.action === 'send') {
            // Admin/designer sends grid to client
            if (session.role === 'client') {
                return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
            }
            if (existing.status !== 'draft' && existing.status !== 'changes_requested') {
                return NextResponse.json({ error: 'Solo se pueden enviar grillas en borrador o con cambios solicitados' }, { status: 400 })
            }
            updateData.status = 'sent'
            updateData.sent_at = now

            // Notify client
            if (clientUserId) {
                await createNotification({
                    userId: clientUserId,
                    title: `Nueva grilla para aprobar: ${gridLabel}`,
                    message: `Se ha enviado la grilla de contenido de ${existing.month}/${existing.year} para tu aprobación. Revisa los temas y confirma.`,
                    type: 'info',
                })
                await createReminder(clientUserId, 'grid', id)
            }
        } else if (body.action === 'approve') {
            // Client approves
            if (session.role !== 'client' && session.role !== 'admin') {
                return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
            }
            if (existing.status !== 'sent') {
                return NextResponse.json({ error: 'Solo se pueden aprobar grillas enviadas' }, { status: 400 })
            }
            updateData.status = 'approved'
            updateData.approved_at = now

            // Resolve reminders
            await resolveReminder('grid', id)

            // Notify admins and creator
            const { data: admins } = await supabase
                .from('users')
                .select('id')
                .eq('role', 'admin')
                .eq('is_active', true)

            if (admins) {
                for (const admin of admins) {
                    await createNotification({
                        userId: admin.id,
                        title: `Grilla aprobada: ${gridLabel}`,
                        message: `El cliente ha aprobado la grilla de ${existing.month}/${existing.year}.`,
                        type: 'success',
                    })
                }
            }
        } else if (body.action === 'request_changes') {
            // Client requests changes
            if (session.role !== 'client' && session.role !== 'admin') {
                return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
            }
            if (existing.status !== 'sent') {
                return NextResponse.json({ error: 'Solo se pueden solicitar cambios en grillas enviadas' }, { status: 400 })
            }
            updateData.status = 'changes_requested'

            // Resolve reminders
            await resolveReminder('grid', id)

            // Notify admins
            const { data: admins } = await supabase
                .from('users')
                .select('id')
                .eq('role', 'admin')
                .eq('is_active', true)

            if (admins) {
                for (const admin of admins) {
                    await createNotification({
                        userId: admin.id,
                        title: `Cambios solicitados en grilla: ${gridLabel}`,
                        message: `El cliente ha solicitado cambios en la grilla de ${existing.month}/${existing.year}.${body.comments ? ` Comentario: ${body.comments}` : ''}`,
                        type: 'warning',
                    })
                }
            }
        } else {
            return NextResponse.json({ error: 'Acción no válida. Usa: send, approve, request_changes' }, { status: 400 })
        }

        updateData.updated_at = now

        const { data: grid, error } = await supabase
            .from('grids')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating grid:', error)
            return NextResponse.json({ error: 'Error al actualizar la grilla' }, { status: 500 })
        }

        return NextResponse.json({ grid })
    } catch (error) {
        console.error('Grid PUT error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// DELETE /api/grids/[id] — Delete a draft grid (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifySession()
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = params

        const { data: existing } = await supabase
            .from('grids')
            .select('status')
            .eq('id', id)
            .single()

        if (!existing) {
            return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
        }

        if (existing.status !== 'draft') {
            return NextResponse.json({ error: 'Solo se pueden eliminar grillas en borrador' }, { status: 400 })
        }

        const { error } = await supabase
            .from('grids')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting grid:', error)
            return NextResponse.json({ error: 'Error al eliminar la grilla' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Grid DELETE error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
