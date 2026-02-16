import { supabase } from '@/lib/supabase'

type NotificationType = 'info' | 'warning' | 'success' | 'error'

interface CreateNotificationParams {
    userId: string
    title: string
    message: string
    type?: NotificationType
}

/**
 * Creates an in-app notification for a user.
 * Use this helper from API routes to auto-trigger notifications on status changes.
 */
export async function createNotification({ userId, title, message, type = 'info' }: CreateNotificationParams) {
    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            title,
            message,
            type,
            is_read: false,
        })

    if (error) {
        console.error('Error creating notification:', error)
    }
}

/**
 * Creates a reminder record for a pending client action.
 * The cron endpoint will process these and send escalating notifications.
 */
export async function createReminder(userId: string, relatedType: 'grid' | 'project' | 'delivery', relatedId: string) {
    // Check if an active reminder already exists for this entity
    const { data: existing } = await supabase
        .from('reminders')
        .select('id')
        .eq('related_type', relatedType)
        .eq('related_id', relatedId)
        .eq('status', 'active')
        .maybeSingle()

    if (existing) return // Already tracking

    const nextSendAt = new Date()
    nextSendAt.setHours(nextSendAt.getHours() + 24) // First reminder after 24h

    const { error } = await supabase
        .from('reminders')
        .insert({
            user_id: userId,
            related_type: relatedType,
            related_id: relatedId,
            reminder_count: 0,
            next_send_at: nextSendAt.toISOString(),
            status: 'active',
        })

    if (error) {
        console.error('Error creating reminder:', error)
    }
}

/**
 * Resolves (deactivates) a reminder when the client takes action.
 */
export async function resolveReminder(relatedType: 'grid' | 'project' | 'delivery', relatedId: string) {
    const { error } = await supabase
        .from('reminders')
        .update({ status: 'resolved', updated_at: new Date().toISOString() })
        .eq('related_type', relatedType)
        .eq('related_id', relatedId)
        .eq('status', 'active')

    if (error) {
        console.error('Error resolving reminder:', error)
    }
}
