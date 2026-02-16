export type User = {
    id: string
    email: string
    password_hash: string
    first_name: string
    last_name: string
    role: 'admin' | 'client' | 'designer'
    avatar_url: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export type Company = {
    id: string
    user_id: string
    name: string
    industry: string | null
    logo_url: string | null
    brand_colors: Record<string, string> | null
    website: string | null
    phone: string | null
    created_at: string
    updated_at: string
}

export type Designer = {
    id: string
    user_id: string
    specialties: string[]
    portfolio_url: string | null
    max_concurrent_projects: number
    avg_completion_time: number | null
    rating: number
    created_at: string
    updated_at: string
}

export type AuthUser = {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'admin' | 'client' | 'designer'
    avatarUrl?: string | null
    isActive?: boolean
}

export type LoginCredentials = {
    email: string
    password: string
}

export type RegisterData = {
    email: string
    password: string
    first_name: string
    last_name: string
    role: 'admin' | 'client' | 'designer'
}

export type Plan = {
    id: string
    name: string
    description: string
    monthly_projects: number | null
    max_revisions: number
    price: number
    features: Record<string, unknown>
    is_active: boolean
    created_at: string
    updated_at: string
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired'

export type Subscription = {
    id: string
    company_id: string
    plan_id: string
    status: SubscriptionStatus
    start_date: string
    end_date: string
    auto_renew: boolean
    projects_used: number
    created_at: string
    updated_at: string
    // Joined
    plans?: Plan
}

export type ContentType = 'static' | 'reel' | 'story' | 'carousel'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ProjectStatus = 'pending' | 'in_progress' | 'in_review' | 'changes_requested' | 'approved' | 'cancelled'

export type Project = {
    id: string
    company_id: string
    designer_id: string | null
    title: string
    description: string
    content_type: ContentType
    priority: ProjectPriority
    status: ProjectStatus
    deadline: string
    created_at: string
    completed_at: string | null
    revision_count: number
    updated_at: string
    // Joined fields from projects_full view
    company_name?: string
    company_logo?: string
    client_email?: string
    client_name?: string
    designer_name?: string
    designer_rating?: number
    plan_name?: string
    max_revisions_allowed?: number
}

export type Resource = {
    id: string
    project_id: string
    uploaded_by: string
    file_name: string
    file_url: string
    file_type: string | null
    file_size: number | null
    category: 'input' | 'output' | 'reference'
    uploaded_at: string
}

export type Delivery = {
    id: string
    project_id: string
    designer_id: string
    version: number
    notes: string | null
    files: string[]
    delivered_at: string
}

export type Review = {
    id: string
    delivery_id: string
    reviewed_by: string
    status: 'approved' | 'changes_requested'
    comments: string | null
    reviewed_at: string
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error'

export type Notification = {
    id: string
    user_id: string
    title: string
    message: string
    type: NotificationType
    is_read: boolean
    created_at: string
}

export type GridStatus = 'draft' | 'sent' | 'approved' | 'changes_requested'
export type GridItemStatus = 'planned' | 'in_progress' | 'completed'

export type Grid = {
    id: string
    company_id: string
    month: number
    year: number
    status: GridStatus
    created_by: string
    sent_at: string | null
    approved_at: string | null
    created_at: string
    updated_at: string
    // Joined
    company_name?: string
    items?: GridItem[]
    comments?: GridComment[]
}

export type GridItem = {
    id: string
    grid_id: string
    date: string
    content_type: ContentType
    topic: string
    description: string | null
    status: GridItemStatus
    project_id: string | null
    created_at: string
    updated_at: string
}

export type GridComment = {
    id: string
    grid_id: string
    user_id: string
    message: string
    created_at: string
    // Joined
    user_name?: string
    user_role?: string
}

export type ReminderStatus = 'active' | 'resolved' | 'escalated'

export type Reminder = {
    id: string
    user_id: string
    related_type: 'grid' | 'project' | 'delivery'
    related_id: string
    reminder_count: number
    last_sent_at: string | null
    next_send_at: string
    status: ReminderStatus
    created_at: string
    updated_at: string
}
