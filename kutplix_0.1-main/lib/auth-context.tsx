'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthUser } from '@/types/database'

interface AuthContextType {
    user: AuthUser | null
    company: any | null
    designer: any | null
    subscription: any | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

interface RegisterData {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [company, setCompany] = useState<any | null>(null)
    const [designer, setDesigner] = useState<any | null>(null)
    const [subscription, setSubscription] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // Verificar sesión al cargar
    useEffect(() => {
        checkSession()
    }, [])

    const checkSession = async () => {
        try {
            const res = await fetch('/api/auth/session')

            if (res.ok) {
                const data = await res.json()
                setUser({
                    id: data.user.id,
                    email: data.user.email,
                    firstName: data.user.first_name,
                    lastName: data.user.last_name,
                    role: data.user.role,
                    avatarUrl: data.user.avatar_url,
                    isActive: data.user.is_active,
                })
                setCompany(data.company || null)
                setDesigner(data.designer || null)
                setSubscription(data.subscription || null)
            } else {
                setUser(null)
                setCompany(null)
                setDesigner(null)
                setSubscription(null)
            }
        } catch (error) {
            console.error('Error checking session:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || 'Error al iniciar sesión')
        }

        setUser({
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            role: data.user.role,
            avatarUrl: data.user.avatar_url,
            isActive: data.user.is_active,
        })
        setCompany(data.company || null)
        setDesigner(data.designer || null)

        // Redirigir según el rol
        const dashboardPath = getDashboardPath(data.user.role)
        router.push(dashboardPath)
    }

    const register = async (data: RegisterData) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        const result = await res.json()

        if (!res.ok) {
            throw new Error(result.error || 'Error al registrar')
        }

        setUser({
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.first_name,
            lastName: result.user.last_name,
            role: result.user.role,
            avatarUrl: result.user.avatar_url,
            isActive: result.user.is_active,
        })
        setCompany(result.company || null)

        router.push('/dashboard/cliente')
    }

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
        setCompany(null)
        setDesigner(null)
        setSubscription(null)
        router.push('/login')
    }

    const refreshUser = async () => {
        await checkSession()
    }

    const getDashboardPath = (role: string) => {
        switch (role) {
            case 'admin':
                return '/dashboard/admin'
            case 'designer':
                return '/dashboard/disenador'
            default:
                return '/dashboard/cliente'
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                company,
                designer,
                subscription,
                loading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
