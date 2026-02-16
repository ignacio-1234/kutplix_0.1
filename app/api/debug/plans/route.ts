import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    const { data, error } = await supabase.from('plans').select('*').limit(1)
    if (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
    return NextResponse.json({ data })
}
