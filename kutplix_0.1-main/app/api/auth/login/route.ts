import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar datos
        const validation = loginSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email, password } = validation.data

        // Buscar usuario
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single()

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Verificar si el usuario está activo
        if (!user.is_active) {
            return NextResponse.json(
                { error: 'Usuario inactivo. Contacta al administrador.' },
                { status: 403 }
            )
        }

        // Crear sesión
        await createSession({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Obtener información adicional según el rol
        let additionalData = null

        if (user.role === 'client') {
            const { data: company } = await supabase
                .from('companies')
                .select('*')
                .eq('user_id', user.id)
                .single()

            additionalData = { company }
        } else if (user.role === 'designer') {
            const { data: designer } = await supabase
                .from('designers')
                .select('*')
                .eq('user_id', user.id)
                .single()

            additionalData = { designer }
        }

        // Retornar usuario (sin password_hash)
        const { password_hash, ...userWithoutPassword } = user

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
            ...additionalData,
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}
