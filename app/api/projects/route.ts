import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// Helper: Get company for client user
async function getCompanyForUser(userId: string) {
    const { data } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', userId)
        .single()
    return data
}

// Helper: Get designer profile for designer user
async function getDesignerForUser(userId: string) {
    const { data } = await supabase
        .from('designers')
        .select('id')
        .eq('user_id', userId)
        .single()
    return data
}

// GET /api/projects — List projects
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status') || 'all'
        const search = searchParams.get('search') || ''
        const sortBy = searchParams.get('sortBy') || 'created_at'
        const sortOrder = searchParams.get('sortOrder') || 'desc'

        const offset = (page - 1) * limit

        // Build query using joins
        let query = supabase
            .from('projects')
            .select(`
                *,
                companies (
                    name,
                    logo_url,
                    users (
                        email,
                        first_name,
                        last_name
                    )
                ),
                designers (
                    id,
                    rating,
                    users (
                        first_name,
                        last_name
                    )
                )
            `, { count: 'exact' })

        // Filter by user role
        if (session.role === 'client') {
            const company = await getCompanyForUser(session.userId)
            if (!company) {
                return NextResponse.json({ projects: [], pagination: { page, limit, total: 0, totalPages: 0 } })
            }
            query = query.eq('company_id', company.id)
        } else if (session.role === 'designer') {
            const designer = await getDesignerForUser(session.userId)
            if (!designer) {
                return NextResponse.json({ projects: [], pagination: { page, limit, total: 0, totalPages: 0 } })
            }
            query = query.eq('designer_id', designer.id)
        }

        // Status filter
        if (status !== 'all') {
            query = query.eq('status', status)
        }

        // Search filter (Title only for now)
        if (search) {
            query = query.ilike('title', `%${search}%`)
        }

        // Sorting
        const ascending = sortOrder === 'asc'
        query = query.order(sortBy, { ascending })

        // Pagination
        query = query.range(offset, offset + limit - 1)

        const { data: rawProjects, error, count } = await query

        if (error) {
            console.error('Error fetching projects:', error)
            return NextResponse.json({ error: 'Error al cargar proyectos' }, { status: 500 })
        }

        // Transform/Flatten data to match expected frontend format
        const projects = (rawProjects || []).map((p: any) => ({
            ...p,
            company_name: p.companies?.name,
            company_logo: p.companies?.logo_url,
            client_email: p.companies?.users?.email,
            client_name: p.companies?.users ? `${p.companies.users.first_name} ${p.companies.users.last_name}` : null,
            designer_name: p.designers?.users ? `${p.designers.users.first_name} ${p.designers.users.last_name}` : null,
            designer_rating: p.designers?.rating,
            // Remove nested objects to keep response clean
            companies: undefined,
            designers: undefined
        }))

        return NextResponse.json({
            projects,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        })
    } catch (error) {
        console.error('Projects GET error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// POST /api/projects — Create a new project
export async function POST(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, content_type, priority, deadline, companyId, designer_id } = body

        let targetCompanyId = ''

        // Logic for determining Company ID based on role
        if (session.role === 'client') {
            const company = await getCompanyForUser(session.userId)
            if (!company) {
                return NextResponse.json({ error: 'No se encontró la empresa asociada' }, { status: 400 })
            }
            targetCompanyId = company.id
        } else if (session.role === 'admin') {
            if (!companyId) {
                return NextResponse.json({ error: 'ID de empresa requerido para admin' }, { status: 400 })
            }
            targetCompanyId = companyId
        } else {
            return NextResponse.json({ error: 'Rol no autorizado para crear proyectos' }, { status: 403 })
        }

        if (!title || !description || !content_type || !deadline) {
            return NextResponse.json(
                { error: 'Título, descripción, tipo de contenido y fecha de entrega son requeridos' },
                { status: 400 }
            )
        }

        const validTypes = ['static', 'reel', 'story', 'carousel']
        const validPriorities = ['low', 'medium', 'high', 'urgent']

        if (!validTypes.includes(content_type)) {
            return NextResponse.json({ error: 'Tipo de contenido inválido' }, { status: 400 })
        }

        if (priority && !validPriorities.includes(priority)) {
            return NextResponse.json({ error: 'Prioridad inválida' }, { status: 400 })
        }

        const projectData: any = {
            company_id: targetCompanyId,
            title,
            description,
            content_type,
            priority: priority || 'medium',
            status: 'pending',
            deadline,
            revision_count: 0,
        }

        // Allow admin to assign designer immediately
        if (session.role === 'admin' && designer_id) {
            projectData.designer_id = designer_id
            // If assigned, maybe status should be 'in_progress' or remain 'pending'? 
            // 'pending' is fine, let designer start it.
        }

        const { data: project, error } = await supabase
            .from('projects')
            .insert(projectData)
            .select()
            .single()

        if (error) {
            console.error('Error creating project:', error)
            return NextResponse.json({ error: 'Error al crear el proyecto' }, { status: 500 })
        }

        return NextResponse.json({ project }, { status: 201 })
    } catch (error) {
        console.error('Projects POST error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
