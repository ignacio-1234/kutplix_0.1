'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const companyName = formData.get('companyName') as string

    try {
      await register({ email, password, firstName, lastName, companyName })
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-5">
      <div className="flex bg-white rounded-3xl overflow-hidden shadow-2xl max-w-6xl w-full animate-slideUp">
        {/* Brand Side */}
        <div className="flex-1 bg-gradient-to-br from-primary to-primary-dark p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-radial from-white/10 to-transparent animate-pulse-slow" />
          </div>

          <div className="relative z-10">
            <h1 className="font-display text-5xl font-bold text-white mb-3 tracking-tight">
              KUTPLIX
            </h1>
            <p className="text-white/80 text-base">
              Plataforma de Gestión de Contenido Digital
            </p>
          </div>

          <div className="relative z-10">
            <h2 className="font-display text-3xl font-semibold text-white mb-6 leading-tight">
              Centraliza tu<br />proceso creativo
            </h2>

            <div className="flex flex-col gap-5">
              {[
                { icon: '✓', text: 'Gestión integral de proyectos de diseño' },
                { icon: '⚡', text: 'Asignación automatizada de diseñadores' },
                { icon: '📊', text: 'Métricas y reportes en tiempo real' }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 animate-fadeInLeft"
                  style={{ animationDelay: `${(idx + 2) * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <div className="text-white flex-1">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 p-16 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex gap-2 mb-10 bg-gray-100 p-1.5 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3.5 px-6 rounded-lg font-semibold transition-all ${isLogin
                  ? 'bg-white text-primary shadow-md'
                  : 'text-gray-600'
                }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3.5 px-6 rounded-lg font-semibold transition-all ${!isLogin
                  ? 'bg-white text-primary shadow-md'
                  : 'text-gray-600'
                }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <div>
              <div className="mb-8">
                <h3 className="font-display text-3xl font-semibold text-gray-900 mb-2">
                  ¡Bienvenido de vuelta!
                </h3>
                <p className="text-gray-600">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-900">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-900">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                    <span className="text-sm">Recordarme</span>
                  </label>
                  <Link href="#" className="text-sm text-primary font-medium hover:text-primary-dark">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-600">O continuar con</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all">
                  <span>🔵</span>
                  Google
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all">
                  <span>📘</span>
                  Facebook
                </button>
              </div>
            </div>
          ) : (
            /* Register Form */
            <div>
              <div className="mb-8">
                <h3 className="font-display text-3xl font-semibold text-gray-900 mb-2">
                  Crea tu cuenta
                </h3>
                <p className="text-gray-600">
                  Comienza a gestionar tus proyectos hoy
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleRegister}>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Juan"
                      className="input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Pérez"
                      className="input"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-900">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-900">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Mi Empresa"
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-900">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mínimo 8 caracteres"
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 mt-1 cursor-pointer" required />
                  <span className="text-sm">
                    Acepto los <Link href="#" className="text-primary font-medium">términos y condiciones</Link>
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
