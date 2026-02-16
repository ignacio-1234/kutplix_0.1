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

export interface PortfolioItem {
    id: string
    project_id: string
    title: string
    client_name: string
    content_type: string
    completed_at: string
    files: string[]
    thumbnail_url?: string // Calculated from files (first image/video)
}

// GET /api/designer/portfolio
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

        // 1. Get all APPROVED projects assigned to this designer
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select(`
                id, 
                title, 
                content_type, 
                completed_at,
                company_id,
                updated_at,
                status
            `)
            .eq('designer_id', designer.id)
            .eq('status', 'approved')
            .order('updated_at', { ascending: false })

        if (projectsError) {
            console.error('Error fetching portfolio projects:', projectsError)
            return NextResponse.json({ error: 'Error al cargar el portafolio' }, { status: 500 })
        }

        if (!projects || projects.length === 0) {
            return NextResponse.json({ portfolio: [] })
        }

        // 2. For each project, fetch the LATEST delivery and Client Name
        // We'll do this in parallel for efficiency
        const portfolioItems: PortfolioItem[] = []

        await Promise.all(projects.map(async (project) => {
            // Fetch Client/Company Name
            const { data: company } = await supabase
                .from('companies')
                .select('name')
                .eq('id', project.company_id)
                .single()

            const clientName = company?.name || 'Cliente Confidencial'

            // Fetch Latest Delivery
            const { data: delivery } = await supabase
                .from('deliveries')
                .select('files')
                .eq('project_id', project.id)
                .order('version', { ascending: false })
                .limit(1)
                .single()

            // IF there is a delivery with files, add to portfolio
            if (delivery && delivery.files && delivery.files.length > 0) {
                portfolioItems.push({
                    id: project.id, // Using project ID as portfolio item ID
                    project_id: project.id,
                    title: project.title,
                    client_name: clientName,
                    content_type: project.content_type,
                    completed_at: project.completed_at || project.updated_at,
                    files: delivery.files,
                    thumbnail_url: delivery.files[0] // User first file as thumbnail
                })
            }
        }))

        // Sort by completion date (newest first)
        portfolioItems.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

        return NextResponse.json({ portfolio: portfolioItems })

    } catch (error) {
        console.error('Designer portfolio error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
