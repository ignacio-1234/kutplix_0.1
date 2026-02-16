import PlansSection from '@/components/PlansSection'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Kutplix
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10">
              Plataforma de gestión de diseño para empresas y creativos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Comenzar Gratis
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <PlansSection />
    </main>
  )
}
