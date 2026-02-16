'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

type ResourceCategory = 'all' | 'input' | 'output' | 'reference'

interface ResourceItem {
    id: string
    project_id: string
    uploaded_by: string
    file_name: string
    file_url: string
    file_type: string | null
    file_size: number | null
    category: 'input' | 'output' | 'reference'
    uploaded_at: string
    project_title: string
}

interface ResourceStats {
    total: number
    totalSize: number
    byCategory: {
        input: number
        output: number
        reference: number
    }
}

interface ProjectOption {
    id: string
    title: string
}

const categoryLabels: Record<string, string> = {
    all: 'Todos',
    input: 'Inputs',
    output: 'Entregas',
    reference: 'Referencias',
}

const categoryColors: Record<string, string> = {
    input: 'bg-blue-100 text-blue-700',
    output: 'bg-green-100 text-green-700',
    reference: 'bg-purple-100 text-purple-700',
}

const categoryIcons: Record<string, string> = {
    input: '📥',
    output: '📤',
    reference: '📌',
}

function formatFileSize(bytes: number | null): string {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || ''
    const icons: Record<string, string> = {
        jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️',
        pdf: '📕', doc: '📝', docx: '📝', txt: '📝',
        psd: '🎨', ai: '🎨', fig: '🎨', sketch: '🎨',
        mp4: '🎬', mov: '🎬', avi: '🎬', webm: '🎬',
        zip: '📦', rar: '📦', '7z': '📦',
    }
    return icons[ext] || '📄'
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DesignerResourcesPage() {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Diseñador'
    const [resources, setResources] = useState<ResourceItem[]>([])
    const [projects, setProjects] = useState<ProjectOption[]>([])
    const [stats, setStats] = useState<ResourceStats>({ total: 0, totalSize: 0, byCategory: { input: 0, output: 0, reference: 0 } })
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<ResourceCategory>('all')
    const [search, setSearch] = useState('')
    const [selectedProject, setSelectedProject] = useState<string>('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const fetchResources = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (activeCategory !== 'all') params.set('category', activeCategory)
            if (search) params.set('search', search)
            if (selectedProject) params.set('projectId', selectedProject)

            const res = await fetch(`/api/designer/resources?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setResources(data.resources || [])
                setProjects(data.projects || [])
                setStats(data.stats || { total: 0, totalSize: 0, byCategory: { input: 0, output: 0, reference: 0 } })
            }
        } catch (err) {
            console.error('Error fetching resources:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchResources()
    }, [activeCategory, search, selectedProject])

    const categories: ResourceCategory[] = ['all', 'input', 'output', 'reference']

    return (
        <div className="flex min-h-screen">
            <Sidebar role="diseñador" userName={userName} userRole="Diseñador Senior" />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Recursos de Clientes
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Archivos y assets de tus proyectos asignados
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        <div className="card p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-800 rounded-xl flex items-center justify-center text-white text-xl">📁</div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                                    <div className="text-sm text-gray-500">Total</div>
                                </div>
                            </div>
                        </div>
                        <div className="card p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📥</div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.byCategory.input}</div>
                                    <div className="text-sm text-gray-500">Inputs</div>
                                </div>
                            </div>
                        </div>
                        <div className="card p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">📤</div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.byCategory.output}</div>
                                    <div className="text-sm text-gray-500">Entregas</div>
                                </div>
                            </div>
                        </div>
                        <div className="card p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">📌</div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.byCategory.reference}</div>
                                    <div className="text-sm text-gray-500">Refs</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters + Search Bar */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                                            ${activeCategory === cat
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {categoryLabels[cat]}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    className="input py-2 w-48 text-sm"
                                >
                                    <option value="">Todos los proyectos</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="input pr-10 w-56 py-2 text-sm"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                </div>

                                <div className="flex bg-gray-100 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                        title="Vista de grilla"
                                    >
                                        ▦
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                        title="Vista de lista"
                                    >
                                        ☰
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="card text-center py-20">
                            <div className="text-4xl animate-spin mb-3">⏳</div>
                            <p className="text-gray-500">Cargando recursos...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && resources.length === 0 && (
                        <div className="card text-center py-20">
                            <div className="text-6xl mb-4">🗂️</div>
                            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                                Sin recursos encontrados
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {search || selectedProject || activeCategory !== 'all'
                                    ? 'No hay archivos que coincidan con tus filtros.'
                                    : 'Aún no hay recursos subidos en tus proyectos asignados.'
                                }
                            </p>
                        </div>
                    )}

                    {/* Grid View */}
                    {!loading && resources.length > 0 && viewMode === 'grid' && (
                        <div className="grid grid-cols-4 gap-5">
                            {resources.map(resource => (
                                <div key={resource.id} className="card p-0 overflow-hidden group hover:shadow-md transition-all">
                                    <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                                        <span className="text-5xl">{getFileIcon(resource.file_name)}</span>
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {resource.file_url && (
                                                <a
                                                    href={resource.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm hover:bg-blue-700 transition-all shadow-md"
                                                    title="Descargar"
                                                >
                                                    ⬇
                                                </a>
                                            )}
                                        </div>
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-semibold ${categoryColors[resource.category]}`}>
                                                {categoryIcons[resource.category]} {categoryLabels[resource.category]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="font-semibold text-gray-900 text-sm truncate mb-1" title={resource.file_name}>
                                            {resource.file_name}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate mb-2" title={resource.project_title}>
                                            📁 {resource.project_title}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{formatFileSize(resource.file_size)}</span>
                                            <span>{formatDate(resource.uploaded_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* List View */}
                    {!loading && resources.length > 0 && viewMode === 'list' && (
                        <div className="card p-0 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Archivo</th>
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Proyecto</th>
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</th>
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tamaño</th>
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                                        <th className="text-right py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resources.map(resource => (
                                        <tr key={resource.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{getFileIcon(resource.file_name)}</span>
                                                    <span className="font-medium text-sm text-gray-900 truncate max-w-[200px]" title={resource.file_name}>
                                                        {resource.file_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-5 text-sm text-gray-600 truncate max-w-[180px]" title={resource.project_title}>
                                                {resource.project_title}
                                            </td>
                                            <td className="py-3 px-5">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${categoryColors[resource.category]}`}>
                                                    {categoryLabels[resource.category]}
                                                </span>
                                            </td>
                                            <td className="py-3 px-5 text-sm text-gray-500">
                                                {formatFileSize(resource.file_size)}
                                            </td>
                                            <td className="py-3 px-5 text-sm text-gray-500">
                                                {formatDate(resource.uploaded_at)}
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                {resource.file_url && (
                                                    <a
                                                        href={resource.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-blue-50 hover:bg-blue-100 transition-all inline-block"
                                                    >
                                                        Descargar
                                                    </a>
                                                )}
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
