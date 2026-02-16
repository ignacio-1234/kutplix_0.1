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

import { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/auth-context'

type ResourceCategory = 'all' | 'input' | 'output' | 'reference'
type UploadCategory = 'input' | 'output' | 'reference'

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

export default function RecursosPage() {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'
    const [resources, setResources] = useState<ResourceItem[]>([])
    const [stats, setStats] = useState<ResourceStats>({ total: 0, totalSize: 0, byCategory: { input: 0, output: 0, reference: 0 } })
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<ResourceCategory>('all')
    const [search, setSearch] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Upload state
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [uploadFiles, setUploadFiles] = useState<File[]>([])
    const [uploadCategory, setUploadCategory] = useState<UploadCategory>('reference')
    const [uploadProjectId, setUploadProjectId] = useState<string>('')
    const [projects, setProjects] = useState<ProjectOption[]>([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<Record<string, 'pending' | 'uploading' | 'done' | 'error'>>({})
    const [uploadError, setUploadError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    const fetchResources = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (activeCategory !== 'all') params.set('category', activeCategory)
            if (search) params.set('search', search)
            const res = await fetch(`/api/client/resources?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setResources(data.resources || [])
                setStats(data.stats || { total: 0, totalSize: 0, byCategory: { input: 0, output: 0, reference: 0 } })
            }
        } catch (err) {
            console.error('Error fetching resources:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects?limit=100&sortBy=created_at&sortOrder=desc')
            if (res.ok) {
                const data = await res.json()
                setProjects((data.projects || []).map((p: any) => ({ id: p.id, title: p.title })))
            }
        } catch (err) {
            console.error('Error fetching projects:', err)
        }
    }

    useEffect(() => {
        fetchResources()
    }, [activeCategory, search])

    useEffect(() => {
        if (showUploadModal) {
            fetchProjects()
        }
    }, [showUploadModal])

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este recurso?')) return
        try {
            const res = await fetch(`/api/client/resources?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchResources()
            }
        } catch (err) {
            console.error('Error deleting resource:', err)
        }
    }

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const files = Array.from(e.dataTransfer.files)
        setUploadFiles(prev => [...prev, ...files])
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadFiles(prev => [...prev, ...Array.from(e.target.files!)])
        }
        // Reset input value so the same file can be selected again
        e.target.value = ''
    }

    const removeUploadFile = (index: number) => {
        setUploadFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (uploadFiles.length === 0) {
            setUploadError('Selecciona al menos un archivo')
            return
        }
        setUploading(true)
        setUploadError('')

        const progress: Record<string, 'pending' | 'uploading' | 'done' | 'error'> = {}
        uploadFiles.forEach((f, i) => { progress[`${i}-${f.name}`] = 'pending' })
        setUploadProgress({ ...progress })

        let hasError = false

        for (let i = 0; i < uploadFiles.length; i++) {
            const file = uploadFiles[i]
            const key = `${i}-${file.name}`
            progress[key] = 'uploading'
            setUploadProgress({ ...progress })

            try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('category', uploadCategory)
                if (uploadProjectId) {
                    formData.append('project_id', uploadProjectId)
                }

                const res = await fetch('/api/client/resources/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Error al subir')
                }

                progress[key] = 'done'
            } catch (err: any) {
                progress[key] = 'error'
                hasError = true
                setUploadError(err.message || 'Error al subir archivo')
            }
            setUploadProgress({ ...progress })
        }

        setUploading(false)

        if (!hasError) {
            // Success: close modal and refresh
            setTimeout(() => {
                setShowUploadModal(false)
                setUploadFiles([])
                setUploadProgress({})
                setUploadCategory('reference')
                setUploadProjectId('')
                fetchResources()
            }, 1000)
        }
    }

    const closeUploadModal = () => {
        if (uploading) return
        setShowUploadModal(false)
        setUploadFiles([])
        setUploadProgress({})
        setUploadError('')
        setUploadCategory('reference')
        setUploadProjectId('')
    }

    const categories: ResourceCategory[] = ['all', 'input', 'output', 'reference']

    return (
        <div className="flex min-h-screen">
            <Sidebar role="cliente" userName={userName} userRole="Cliente" />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Biblioteca de Recursos
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Gestiona tus archivos de marca y recursos
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <span>📤</span> Subir Recursos
                            </button>
                            <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                                <span className="text-lg">🔔</span>
                            </button>
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
                                    <div className="text-sm text-gray-500">Total Archivos</div>
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
                                    <div className="text-sm text-gray-500">Referencias</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters + Search Bar */}
                    <div className="flex items-center justify-between mb-6">
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
                                    {cat !== 'all' && (
                                        <span className="ml-1.5 opacity-70">
                                            ({stats.byCategory[cat as keyof typeof stats.byCategory] || 0})
                                        </span>
                                    )}
                                </button>
                            ))}

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

                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="input pr-10 w-64"
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
                                Sin recursos aún
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {activeCategory !== 'all' || search
                                    ? 'No se encontraron archivos con los filtros actuales.'
                                    : 'Sube logos, guías de marca, paletas de colores y otros archivos que tus diseñadores necesitarán.'
                                }
                            </p>
                            {activeCategory !== 'all' || search ? (
                                <button
                                    onClick={() => { setActiveCategory('all'); setSearch('') }}
                                    className="btn-secondary"
                                >
                                    Limpiar filtros
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="btn-primary flex items-center gap-2 mx-auto"
                                >
                                    <span>📤</span> Subir Primer Recurso
                                </button>
                            )}
                        </div>
                    )}

                    {/* Grid View */}
                    {!loading && resources.length > 0 && viewMode === 'grid' && (
                        <div className="grid grid-cols-3 gap-5">
                            {resources.map(resource => (
                                <div key={resource.id} className="card p-0 overflow-hidden group hover:shadow-md transition-all">
                                    <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                                        <span className="text-5xl">{getFileIcon(resource.file_name)}</span>
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            {resource.file_url && (
                                                <a
                                                    href={resource.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm hover:bg-blue-700 transition-all"
                                                    title="Descargar"
                                                >
                                                    ⬇
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(resource.id)}
                                                className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600 transition-all"
                                                title="Eliminar"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${categoryColors[resource.category]}`}>
                                                {categoryIcons[resource.category]} {categoryLabels[resource.category]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
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
                                                <div className="flex items-center justify-end gap-2">
                                                    {resource.file_url && (
                                                        <a
                                                            href={resource.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-blue-50 hover:bg-blue-100 transition-all"
                                                        >
                                                            Descargar
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(resource.id)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                                                    >
                                                        Eliminar
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>


                    {/* Total size footer */}
                    {!loading && stats.total > 0 && (
                        <div className="mt-6 text-sm text-gray-500 text-center">
                            {resources.length} archivo{resources.length !== 1 ? 's' : ''} mostrado{resources.length !== 1 ? 's' : ''} • Almacenamiento total: {formatFileSize(stats.totalSize)}
                        </div>
                    )}
                </div>

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeUploadModal}>
                        <div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div>
                                    <h3 className="font-display text-xl font-semibold text-gray-900">
                                        Subir Recursos
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Sube logos, guías de marca, paletas de colores y más
                                    </p>
                                </div>
                                <button
                                    onClick={closeUploadModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all text-gray-500"
                                    disabled={uploading}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Category Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Categoría
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['input', 'output', 'reference'] as UploadCategory[]).map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setUploadCategory(cat)}
                                                disabled={uploading}
                                                className={`p-3 rounded-xl border-2 text-center transition-all
                                                    ${uploadCategory === cat
                                                        ? 'border-primary bg-primary/5 shadow-sm'
                                                        : 'border-gray-200 hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{categoryIcons[cat]}</div>
                                                <div className="text-sm font-semibold text-gray-900">{categoryLabels[cat]}</div>
                                                <div className="text-xs text-gray-500">
                                                    {cat === 'input' && 'Logos, fotos, brand'}
                                                    {cat === 'output' && 'Archivos finales'}
                                                    {cat === 'reference' && 'Paletas, guías'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Project Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Asociar a Proyecto <span className="font-normal text-gray-500">(opcional)</span>
                                    </label>
                                    <select
                                        value={uploadProjectId}
                                        onChange={e => setUploadProjectId(e.target.value)}
                                        className="input"
                                        disabled={uploading}
                                    >
                                        <option value="">Proyecto más reciente</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Drop Zone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Archivos
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                                        onDragLeave={() => setIsDragOver(false)}
                                        onDrop={handleFileDrop}
                                        className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                            ${isDragOver
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                                            }
                                            ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                                    >
                                        <div className="text-4xl mb-3">📤</div>
                                        <div className="text-gray-900 font-medium mb-1">
                                            Arrastra archivos aquí o haz clic para buscar
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Máximo 50MB por archivo • JPG, PNG, PDF, AI, PSD, SVG, ZIP
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleFileSelect}
                                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.ai,.psd,.doc,.docx,.txt,.zip,.rar,.7z,.fig,.sketch,.mp4,.mov"
                                            disabled={uploading}
                                        />
                                    </div>
                                </div>

                                {/* File List */}
                                {uploadFiles.length > 0 && (
                                    <div className="space-y-2">
                                        {uploadFiles.map((file, index) => {
                                            const key = `${index}-${file.name}`
                                            const status = uploadProgress[key]
                                            return (
                                                <div
                                                    key={key}
                                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all
                                                        ${status === 'done' ? 'bg-green-50 border border-green-200' :
                                                            status === 'error' ? 'bg-red-50 border border-red-200' :
                                                                status === 'uploading' ? 'bg-blue-50 border border-blue-200' :
                                                                    'bg-gray-50'}`}
                                                >
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-100">
                                                        {status === 'done' ? '✅' :
                                                            status === 'error' ? '❌' :
                                                                status === 'uploading' ? <span className="animate-spin">⏳</span> :
                                                                    getFileIcon(file.name)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatFileSize(file.size)}
                                                            {status === 'uploading' && ' — Subiendo...'}
                                                            {status === 'done' && ' — ✓ Subido'}
                                                            {status === 'error' && ' — Error'}
                                                        </div>
                                                    </div>
                                                    {!uploading && (
                                                        <button
                                                            onClick={() => removeUploadFile(index)}
                                                            className="w-7 h-7 rounded-md bg-gray-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-sm flex-shrink-0"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Upload Error */}
                                {uploadError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                                        <span>⚠️</span> {uploadError}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                                <div className="text-sm text-gray-500">
                                    {uploadFiles.length > 0 && (
                                        <>{uploadFiles.length} archivo{uploadFiles.length !== 1 ? 's' : ''} seleccionado{uploadFiles.length !== 1 ? 's' : ''}</>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={closeUploadModal}
                                        className="btn-secondary"
                                        disabled={uploading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading || uploadFiles.length === 0}
                                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? (
                                            <><span className="animate-spin">⏳</span> Subiendo...</>
                                        ) : (
                                            <><span>📤</span> Subir {uploadFiles.length > 0 ? `(${uploadFiles.length})` : ''}</>
                                        )}
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
