
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env.local')
let supabaseUrl = ''
let supabaseAnonKey = ''

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=')
        if (key && value) {
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value.trim()
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = value.trim()
        }
    })
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function assignProjects() {
    console.log('--- Assigning Projects ---')

    // 1. Get the first designer
    const { data: designers } = await supabase.from('designers').select('id').limit(1)
    if (!designers || designers.length === 0) {
        console.error('No designers found.')
        return
    }
    const designerId = designers[0].id
    console.log(`Found Designer ID: ${designerId}`)

    // 2. Get unassigned projects
    const { data: projects } = await supabase.from('projects').select('id, title').is('designer_id', null)

    if (!projects || projects.length === 0) {
        console.log('No unassigned projects found.')
        return
    }

    console.log(`Found ${projects.length} unassigned projects. Assigning to designer...`)

    // 3. Update projects
    for (const project of projects) {
        const { error } = await supabase
            .from('projects')
            .update({ designer_id: designerId })
            .eq('id', project.id)

        if (error) console.error(`Failed to assign ${project.title}:`, error.message)
        else console.log(`Assigned '${project.title}' to designer.`)
    }

    console.log('--- Done ---')
}

assignProjects()
