import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/session'

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard']

// Rutas solo para usuarios no autenticados
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Verificar sesión
    const session = await verifySession()
    const isAuthenticated = !!session

    // Si el usuario está autenticado y trata de acceder a login/register
    if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
        // Redirigir según el rol
        const dashboardPath = getDashboardPath(session.role)
        return NextResponse.redirect(new URL(dashboardPath, request.url))
    }

    // Si el usuario NO está autenticado y trata de acceder a rutas protegidas
    if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Si está autenticado, verificar que esté accediendo al dashboard correcto
    if (isAuthenticated && pathname.startsWith('/dashboard')) {
        const expectedDashboard = getDashboardPath(session.role)

        // Si está en /dashboard exactamente, redirigir al dashboard correcto
        if (pathname === '/dashboard') {
            return NextResponse.redirect(new URL(expectedDashboard, request.url))
        }

        // Verificar que esté en el dashboard correcto para su rol
        if (!pathname.startsWith(expectedDashboard)) {
            return NextResponse.redirect(new URL(expectedDashboard, request.url))
        }
    }

    return NextResponse.next()
}

function getDashboardPath(role: string): string {
    switch (role) {
        case 'admin':
            return '/dashboard/admin'
        case 'designer':
            return '/dashboard/disenador'
        case 'client':
        default:
            return '/dashboard/cliente'
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
