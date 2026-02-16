import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'
import { createNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

// GET /api/grids/[id]/comments — List comments for a grid
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: gridId } = params

        const { data: comments, error } = await supabase
            .from('grid_comments')
            .select(`
                *,
                users (first_name, last_name, role)
            `)
            .eq('grid_id', gridId)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching comments:', error)
            return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 })
        }

        const flatComments = (comments || []).map((c: any) => ({
            id: c.id,
            grid_id: c.grid_id,
            user_id: c.user_id,
            message: c.message,
            created_at: c.created_at,
            user_name: c.users ? `${c.users.first_name} ${c.users.last_name}` : 'Usuario',
            user_role: c.users?.role || 'unknown',
        }))

        return NextResponse.json({ comments: flatComments })
    } catch (error) {
        console.error('Grid comments GET error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// POST /api/grids/[id]/comments — Add a comment to the grid chat
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: gridId } = params
        const body = await request.json()
        const { message } = body

        if (!message || message.trim().length === 0) {
            return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 })
        }

        // Verify grid exists
        const { data: grid } = await supabase
            .from('grids')
            .select('id, company_id, month, year, companies(user_id, name)')
            .eq('id', gridId)
            .single()

        if (!grid) {
            return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
        }

        // Access check for clients
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

        const { data: comment, error } = await supabase
            .from('grid_comments')
            .insert({
                grid_id: gridId,
                user_id: session.userId,
                message: message.trim(),
            })
            .select(`
                *,
                users (first_name, last_name, role)
            `)
            .single()

        if (error) {
            console.error('Error creating comment:', error)
            return NextResponse.json({ error: 'Error al crear comentario' }, { status: 500 })
        }

        const flatComment = {
            id: (comment as any).id,
            grid_id: (comment as any).grid_id,
            user_id: (comment as any).user_id,
            message: (comment as any).message,
            created_at: (comment as any).created_at,
            user_name: (comment as any).users ? `${(comment as any).users.first_name} ${(comment as any).users.last_name}` : 'Usuario',
            user_role: (comment as any).users?.role || 'unknown',
        }

        // Auto-notify: if client comments, notify admins. If admin/designer comments, notify client.
        const companyName = (grid as any).companies?.name || 'empresa'
        const gridLabel = `Grilla ${grid.month}/${grid.year} - ${companyName}`

        if (session.role === 'client') {
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
                        title: `Nuevo comentario del cliente: ${gridLabel}`,
                        message: `El cliente comentó en la grilla: "${message.trim().substring(0, 100)}"`,
                        type: 'info',
                    })
                }
            }
        } else {
            // Notify client
            const clientUserId = (grid as any).companies?.user_id
            if (clientUserId) {
                await createNotification({
                    userId: clientUserId,
                    title: `Nuevo comentario en tu grilla: ${gridLabel}`,
                    message: `El equipo comentó en la grilla: "${message.trim().substring(0, 100)}"`,
                    type: 'info',
                })
            }
        }

        return NextResponse.json({ comment: flatComment }, { status: 201 })
    } catch (error) {
        console.error('Grid comments POST error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
