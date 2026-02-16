import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'kutplix-secret-key-change-in-production'
)

export type SessionPayload = {
    userId: string
    email: string
    role: string
    expiresAt: Date
}

export async function createSession(payload: Omit<SessionPayload, 'expiresAt'>) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días

    const session = await new SignJWT({ ...payload, expiresAt })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(secret)

    cookies().set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })

    return session
}

export async function verifySession() {
    const cookie = cookies().get('session')?.value

    if (!cookie) {
        return null
    }

    try {
        const { payload } = await jwtVerify(cookie, secret)
        return payload as unknown as SessionPayload
    } catch (error) {
        return null
    }
}

export async function deleteSession() {
    cookies().delete('session')
}

export async function updateSession() {
    const session = cookies().get('session')?.value

    if (!session) {
        return null
    }

    try {
        const { payload } = await jwtVerify(session, secret)

        // Renovar la sesión si está por expirar (menos de 1 día)
        const expiresAt = new Date(payload.expiresAt as string)
        const now = new Date()
        const oneDayInMs = 24 * 60 * 60 * 1000

        if (expiresAt.getTime() - now.getTime() < oneDayInMs) {
            await createSession({
                userId: payload.userId as string,
                email: payload.email as string,
                role: payload.role as string,
            })
        }

        return payload as unknown as SessionPayload
    } catch (error) {
        return null
    }
}
