import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

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
                type: type || 'info', // 'info', 'warning', 'success', 'error'
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
