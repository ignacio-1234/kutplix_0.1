import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/session'

export async function POST() {
    try {
        await deleteSession()

        return NextResponse.json({
            success: true,
            message: 'Sesión cerrada correctamente',
        })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Error al cerrar sesión' },
            { status: 500 }
        )
    }
}
