'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function PortfolioDisenador() {
    const [activeCategory, setActiveCategory] = useState('all')

    const categories = [
        { id: 'all', label: 'Todos' },
        { id: 'reel', label: 'Reels' },
        { id: 'imagen', label: 'Imágenes' },
        { id: 'carrusel', label: 'Carruseles' },
        { id: 'historia', label: 'Historias' },
    ]

    const portfolioItems = [
        {
            id: 1,
            title: 'Campaña Verano – SmileCenter',
            client: 'Clínica Dental SmileCenter',
            category: 'carrusel',
            type: 'Carrusel',
            typeIcon: '📱',
            date: 'Ene 2026',
            likes: 45,
            views: 1200,
            preview: 'bg-gradient-to-br from-blue-200 to-blue-400',
            rating: 5,
        },
        {
            id: 2,
            title: 'Reel Promocional – Spa',
            client: 'Spa Wellness & Beauty',
            category: 'reel',
            type: 'Reel',
            typeIcon: '🎬',
            date: 'Ene 2026',
            likes: 67,
            views: 3400,
            preview: 'bg-gradient-to-br from-purple-200 to-purple-400',
            rating: 5,
        },
        {
            id: 3,
            title: 'Banner Promocional Web',
            client: 'Centro Médico Integral',
            category: 'imagen',
            type: 'Imagen',
            typeIcon: '🖼️',
            date: 'Dic 2025',
            likes: 32,
            views: 890,
            preview: 'bg-gradient-to-br from-green-200 to-green-400',
            rating: 4,
        },
        {
            id: 4,
            title: 'Historias Tips de Belleza',
            client: 'Salón de Belleza Glamour',
            category: 'historia',
            type: 'Historia',
            typeIcon: '📱',
            date: 'Dic 2025',
            likes: 55,
            views: 2100,
            preview: 'bg-gradient-to-br from-pink-200 to-pink-400',
            rating: 5,
        },
        {
            id: 5,
            title: 'Post Testimonios',
            client: 'Clínica Dental SmileCenter',
            category: 'imagen',
            type: 'Imagen',
            typeIcon: '🖼️',
            date: 'Nov 2025',
            likes: 28,
            views: 750,
            preview: 'bg-gradient-to-br from-orange-200 to-orange-400',
            rating: 4,
        },
        {
            id: 6,
            title: 'Reel Año Nuevo – Spa',
            client: 'Spa Wellness & Beauty',
            category: 'reel',
            type: 'Reel',
            typeIcon: '🎬',
            date: 'Dic 2025',
            likes: 89,
            views: 5200,
            preview: 'bg-gradient-to-br from-yellow-200 to-yellow-400',
            rating: 5,
        },
        {
            id: 7,
            title: 'Carrusel Servicios Médicos',
            client: 'Centro Médico Integral',
            category: 'carrusel',
            type: 'Carrusel',
            typeIcon: '📱',
            date: 'Nov 2025',
            likes: 38,
            views: 1100,
            preview: 'bg-gradient-to-br from-teal-200 to-teal-400',
            rating: 4,
        },
        {
            id: 8,
            title: 'Historia Promo Navidad',
            client: 'Salón de Belleza Glamour',
            category: 'historia',
            type: 'Historia',
            typeIcon: '📱',
            date: 'Dic 2025',
            likes: 42,
            views: 1800,
            preview: 'bg-gradient-to-br from-red-200 to-red-400',
            rating: 5,
        },
    ]

    const filteredItems = activeCategory === 'all'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeCategory)

    const stats = {
        totalProjects: portfolioItems.length,
        totalViews: portfolioItems.reduce((sum, item) => sum + item.views, 0),
        totalLikes: portfolioItems.reduce((sum, item) => sum + item.likes, 0),
        avgRating: (portfolioItems.reduce((sum, item) => sum + item.rating, 0) / portfolioItems.length).toFixed(1),
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName="María González" userRole="Diseñadora Senior" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Mi Portfolio</h2>
                            <p className="text-sm text-gray-600 mt-1">Trabajos destacados y proyectos completados</p>
                        </div>
                        <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
                            + Agregar Proyecto
                        </button>
                    </div>
                </header>

                <div className="p-10">
                    {/* Profile Card */}
                    <div className="card mb-8 bg-gradient-to-r from-primary to-primary-dark text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                                MG
                            </div>
                            <div className="flex-1">
                                <h3 className="font-display text-xl font-bold">María González</h3>
                                <p className="text-white/80 text-sm">Diseñadora Senior · Especialista en Redes Sociales</p>
                            </div>
                            <div className="grid grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="font-display text-2xl font-bold">{stats.totalProjects}</div>
                                    <div className="text-xs text-white/70">Proyectos</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-display text-2xl font-bold">{(stats.totalViews / 1000).toFixed(1)}K</div>
                                    <div className="text-xs text-white/70">Vistas</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-display text-2xl font-bold">{stats.totalLikes}</div>
                                    <div className="text-xs text-white/70">Likes</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-display text-2xl font-bold">{stats.avgRating}</div>
                                    <div className="text-xs text-white/70">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-2 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Portfolio Grid */}
                    <div className="grid grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="card hover:shadow-lg transition-all cursor-pointer group overflow-hidden p-0">
                                <div className={`h-48 ${item.preview} flex items-center justify-center text-5xl relative`}>
                                    {item.typeIcon}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold shadow-lg">
                                            Ver Proyecto
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.client}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{item.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>👁️ {item.views.toLocaleString()}</span>
                                            <span>❤️ {item.likes}</span>
                                            <span className="flex items-center gap-0.5">
                                                ⭐ {item.rating}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
