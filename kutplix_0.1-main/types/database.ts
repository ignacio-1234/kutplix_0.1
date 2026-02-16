export type UserRole = 'admin' | 'client' | 'designer'

export type User = {
    id: string
    email: string
    password_hash: string
    first_name: string
    last_name: string
    role: UserRole
    avatar_url?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type Company = {
    id: string
    user_id: string
    name: string
    industry?: string
    logo_url?: string
    brand_colors?: any
    website?: string
    phone?: string
    created_at: string
    updated_at: string
}

export type Designer = {
    id: string
    user_id: string
    specialties: string[]
    portfolio_url?: string
    max_concurrent_projects: number
    avg_completion_time?: number
    rating: number
    created_at: string
    updated_at: string
}

export type AuthUser = {
    id: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
    avatarUrl?: string
    isActive: boolean
}

export type LoginCredentials = {
    email: string
    password: string
}

export type RegisterData = {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
    role?: UserRole
}
