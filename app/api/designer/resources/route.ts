import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// Helper: Get designer profile for user
async function getDesignerForUser(userId: string) {
    const { data } = await supabase
        .from('designers')
        .select('id')
        .eq('user_id', userId)
        .single()
    return data
}

// GET /api/designer/resources
export async function GET(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Verify user is a designer
        const designer = await getDesignerForUser(session.userId)
        if (!designer) {
            return NextResponse.json({ error: 'Perfil de diseñador no encontrado' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category') || 'all'
        const search = searchParams.get('search') || ''
        const projectId = searchParams.get('projectId') || ''

        // 1. Get all projects assigned to this designer
        let projectsQuery = supabase
            .from('projects')
            .select('id, title, company_id')
            .eq('designer_id', designer.id)

        if (projectId) {
            projectsQuery = projectsQuery.eq('id', projectId)
        }

        const { data: projects, error: projectsError } = await projectsQuery

        if (projectsError) {
            console.error('Error fetching projects:', projectsError)
            return NextResponse.json({ error: 'Error al cargar proyectos' }, { status: 500 })
        }

        if (!projects || projects.length === 0) {
            return NextResponse.json({
                resources: [],
                projects: [],
                stats: { total: 0, totalSize: 0, byCategory: { input: 0, output: 0, reference: 0 } }
            })
        }

        // Create a map of project IDs to details for easier lookup
        const projectMap = Object.fromEntries(projects.map(p => [p.id, p]))
        const projectIds = projects.map(p => p.id)

        // 2. Fetch resources for these projects
        let resourcesQuery = supabase
            .from('resources')
            .select('*')
            .in('project_id', projectIds)
            .order('uploaded_at', { ascending: false })

        if (category !== 'all') {
            resourcesQuery = resourcesQuery.eq('category', category)
        }
        if (search) {
            resourcesQuery = resourcesQuery.ilike('file_name', `%${search}%`)
        }

        const { data: resources, error: resourcesError } = await resourcesQuery

        if (resourcesError) {
            console.error('Error fetching resources:', resourcesError)
            return NextResponse.json({ error: 'Error al cargar recursos' }, { status: 500 })
        }

        // 3. Calculate stats (from all resources of these projects, ignoring filters)
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

        // 4. Enrich resources with project title
        const enrichedResources = (resources || []).map(r => ({
            ...r,
            project_title: projectMap[r.project_id]?.title || 'Sin proyecto',
        }))

        // Return resources and the list of projects (for filtering in UI)
        return NextResponse.json({
            resources: enrichedResources,
            projects: projects.map(p => ({ id: p.id, title: p.title })),
            stats
        })

    } catch (error) {
        console.error('Designer resources error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
