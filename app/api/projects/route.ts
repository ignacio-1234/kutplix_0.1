import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

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

        // Use the projects_full view for enriched data
        let query = supabase.from('projects_full').select('*', { count: 'exact' })

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
        // admin sees all

        // Status filter
        if (status !== 'all') {
            query = query.eq('status', status)
        }

        // Search filter
        if (search) {
            query = query.ilike('title', `%${search}%`)
        }

        // Sorting
        const ascending = sortOrder === 'asc'
        query = query.order(sortBy, { ascending })

        // Pagination
        query = query.range(offset, offset + limit - 1)

        const { data: projects, error, count } = await query

        if (error) {
            console.error('Error fetching projects:', error)
            return NextResponse.json({ error: 'Error al cargar proyectos' }, { status: 500 })
        }

        return NextResponse.json({
            projects: projects || [],
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

        const company = await getCompanyForUser(session.userId)
        if (!company) {
            return NextResponse.json({ error: 'No se encontró la empresa asociada' }, { status: 400 })
        }

        const body = await request.json()
        const { title, description, content_type, priority, deadline } = body

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

        const projectData = {
            company_id: company.id,
            title,
            description,
            content_type,
            priority: priority || 'medium',
            status: 'pending',
            deadline,
            revision_count: 0,
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
