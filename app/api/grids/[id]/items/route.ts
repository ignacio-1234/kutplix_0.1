import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// POST /api/grids/[id]/items — Add item to grid
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifySession()
        if (!session || session.role === 'client') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: gridId } = params
        const body = await request.json()
        const { date, content_type, topic, description } = body

        if (!date || !content_type || !topic) {
            return NextResponse.json({ error: 'Faltan datos: date, content_type, topic' }, { status: 400 })
        }

        // Verify grid exists and is editable
        const { data: grid } = await supabase
            .from('grids')
            .select('status')
            .eq('id', gridId)
            .single()

        if (!grid) {
            return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
        }

        if (grid.status !== 'draft' && grid.status !== 'changes_requested') {
            return NextResponse.json({ error: 'Solo se pueden editar grillas en borrador o con cambios solicitados' }, { status: 400 })
        }

        const { data: item, error } = await supabase
            .from('grid_items')
            .insert({
                grid_id: gridId,
                date,
                content_type,
                topic,
                description: description || null,
                status: 'planned',
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating grid item:', error)
            return NextResponse.json({ error: 'Error al agregar item' }, { status: 500 })
        }

        return NextResponse.json({ item }, { status: 201 })
    } catch (error) {
        console.error('Grid items POST error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// PUT /api/grids/[id]/items — Update a grid item (pass item_id in body)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifySession()
        if (!session || session.role === 'client') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: gridId } = params
        const body = await request.json()
        const { item_id, date, content_type, topic, description, status } = body

        if (!item_id) {
            return NextResponse.json({ error: 'Se requiere item_id' }, { status: 400 })
        }

        // Verify grid is editable
        const { data: grid } = await supabase
            .from('grids')
            .select('status')
            .eq('id', gridId)
            .single()

        if (!grid) {
            return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
        }

        if (grid.status !== 'draft' && grid.status !== 'changes_requested') {
            return NextResponse.json({ error: 'Grilla no editable en este estado' }, { status: 400 })
        }

        const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
        if (date !== undefined) updateData.date = date
        if (content_type !== undefined) updateData.content_type = content_type
        if (topic !== undefined) updateData.topic = topic
        if (description !== undefined) updateData.description = description
        if (status !== undefined) updateData.status = status

        const { data: item, error } = await supabase
            .from('grid_items')
            .update(updateData)
            .eq('id', item_id)
            .eq('grid_id', gridId)
            .select()
            .single()

        if (error) {
            console.error('Error updating grid item:', error)
            return NextResponse.json({ error: 'Error al actualizar item' }, { status: 500 })
        }

        return NextResponse.json({ item })
    } catch (error) {
        console.error('Grid items PUT error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// DELETE /api/grids/[id]/items — Delete a grid item (pass item_id as query param)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifySession()
        if (!session || session.role === 'client') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: gridId } = params
        const { searchParams } = new URL(request.url)
        const itemId = searchParams.get('item_id')

        if (!itemId) {
            return NextResponse.json({ error: 'Se requiere item_id' }, { status: 400 })
        }

        const { error } = await supabase
            .from('grid_items')
            .delete()
            .eq('id', itemId)
            .eq('grid_id', gridId)

        if (error) {
            console.error('Error deleting grid item:', error)
            return NextResponse.json({ error: 'Error al eliminar item' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Grid items DELETE error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
