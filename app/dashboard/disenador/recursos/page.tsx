'use client'

import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function RecursosDisenador() {
    const [activeClient, setActiveClient] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const clients = [
        { id: 'all', name: 'Todos', count: 24 },
        { id: 'smile', name: 'SmileCenter', count: 8 },
        { id: 'spa', name: 'Spa Wellness', count: 6 },
        { id: 'glamour', name: 'Salón Glamour', count: 5 },
        { id: 'medico', name: 'Centro Médico', count: 5 },
    ]

    const resources = [
        {
            id: 1,
            name: 'Logo SmileCenter.ai',
            client: 'SmileCenter',
            clientId: 'smile',
            type: 'Illustrator',
            typeIcon: '🎨',
            size: '4.2 MB',
            uploadDate: '10 Feb 2026',
            category: 'Logo',
            preview: 'bg-blue-100',
        },
        {
            id: 2,
            name: 'Paleta de colores.pdf',
            client: 'SmileCenter',
            clientId: 'smile',
            type: 'PDF',
            typeIcon: '📄',
            size: '1.1 MB',
            uploadDate: '10 Feb 2026',
            category: 'Guía de marca',
            preview: 'bg-red-100',
        },
        {
            id: 3,
            name: 'Fotos equipo médico.zip',
            client: 'SmileCenter',
            clientId: 'smile',
            type: 'ZIP',
            typeIcon: '📦',
            size: '45.8 MB',
            uploadDate: '8 Feb 2026',
            category: 'Fotografía',
            preview: 'bg-yellow-100',
        },
        {
            id: 4,
            name: 'Brand Guidelines.pdf',
            client: 'Spa Wellness',
            clientId: 'spa',
            type: 'PDF',
            typeIcon: '📄',
            size: '3.5 MB',
            uploadDate: '5 Feb 2026',
            category: 'Guía de marca',
            preview: 'bg-purple-100',
        },
        {
            id: 5,
            name: 'Fotos Spa Interior.zip',
            client: 'Spa Wellness',
            clientId: 'spa',
            type: 'ZIP',
            typeIcon: '📦',
            size: '67.2 MB',
            uploadDate: '5 Feb 2026',
            category: 'Fotografía',
            preview: 'bg-green-100',
        },
        {
            id: 6,
            name: 'Logo Spa Wellness.png',
            client: 'Spa Wellness',
            clientId: 'spa',
            type: 'PNG',
            typeIcon: '🖼️',
            size: '2.1 MB',
            uploadDate: '3 Feb 2026',
            category: 'Logo',
            preview: 'bg-teal-100',
        },
        {
            id: 7,
            name: 'Tipografías_Glamour.zip',
            client: 'Salón Glamour',
            clientId: 'glamour',
            type: 'ZIP',
            typeIcon: '📦',
            size: '8.4 MB',
            uploadDate: '1 Feb 2026',
            category: 'Tipografía',
            preview: 'bg-pink-100',
        },
        {
            id: 8,
            name: 'Logo_Glamour_Vector.svg',
            client: 'Salón Glamour',
            clientId: 'glamour',
            type: 'SVG',
            typeIcon: '🎨',
            size: '0.5 MB',
            uploadDate: '1 Feb 2026',
            category: 'Logo',
            preview: 'bg-rose-100',
        },
        {
            id: 9,
            name: 'Manual_Identidad_CM.pdf',
            client: 'Centro Médico',
            clientId: 'medico',
            type: 'PDF',
            typeIcon: '📄',
            size: '5.8 MB',
            uploadDate: '28 Ene 2026',
            category: 'Guía de marca',
            preview: 'bg-cyan-100',
        },
        {
            id: 10,
            name: 'Iconos_Servicios.ai',
            client: 'Centro Médico',
            clientId: 'medico',
            type: 'Illustrator',
            typeIcon: '🎨',
            size: '3.2 MB',
            uploadDate: '28 Ene 2026',
            category: 'Iconos',
            preview: 'bg-indigo-100',
        },
    ]

    const filteredResources = activeClient === 'all'
        ? resources
        : resources.filter(r => r.clientId === activeClient)

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName="María González" userRole="Diseñadora Senior" />

            <main className="flex-1 ml-72">
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">Recursos de Clientes</h2>
                            <p className="text-sm text-gray-600 mt-1">{resources.length} archivos disponibles</p>
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
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    ▦
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    ☰
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Client Tabs */}
                    <div className="flex gap-2 mb-8 overflow-x-auto">
                        {clients.map((client) => (
                            <button
                                key={client.id}
                                onClick={() => setActiveClient(client.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeClient === client.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {client.name}
                                <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                                    activeClient === client.id ? 'bg-white/20' : 'bg-gray-200'
                                }`}>
                                    {client.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Resources Grid */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-4 gap-5">
                            {filteredResources.map((resource) => (
                                <div key={resource.id} className="card hover:shadow-lg transition-all cursor-pointer group">
                                    <div className={`h-32 ${resource.preview} rounded-xl mb-4 flex items-center justify-center text-4xl`}>
                                        {resource.typeIcon}
                                    </div>
                                    <div className="font-semibold text-sm text-gray-900 truncate">{resource.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{resource.client}</div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <span className="text-xs text-gray-400">{resource.size}</span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">{resource.category}</span>
                                    </div>
                                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="flex-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-all">
                                            Descargar
                                        </button>
                                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all">
                                            Ver
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Archivo</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Cliente</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Categoría</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Tipo</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Tamaño</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Fecha</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResources.map((resource) => (
                                        <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{resource.typeIcon}</span>
                                                    <span className="text-sm font-medium text-gray-900">{resource.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">{resource.client}</td>
                                            <td className="px-4 py-3 border-b border-gray-100">
                                                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{resource.category}</span>
                                            </td>
                                            <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">{resource.type}</td>
                                            <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-500">{resource.size}</td>
                                            <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-500">{resource.uploadDate}</td>
                                            <td className="px-4 py-3 border-b border-gray-100">
                                                <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-all">
                                                    Descargar
                                                </button>
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
