import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/reminders
 *
 * Cron endpoint that processes active reminders and sends escalating notifications.
 * Call this from an external cron service (e.g., Vercel Cron, GitHub Actions) every hour.
 *
 * Escalation schedule:
 * - Reminder 1 (24h): Gentle reminder to the client
 * - Reminder 2 (48h): Urgent reminder to the client
 * - Reminder 3 (72h): Escalate to admin, mark reminder as escalated
 *
 * Protect this endpoint in production with a secret header.
 */
export async function GET(request: NextRequest) {
    // Simple auth: check for a cron secret header
    const cronSecret = request.headers.get('x-cron-secret')
    const expectedSecret = process.env.CRON_SECRET
    if (expectedSecret && cronSecret !== expectedSecret) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    try {
        const now = new Date().toISOString()

        // Fetch all active reminders that are due
        const { data: reminders, error } = await supabase
            .from('reminders')
            .select('*')
            .eq('status', 'active')
            .lte('next_send_at', now)

        if (error) {
            console.error('Error fetching reminders:', error)
            return NextResponse.json({ error: 'Error al obtener recordatorios' }, { status: 500 })
        }

        if (!reminders || reminders.length === 0) {
            return NextResponse.json({ processed: 0, message: 'Sin recordatorios pendientes' })
        }

        let processed = 0
        let escalated = 0

        for (const reminder of reminders) {
            const newCount = reminder.reminder_count + 1

            // Get project/entity title for the notification message
            let entityTitle = ''
            if (reminder.related_type === 'project' || reminder.related_type === 'delivery') {
                const { data: project } = await supabase
                    .from('projects')
                    .select('title, company_id')
                    .eq('id', reminder.related_id)
                    .single()
                entityTitle = project?.title || 'proyecto'
            }

            if (newCount <= 2) {
                // Send reminder to client
                const isUrgent = newCount === 2
                await createNotification({
                    userId: reminder.user_id,
                    title: isUrgent
                        ? `Recordatorio urgente: "${entityTitle}"`
                        : `Recordatorio: "${entityTitle}" espera tu confirmación`,
                    message: isUrgent
                        ? `Tu proyecto "${entityTitle}" lleva más de 48 horas esperando tu respuesta. Por favor, revisa y confirma lo antes posible.`
                        : `Tienes una entrega pendiente de aprobación para "${entityTitle}". Revisa y confirma para continuar con el proceso.`,
                    type: isUrgent ? 'warning' : 'info',
                })

                // Schedule next reminder
                const nextSend = new Date()
                nextSend.setHours(nextSend.getHours() + 24)

                await supabase
                    .from('reminders')
                    .update({
                        reminder_count: newCount,
                        last_sent_at: now,
                        next_send_at: nextSend.toISOString(),
                        updated_at: now,
                    })
                    .eq('id', reminder.id)

                processed++
            } else {
                // 3rd reminder: escalate to admin
                // Find admin users
                const { data: admins } = await supabase
                    .from('users')
                    .select('id')
                    .eq('role', 'admin')
                    .eq('is_active', true)

                if (admins) {
                    for (const admin of admins) {
                        await createNotification({
                            userId: admin.id,
                            title: `Escalamiento: cliente sin respuesta para "${entityTitle}"`,
                            message: `El cliente no ha respondido después de 3 recordatorios para "${entityTitle}". Se requiere contacto directo.`,
                            type: 'error',
                        })
                    }
                }

                // Also notify the client one last time
                await createNotification({
                    userId: reminder.user_id,
                    title: `Acción requerida: "${entityTitle}"`,
                    message: `Tu proyecto "${entityTitle}" necesita tu confirmación urgente. Nuestro equipo de soporte se pondrá en contacto contigo.`,
                    type: 'error',
                })

                // Mark as escalated
                await supabase
                    .from('reminders')
                    .update({
                        status: 'escalated',
                        reminder_count: newCount,
                        last_sent_at: now,
                        updated_at: now,
                    })
                    .eq('id', reminder.id)

                escalated++
                processed++
            }
        }

        return NextResponse.json({
            processed,
            escalated,
            message: `Procesados ${processed} recordatorios, ${escalated} escalados`,
        })
    } catch (error) {
        console.error('Cron reminders error:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
