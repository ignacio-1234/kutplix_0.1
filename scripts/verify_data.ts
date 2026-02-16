
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

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase environment variables in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyData() {
    console.log('--- Verifying Database Content ---')
    console.log(`URL: ${supabaseUrl}`)

    // 1. Check Users
    const { count: userCount, error: userError } = await supabase.from('users').select('*', { count: 'exact', head: true })
    if (userError) console.error('Error fetching users:', userError.message)
    else console.log(`Users count: ${userCount}`)

    // 2. Check Designers
    const { data: designers, error: designerError } = await supabase.from('designers').select('id, user_id')
    if (designerError) console.error('Error fetching designers:', designerError.message)
    else {
        console.log(`Designers count: ${designers?.length}`)
        if (designers?.length) console.log('Sample Designer IDs:', designers.map(d => d.id))
    }

    // 3. Check Companies
    const { count: companyCount } = await supabase.from('companies').select('*', { count: 'exact', head: true })
    console.log(`Companies count: ${companyCount}`)

    // 4. Check Projects
    const { data: projects, error: projectError } = await supabase.from('projects').select('id, title, designer_id, status')
    if (projectError) console.error('Error fetching projects:', projectError.message)
    else {
        console.log(`Projects count: ${projects?.length}`)
        if (projects?.length) {
            console.log('Projects found:')
            projects.forEach(p => {
                console.log(` - [${p.status}] ${p.title} (Designer: ${p.designer_id || 'unassigned'})`)
            })
        }
    }

    console.log('--- End Verification ---')
}

verifyData()
