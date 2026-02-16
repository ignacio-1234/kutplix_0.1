import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// GET /api/notifications — List notifications for the authenticated user
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const unreadOnly = searchParams.get('unread') === 'true'
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', session.userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (unreadOnly) {
            query = query.eq('is_read', false)
        }

        const { data: notifications, error } = await query

        if (error) {
            console.error('Error fetching notifications:', error)
            return NextResponse.json({ error: 'Error al obtener notificaciones' }, { status: 500 })
        }

        // Get unread count
        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.userId)
            .eq('is_read', false)

        return NextResponse.json({
            notifications: notifications || [],
            unreadCount: count || 0,
        })
    } catch (error) {
        console.error('Notifications GET error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// POST /api/notifications — Create notification (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { user_id, title, message, type } = body

        if (!user_id || !title || !message) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('notifications')
            .insert({
                user_id,
                title,
                message,
                type: type || 'info',
                is_read: false
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating notification:', error)
            return NextResponse.json({ error: 'Error al enviar notificación' }, { status: 500 })
        }

        return NextResponse.json({ notification: data }, { status: 201 })
    } catch (error) {
        console.error('Notifications POST error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// PATCH /api/notifications — Mark notifications as read
export async function PATCH(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { ids, markAll } = body as { ids?: string[]; markAll?: boolean }

        if (markAll) {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', session.userId)
                .eq('is_read', false)

            if (error) {
                return NextResponse.json({ error: 'Error al actualizar notificaciones' }, { status: 500 })
            }
        } else if (ids && ids.length > 0) {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .in('id', ids)
                .eq('user_id', session.userId)

            if (error) {
                return NextResponse.json({ error: 'Error al actualizar notificaciones' }, { status: 500 })
            }
        } else {
            return NextResponse.json({ error: 'Se requiere ids o markAll' }, { status: 400 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Notifications PATCH error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
