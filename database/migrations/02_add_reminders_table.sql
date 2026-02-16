-- Migration: Add reminders table for escalating client follow-ups
-- This table tracks automated reminders sent to clients for pending approvals

CREATE TABLE IF NOT EXISTS reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    related_type VARCHAR(20) NOT NULL CHECK (related_type IN ('grid', 'project', 'delivery')),
    related_id UUID NOT NULL,
    reminder_count INTEGER NOT NULL DEFAULT 0,
    last_sent_at TIMESTAMPTZ,
    next_send_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for cron job: find active reminders due to be sent
CREATE INDEX IF NOT EXISTS idx_reminders_active_due ON reminders (status, next_send_at)
    WHERE status = 'active';

-- Index for lookups by related entity
CREATE INDEX IF NOT EXISTS idx_reminders_related ON reminders (related_type, related_id);

-- Prevent duplicate active reminders for the same entity
CREATE UNIQUE INDEX IF NOT EXISTS idx_reminders_unique_active ON reminders (related_type, related_id)
    WHERE status = 'active';
