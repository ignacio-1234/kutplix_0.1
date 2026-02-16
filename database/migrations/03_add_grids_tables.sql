-- Migration: Add grids, grid_items, and grid_comments tables for monthly content planning
-- The grid system allows admins/designers to plan monthly content and get client approval

CREATE TABLE IF NOT EXISTS grids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2024),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'changes_requested')),
    created_by UUID NOT NULL REFERENCES users(id),
    sent_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- One grid per company per month
    UNIQUE(company_id, month, year)
);

CREATE TABLE IF NOT EXISTS grid_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grid_id UUID NOT NULL REFERENCES grids(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('static', 'reel', 'story', 'carousel')),
    topic VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grid_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grid_id UUID NOT NULL REFERENCES grids(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grids_company ON grids (company_id, year, month);
CREATE INDEX IF NOT EXISTS idx_grid_items_grid ON grid_items (grid_id, date);
CREATE INDEX IF NOT EXISTS idx_grid_comments_grid ON grid_comments (grid_id, created_at);
