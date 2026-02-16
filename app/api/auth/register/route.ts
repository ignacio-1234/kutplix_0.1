import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    companyName: z.string().min(2, 'El nombre de la empresa debe tener al menos 2 caracteres').optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar datos
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email, password, firstName, lastName, companyName } = validation.data

        // Verificar si el email ya existe
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single()

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email ya está registrado' },
                { status: 409 }
            )
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 10)

        // Crear usuario (por defecto es cliente)
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                email: email.toLowerCase(),
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                role: 'client',
                is_active: true,
            })
            .select()
            .single()

        if (userError || !user) {
            console.error('Error creating user:', userError)
            return NextResponse.json(
                { error: 'Error al crear el usuario' },
                { status: 500 }
            )
        }

        // Si es un cliente, crear la empresa
        let company = null
        if (companyName) {
            const { data: newCompany, error: companyError } = await supabase
                .from('companies')
                .insert({
                    user_id: user.id,
                    name: companyName,
                })
                .select()
                .single()

            if (companyError) {
                console.error('Error creating company:', companyError)
            } else {
                company = newCompany

                // Asignar plan básico por defecto
                const { data: basicPlan } = await supabase
                    .from('plans')
                    .select('id')
                    .eq('name', 'Básico')
                    .single()

                if (basicPlan) {
                    const startDate = new Date()
                    const endDate = new Date()
                    endDate.setMonth(endDate.getMonth() + 1)

                    await supabase
                        .from('subscriptions')
                        .insert({
                            company_id: newCompany.id,
                            plan_id: basicPlan.id,
                            status: 'active',
                            start_date: startDate.toISOString().split('T')[0],
                            end_date: endDate.toISOString().split('T')[0],
                            auto_renew: true,
                            projects_used: 0,
                        })
                }
            }
        }

        // Crear sesión
        await createSession({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Retornar usuario (sin password_hash)
        const { password_hash, ...userWithoutPassword } = user

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
            company,
        }, { status: 201 })
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}
