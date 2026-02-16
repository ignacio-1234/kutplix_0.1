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

// GET /api/client/resources — List all resources for the client's company
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const company = await getCompanyForUser(session.userId)
        if (!company) {
            return NextResponse.json({ resources: [], stats: { total: 0, totalSize: 0, byCategory: {} } })
        }

        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category') || 'all'
        const search = searchParams.get('search') || ''

        // Get all project IDs for this company
        const { data: projects } = await supabase
            .from('projects')
            .select('id, title')
            .eq('company_id', company.id)

        if (!projects || projects.length === 0) {
            return NextResponse.json({ resources: [], stats: { total: 0, totalSize: 0, byCategory: { input: 0, output: 0, reference: 0 } } })
        }

        const projectIds = projects.map(p => p.id)
        const projectMap = Object.fromEntries(projects.map(p => [p.id, p.title]))

        // Fetch resources
        let query = supabase
            .from('resources')
            .select('*')
            .in('project_id', projectIds)
            .order('uploaded_at', { ascending: false })

        if (category !== 'all') {
            query = query.eq('category', category)
        }
        if (search) {
            query = query.ilike('file_name', `%${search}%`)
        }

        const { data: resources, error } = await query

        if (error) {
            console.error('Error fetching resources:', error)
            return NextResponse.json({ error: 'Error al cargar recursos' }, { status: 500 })
        }

        // Calculate stats from ALL resources (unfiltered)
        const { data: allResources } = await supabase
            .from('resources')
            .select('id, file_size, category')
            .in('project_id', projectIds)

        const all = allResources || []
        const stats = {
            total: all.length,
            totalSize: all.reduce((sum, r) => sum + (r.file_size || 0), 0),
            byCategory: {
                input: all.filter(r => r.category === 'input').length,
                output: all.filter(r => r.category === 'output').length,
                reference: all.filter(r => r.category === 'reference').length,
            },
        }

        // Enrich resources with project title
        const enriched = (resources || []).map(r => ({
            ...r,
            project_title: projectMap[r.project_id] || 'Sin proyecto',
        }))

        return NextResponse.json({ resources: enriched, stats })
    } catch (error) {
        console.error('Resources GET error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// POST /api/client/resources — Upload a resource
export async function POST(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { project_id, file_name, file_url, file_type, file_size, category } = body

        if (!project_id || !file_name || !file_url) {
            return NextResponse.json({ error: 'project_id, file_name y file_url son requeridos' }, { status: 400 })
        }

        const validCategories = ['input', 'output', 'reference']
        if (category && !validCategories.includes(category)) {
            return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 })
        }

        // Verify the project belongs to this user's company
        const company = await getCompanyForUser(session.userId)
        if (!company) {
            return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 400 })
        }

        const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('id', project_id)
            .eq('company_id', company.id)
            .single()

        if (!project) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
        }

        const { data: resource, error } = await supabase
            .from('resources')
            .insert({
                project_id,
                uploaded_by: session.userId,
                file_name,
                file_url,
                file_type: file_type || null,
                file_size: file_size || null,
                category: category || 'input',
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating resource:', error)
            return NextResponse.json({ error: 'Error al crear recurso' }, { status: 500 })
        }

        return NextResponse.json({ resource }, { status: 201 })
    } catch (error) {
        console.error('Resources POST error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// DELETE /api/client/resources — Delete a resource by ID
export async function DELETE(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const resourceId = searchParams.get('id')

        if (!resourceId) {
            return NextResponse.json({ error: 'ID de recurso requerido' }, { status: 400 })
        }

        // Verify ownership
        const company = await getCompanyForUser(session.userId)
        if (!company) {
            return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 400 })
        }

        const { data: resource } = await supabase
            .from('resources')
            .select('id, project_id')
            .eq('id', resourceId)
            .single()

        if (!resource) {
            return NextResponse.json({ error: 'Recurso no encontrado' }, { status: 404 })
        }

        // Verify the project belongs to this company
        const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('id', resource.project_id)
            .eq('company_id', company.id)
            .single()

        if (!project) {
            return NextResponse.json({ error: 'Sin acceso' }, { status: 403 })
        }

        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', resourceId)

        if (error) {
            console.error('Error deleting resource:', error)
            return NextResponse.json({ error: 'Error al eliminar recurso' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Resources DELETE error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
