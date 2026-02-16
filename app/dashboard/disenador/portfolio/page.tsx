'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/auth-context'
import Image from 'next/image'

interface PortfolioItem {
    id: string
    project_id: string
    title: string
    client_name: string
    content_type: string
    completed_at: string
    files: string[]
    thumbnail_url?: string
}

const contentLabels: Record<string, string> = {
    all: 'Todos',
    static: 'Static Posts',
    reel: 'Reels / Video',
    story: 'Stories',
    carousel: 'Carrousels',
}

const contentIcons: Record<string, string> = {
    static: '🖼️',
    reel: '🎬',
    story: '📱',
    carousel: '📊',
}

export default function DesignerPortfolioPage() {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Diseñador'
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

    const fetchPortfolio = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/designer/portfolio')
            if (res.ok) {
                const data = await res.json()
                setPortfolioItems(data.portfolio || [])
            }
        } catch (err) {
            console.error('Error fetching portfolio:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPortfolio()
    }, [])

    const filteredItems = filter === 'all'
        ? portfolioItems
        : portfolioItems.filter(item => item.content_type === filter)

    // Helper to determine if a file is distinctively video
    const isVideo = (url?: string) => {
        if (!url) return false
        const ext = url.split('.').pop()?.toLowerCase() || ''
        return ['mp4', 'mov', 'webm'].includes(ext)
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName={userName} userRole="Diseñador Senior" />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Mi Portfolio
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Galería de tus mejores trabajos aprobados
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Filters */}
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                        {['all', 'static', 'reel', 'story', 'carousel'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                                    ${filter === type
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {contentLabels[type]}
                            </button>
                        ))}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-20">
                            <div className="text-4xl animate-spin mb-3">⏳</div>
                            <p className="text-gray-500">Cargando portfolio...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredItems.length === 0 && (
                        <div className="text-center py-20 card">
                            <div className="text-6xl mb-4">🎨</div>
                            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                                {filter === 'all' ? 'Aún no tienes proyectos aprobados' : 'No hay trabajos en esta categoría'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {filter === 'all'
                                    ? 'Tus trabajos aparecerán aquí automáticamente una vez que tus entregas sean aprobadas por el cliente.'
                                    : 'Intenta cambiar el filtro para ver otros tipos de contenido.'}
                            </p>
                        </div>
                    )}

                    {/* Portfolio Grid */}
                    {!loading && filteredItems.length > 0 && (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {filteredItems.map(item => (
                                <div
                                    key={item.id}
                                    className="break-inside-avoid card p-0 overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <div className="relative aspect-auto bg-gray-100">
                                        {/* Thumbnail / Media Preview */}
                                        {item.thumbnail_url ? (
                                            isVideo(item.thumbnail_url) ? (
                                                <video
                                                    src={item.thumbnail_url}
                                                    className="w-full h-auto object-cover"
                                                    muted
                                                    loop
                                                    onMouseOver={e => e.currentTarget.play()}
                                                    onMouseOut={e => e.currentTarget.pause()}
                                                />
                                            ) : (
                                                <img
                                                    src={item.thumbnail_url}
                                                    alt={item.title}
                                                    className="w-full h-auto object-cover"
                                                    loading="lazy"
                                                />
                                            )
                                        ) : (
                                            <div className="h-48 flex items-center justify-center text-gray-300 text-4xl">
                                                🖼️
                                            </div>
                                        )}

                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                                            <div className="font-semibold text-lg">{item.title}</div>
                                            <div className="text-sm opacity-80">{item.client_name}</div>
                                            <div className="mt-2 flex gap-2">
                                                <span className="text-xs bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                                                    {contentIcons[item.content_type]} {item.content_type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal for Item Details */}
                {selectedItem && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
                        <div
                            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Media Section */}
                            <div className="flex-1 bg-black flex items-center justify-center p-4 min-h-[300px] md:min-h-0">
                                {isVideo(selectedItem.files[0]) ? (
                                    <video controls src={selectedItem.files[0]} className="max-w-full max-h-[70vh]" />
                                ) : (
                                    <img src={selectedItem.files[0]} alt={selectedItem.title} className="max-w-full max-h-[70vh] object-contain" />
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-80 p-6 border-l border-gray-200 overflow-y-auto flex flex-col">
                                <div className="flex-1">
                                    <h3 className="font-display text-xl font-bold text-gray-900 mb-1">
                                        {selectedItem.title}
                                    </h3>
                                    <p className="text-primary font-medium mb-4">{selectedItem.client_name}</p>

                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Formato</div>
                                            <div className="flex items-center gap-2">
                                                <span>{contentIcons[selectedItem.content_type]}</span>
                                                <span className="capitalize">{selectedItem.content_type}</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Fecha Completado</div>
                                            <div>{new Date(selectedItem.completed_at).toLocaleDateString()}</div>
                                        </div>

                                        {selectedItem.files.length > 1 && (
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase font-bold mb-2">Más archivos ({selectedItem.files.length})</div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {selectedItem.files.slice(0, 6).map((file, i) => (
                                                        <a key={i} href={file} target="_blank" rel="noopener noreferrer" className="aspect-square bg-gray-100 rounded-md overflow-hidden hover:opacity-80 transition-opacity block border border-gray-200">
                                                            {isVideo(file) ? (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">🎬</div>
                                                            ) : (
                                                                <img src={file} className="w-full h-full object-cover" />
                                                            )}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <button
                                        className="btn-secondary w-full"
                                        onClick={() => setSelectedItem(null)}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
