import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Verificar que el usuario es admin
async function verifyAdmin() {
    const session = await verifySession()
    if (!session || session.role !== 'admin') {
        return null
    }
    return session
}

// PUT - Actualizar usuario
const updateUserSchema = z.object({
    email: z.string().email('Email inválido').optional(),
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
    role: z.enum(['admin', 'client', 'designer']).optional(),
    isActive: z.boolean().optional(),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
})

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifyAdmin()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const userId = params.id
        const body = await request.json()

        const validation = updateUserSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email, firstName, lastName, role, isActive, password } = validation.data

        // Verificar que el usuario existe
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', userId)
            .single()

        if (fetchError || !existingUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Si se cambia el email, verificar que no esté en uso
        if (email) {
            const { data: emailUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', email.toLowerCase())
                .neq('id', userId)
                .single()

            if (emailUser) {
                return NextResponse.json(
                    { error: 'Este email ya está en uso por otro usuario' },
                    { status: 409 }
                )
            }
        }

        // Construir objeto de actualización
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        }

        if (email) updateData.email = email.toLowerCase()
        if (firstName) updateData.first_name = firstName
        if (lastName) updateData.last_name = lastName
        if (role) updateData.role = role
        if (typeof isActive === 'boolean') updateData.is_active = isActive
        if (password) updateData.password_hash = await bcrypt.hash(password, 10)

        // Actualizar usuario
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select('id, email, first_name, last_name, role, avatar_url, is_active, created_at, updated_at')
            .single()

        if (updateError) {
            console.error('Error updating user:', updateError)
            return NextResponse.json(
                { error: 'Error al actualizar el usuario' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
        })
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar usuario (o desactivar)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await verifyAdmin()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const userId = params.id

        // No permitir que un admin se elimine a sí mismo
        if (session.userId === userId) {
            return NextResponse.json(
                { error: 'No puedes eliminar tu propia cuenta' },
                { status: 400 }
            )
        }

        // Verificar que el usuario existe
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single()

        if (fetchError || !existingUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Soft delete: desactivar usuario
        const { error: deleteError } = await supabase
            .from('users')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)

        if (deleteError) {
            console.error('Error deleting user:', deleteError)
            return NextResponse.json(
                { error: 'Error al eliminar el usuario' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Usuario desactivado correctamente',
        })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}
