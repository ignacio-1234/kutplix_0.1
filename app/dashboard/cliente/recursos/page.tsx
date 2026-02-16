'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function RecursosCliente() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const categories = [
        { id: 'all', label: 'Todos', count: 12 },
        { id: 'logo', label: 'Logos', count: 3 },
        { id: 'brand', label: 'Guía de Marca', count: 2 },
        { id: 'photos', label: 'Fotografías', count: 4 },
        { id: 'fonts', label: 'Tipografías', count: 2 },
        { id: 'other', label: 'Otros', count: 1 },
    ]

    const resources = [
        {
            id: 1,
            name: 'Logo_SmileCenter_Principal.ai',
            category: 'logo',
            type: 'Illustrator',
            typeIcon: '🎨',
            size: '4.2 MB',
            uploadDate: '10 Feb 2026',
            preview: 'bg-blue-100',
        },
        {
            id: 2,
            name: 'Logo_SmileCenter_Blanco.png',
            category: 'logo',
            type: 'PNG',
            typeIcon: '🖼️',
            size: '1.8 MB',
            uploadDate: '10 Feb 2026',
            preview: 'bg-gray-800',
        },
        {
            id: 3,
            name: 'Logo_SmileCenter_Favicon.svg',
            category: 'logo',
            type: 'SVG',
            typeIcon: '🎨',
            size: '0.3 MB',
            uploadDate: '10 Feb 2026',
            preview: 'bg-blue-50',
        },
        {
            id: 4,
            name: 'Guia_Marca_SmileCenter.pdf',
            category: 'brand',
            type: 'PDF',
            typeIcon: '📄',
            size: '8.5 MB',
            uploadDate: '5 Feb 2026',
            preview: 'bg-red-100',
        },
        {
            id: 5,
            name: 'Paleta_Colores.pdf',
            category: 'brand',
            type: 'PDF',
            typeIcon: '📄',
            size: '1.1 MB',
            uploadDate: '5 Feb 2026',
            preview: 'bg-purple-100',
        },
        {
            id: 6,
            name: 'Fotos_Clinica_Interior.zip',
            category: 'photos',
            type: 'ZIP',
            typeIcon: '📦',
            size: '45.8 MB',
            uploadDate: '3 Feb 2026',
            preview: 'bg-green-100',
        },
        {
            id: 7,
            name: 'Fotos_Equipo_Medico.zip',
            category: 'photos',
            type: 'ZIP',
            typeIcon: '📦',
            size: '32.4 MB',
            uploadDate: '3 Feb 2026',
            preview: 'bg-yellow-100',
        },
        {
            id: 8,
            name: 'Foto_Doctor_Principal.jpg',
            category: 'photos',
            type: 'JPG',
            typeIcon: '🖼️',
            size: '5.2 MB',
            uploadDate: '1 Feb 2026',
            preview: 'bg-teal-100',
        },
        {
            id: 9,
            name: 'Foto_Recepcion.jpg',
            category: 'photos',
            type: 'JPG',
            typeIcon: '🖼️',
            size: '4.8 MB',
            uploadDate: '1 Feb 2026',
            preview: 'bg-orange-100',
        },
        {
            id: 10,
            name: 'Fuente_Montserrat.zip',
            category: 'fonts',
            type: 'ZIP',
            typeIcon: '📦',
            size: '2.1 MB',
            uploadDate: '28 Ene 2026',
            preview: 'bg-indigo-100',
        },
        {
            id: 11,
            name: 'Fuente_OpenSans.zip',
            category: 'fonts',
            type: 'ZIP',
            typeIcon: '📦',
            size: '1.8 MB',
            uploadDate: '28 Ene 2026',
            preview: 'bg-pink-100',
        },
        {
            id: 12,
            name: 'Texturas_Fondo.psd',
            category: 'other',
            type: 'PSD',
            typeIcon: '🎨',
            size: '12.3 MB',
            uploadDate: '25 Ene 2026',
            preview: 'bg-cyan-100',
        },
    ]

    const filteredResources = activeCategory === 'all'
        ? resources
        : resources.filter(r => r.category === activeCategory)

    const totalSize = resources.reduce((sum, r) => sum + parseFloat(r.size), 0)

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName="Juan Pérez" userRole="Clínica Dental" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Biblioteca de Recursos</h2>
                            <p className="text-sm text-gray-600 mt-1">{resources.length} archivos · {totalSize.toFixed(1)} MB total</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar archivos..."
                                    className="w-64 pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>
                            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                <button onClick={() => setViewMode('grid')} className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>▦</button>
                                <button onClick={() => setViewMode('list')} className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>☰</button>
                            </div>
                            <button className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
                                📤 Subir Archivo
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Categories */}
                    <div className="flex gap-2 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                    activeCategory === cat.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-200'}`}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-8 hover:border-primary transition-all cursor-pointer">
                        <div className="text-4xl mb-3">📤</div>
                        <div className="font-semibold text-gray-700 mb-1">Arrastra archivos aquí o haz clic para subir</div>
                        <div className="text-sm text-gray-500">JPG, PNG, PDF, AI, PSD, SVG · Máximo 50MB por archivo</div>
                    </div>

                    {/* Resources */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-4 gap-5">
                            {filteredResources.map((resource) => (
                                <div key={resource.id} className="card hover:shadow-lg transition-all cursor-pointer group">
                                    <div className={`h-28 ${resource.preview} rounded-xl mb-4 flex items-center justify-center text-3xl`}>
                                        {resource.typeIcon}
                                    </div>
                                    <div className="font-semibold text-sm text-gray-900 truncate">{resource.name}</div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                        <span>{resource.type} · {resource.size}</span>
                                        <span>{resource.uploadDate}</span>
                                    </div>
                                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="flex-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark">Descargar</button>
                                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50">🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card p-0 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b">Archivo</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b">Tipo</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b">Tamaño</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b">Fecha</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResources.map((resource) => (
                                        <tr key={resource.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{resource.typeIcon}</span>
                                                    <span className="text-sm font-medium text-gray-900">{resource.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 border-b border-gray-100 text-sm text-gray-600">{resource.type}</td>
                                            <td className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">{resource.size}</td>
                                            <td className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">{resource.uploadDate}</td>
                                            <td className="px-5 py-3 border-b border-gray-100">
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium">Descargar</button>
                                                    <button className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
