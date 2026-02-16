import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Verificar que el usuario es admin
async function verifyAdmin() {
    const session = await verifySession()
    if (!session || session.role !== 'admin') {
        return null
    }
    return session
}

// GET - Listar usuarios con paginación, búsqueda y filtros
export async function GET(request: NextRequest) {
    try {
        const session = await verifyAdmin()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const role = searchParams.get('role') || ''
        const status = searchParams.get('status') || ''
        const sortBy = searchParams.get('sortBy') || 'created_at'
        const sortOrder = searchParams.get('sortOrder') || 'desc'

        const offset = (page - 1) * limit

        // Construir query
        let query = supabase
            .from('users')
            .select('id, email, first_name, last_name, role, avatar_url, is_active, created_at, updated_at', { count: 'exact' })

        // Filtro de búsqueda
        if (search) {
            query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
        }

        // Filtro de rol
        if (role && role !== 'all') {
            query = query.eq('role', role)
        }

        // Filtro de estado
        if (status === 'active') {
            query = query.eq('is_active', true)
        } else if (status === 'inactive') {
            query = query.eq('is_active', false)
        }

        // Ordenamiento
        const ascending = sortOrder === 'asc'
        query = query.order(sortBy, { ascending })

        // Paginación
        query = query.range(offset, offset + limit - 1)

        const { data: users, error, count } = await query

        if (error) {
            console.error('Error fetching users:', error)
            return NextResponse.json(
                { error: 'Error al obtener usuarios' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            users: users || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        })
    } catch (error) {
        console.error('Users list error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}

// POST - Crear nuevo usuario
const createUserSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    role: z.enum(['admin', 'client', 'designer'], {
        errorMap: () => ({ message: 'Rol inválido' }),
    }),
    isActive: z.boolean().optional().default(true),
    companyName: z.string().optional(),
    specialties: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
    try {
        const session = await verifyAdmin()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const body = await request.json()

        const validation = createUserSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email, password, firstName, lastName, role, isActive, companyName, specialties } = validation.data

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

        // Crear usuario
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                email: email.toLowerCase(),
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                role,
                is_active: isActive,
            })
            .select('id, email, first_name, last_name, role, avatar_url, is_active, created_at, updated_at')
            .single()

        if (userError || !user) {
            console.error('Error creating user:', userError)
            return NextResponse.json(
                { error: 'Error al crear el usuario' },
                { status: 500 }
            )
        }

        // Si es cliente y tiene nombre de empresa, crear la empresa
        if (role === 'client' && companyName) {
            await supabase
                .from('companies')
                .insert({
                    user_id: user.id,
                    name: companyName,
                })
        }

        // Si es diseñador, crear perfil de diseñador
        if (role === 'designer') {
            await supabase
                .from('designers')
                .insert({
                    user_id: user.id,
                    specialties: specialties || [],
                    max_concurrent_projects: 5,
                    rating: 0,
                })
        }

        return NextResponse.json({
            success: true,
            user,
        }, { status: 201 })
    } catch (error) {
        console.error('Create user error:', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}
