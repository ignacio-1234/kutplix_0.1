import type { Metadata } from 'next'
import { DM_Sans, Sora } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kutplix - Plataforma de Gestión de Contenido Digital',
  description: 'Centraliza y optimiza la gestión de contenido digital entre clientes y diseñadores',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${dmSans.variable} ${sora.variable}`}>
      <body className={dmSans.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
