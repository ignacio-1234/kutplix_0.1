import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

// POST /api/client/resources/upload — Upload a file to Supabase Storage and create resource record
export async function POST(request: NextRequest) {
    try {
        const session = await verifySession()
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Get company
        const { data: company } = await supabase
            .from('companies')
            .select('id')
            .eq('user_id', session.userId)
            .single()

        if (!company) {
            return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 400 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const category = (formData.get('category') as string) || 'reference'
        const projectId = formData.get('project_id') as string | null

        if (!file) {
            return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: 'El archivo es demasiado grande (máximo 50MB)' }, { status: 400 })
        }

        // Validate category
        const validCategories = ['input', 'output', 'reference']
        if (!validCategories.includes(category)) {
            return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 })
        }

        // If project_id is provided, verify it belongs to the company
        let targetProjectId = projectId
        if (projectId) {
            const { data: project } = await supabase
                .from('projects')
                .select('id')
                .eq('id', projectId)
                .eq('company_id', company.id)
                .single()

            if (!project) {
                return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
            }
        } else {
            // If no project specified, pick the first project for this company
            // or create a "general" association
            const { data: firstProject } = await supabase
                .from('projects')
                .select('id')
                .eq('company_id', company.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (!firstProject) {
                return NextResponse.json(
                    { error: 'Necesitas al menos un proyecto para subir recursos' },
                    { status: 400 }
                )
            }
            targetProjectId = firstProject.id
        }

        // Generate unique filename
        const timestamp = Date.now()
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const storagePath = `${company.id}/${timestamp}_${sanitizedName}`

        // Upload to Supabase Storage
        const fileBuffer = await file.arrayBuffer()
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resources')
            .upload(storagePath, fileBuffer, {
                contentType: file.type,
                upsert: false,
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            // If bucket doesn't exist, try to create it and retry
            if (uploadError.message?.includes('not found') || uploadError.message?.includes('Bucket')) {
                // Try creating the bucket
                await supabase.storage.createBucket('resources', {
                    public: true,
                    fileSizeLimit: 52428800, // 50MB
                })
                // Retry upload
                const { data: retryData, error: retryError } = await supabase.storage
                    .from('resources')
                    .upload(storagePath, fileBuffer, {
                        contentType: file.type,
                        upsert: false,
                    })
                if (retryError) {
                    console.error('Retry upload error:', retryError)
                    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
                }
            } else {
                return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
            }
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('resources')
            .getPublicUrl(storagePath)

        const fileUrl = publicUrlData.publicUrl

        // Create resource record in database
        const { data: resource, error: dbError } = await supabase
            .from('resources')
            .insert({
                project_id: targetProjectId,
                uploaded_by: session.userId,
                file_name: file.name,
                file_url: fileUrl,
                file_type: file.type || null,
                file_size: file.size,
                category,
            })
            .select()
            .single()

        if (dbError) {
            console.error('DB insert error:', dbError)
            // Cleanup: delete uploaded file if DB insert fails
            await supabase.storage.from('resources').remove([storagePath])
            return NextResponse.json({ error: 'Error al registrar el recurso' }, { status: 500 })
        }

        return NextResponse.json({ resource }, { status: 201 })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
