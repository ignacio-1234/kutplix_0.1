'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/auth-context'

type ContentType = 'static' | 'reel' | 'story' | 'carousel'
type Priority = 'low' | 'medium' | 'high' | 'urgent'

interface FileItem {
    name: string
    size: string
}

const contentTypes: { id: ContentType; icon: string; name: string; desc: string }[] = [
    { id: 'static', icon: '🖼️', name: 'Imagen Estática', desc: 'Post individual' },
    { id: 'reel', icon: '🎬', name: 'Reel', desc: 'Video corto' },
    { id: 'story', icon: '📱', name: 'Historia', desc: 'Story vertical' },
    { id: 'carousel', icon: '📊', name: 'Carrusel', desc: 'Múltiples slides' },
]

const priorities: { id: Priority; label: string }[] = [
    { id: 'low', label: 'Baja' },
    { id: 'medium', label: 'Media' },
    { id: 'high', label: 'Alta' },
    { id: 'urgent', label: 'Urgente' },
]

const priorityColorMap: Record<Priority, string> = {
    low: 'border-green-500 bg-green-50/50',
    medium: 'border-primary bg-blue-50/50',
    high: 'border-orange-500 bg-orange-50/50',
    urgent: 'border-red-500 bg-red-50/50',
}

export default function NuevaSolicitudPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedType, setSelectedType] = useState<ContentType>('static')
    const [selectedPriority, setSelectedPriority] = useState<Priority>('medium')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [notes, setNotes] = useState('')
    const [files, setFiles] = useState<FileItem[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const steps = [
        { num: 1, label: 'Detalles' },
        { num: 2, label: 'Recursos' },
        { num: 3, label: 'Confirmación' },
    ]

    const nextStep = () => {
        if (currentStep === 1 && !title.trim()) {
            setSubmitError('Por favor, ingresa un título para el proyecto')
            return
        }
        setSubmitError('')
        if (currentStep < 3) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        setSubmitError('')
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files
        if (selectedFiles) {
            const newFiles: FileItem[] = Array.from(selectedFiles).map(f => ({
                name: f.name,
                size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
            }))
            setFiles([...files, ...newFiles])
        }
    }

    const submitForm = async () => {
        setIsSubmitting(true)
        setSubmitError('')

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    content_type: selectedType,
                    priority: selectedPriority,
                    deadline: deadline || null,
                    notes: notes.trim() || null,
                    files: files.map(f => ({ name: f.name, size: f.size })),
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Error al crear el proyecto')
            }

            setSubmitSuccess(true)

            // Redirect to projects list after 2 seconds
            setTimeout(() => {
                router.push('/dashboard/cliente/proyectos')
            }, 2000)
        } catch (error: any) {
            setSubmitError(error.message || 'Error al crear el proyecto')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getContentTypeName = () => contentTypes.find(t => t.id === selectedType)
    const getPriorityLabel = () => priorities.find(p => p.id === selectedPriority)?.label

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente'

    if (submitSuccess) {
        return (
            <div className="flex min-h-screen">
                <Sidebar role="cliente" userName={userName} userRole="Cliente" />
                <main className="flex-1 ml-72 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
                            ✅
                        </div>
                        <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
                            ¡Solicitud Creada!
                        </h2>
                        <p className="text-gray-500 text-lg mb-2">
                            Tu proyecto ha sido enviado exitosamente
                        </p>
                        <p className="text-gray-400 text-sm">
                            Redirigiendo a tus proyectos...
                        </p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar
                role="cliente"
                userName={userName}
                userRole="Cliente"
            />

            <main className="flex-1 ml-72">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-10 py-5 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-gray-900">
                                Nueva Solicitud
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Crea un nuevo proyecto de diseño
                            </p>
                        </div>
                        <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                            <span className="text-lg">🔔</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-10">
                    <div className="max-w-[900px] mx-auto">
                        {/* Page Title */}
                        <div className="text-center mb-10">
                            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                                Nueva Solicitud de Diseño
                            </h1>
                            <p className="text-gray-500">
                                Completa los detalles para crear tu proyecto
                            </p>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center justify-center gap-3 mb-12 px-20">
                            {steps.map((step, i) => (
                                <div key={step.num} className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 transition-all duration-300
                                        ${currentStep === step.num
                                                ? 'bg-gradient-to-br from-primary to-blue-800 text-white shadow-lg shadow-primary/30'
                                                : currentStep > step.num
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {currentStep > step.num ? '✓' : step.num}
                                    </div>
                                    <span
                                        className={`text-sm font-semibold transition-colors
                                        ${currentStep === step.num ? 'text-primary' : 'text-gray-500'}`}
                                    >
                                        {step.label}
                                    </span>
                                    {i < steps.length - 1 && (
                                        <div
                                            className={`absolute top-6 left-1/2 w-full h-0.5 z-0 transition-colors
                                            ${currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Error message */}
                        {submitError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
                                <span>⚠️</span> {submitError}
                            </div>
                        )}

                        {/* Form Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 mb-6">

                            {/* Step 1: Detalles */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                                        Detalles del Proyecto
                                    </h2>
                                    <p className="text-gray-500 mb-8">
                                        Describe qué necesitas para este proyecto
                                    </p>

                                    {/* Título */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Título del Proyecto <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Ej: Campaña Redes Sociales – Marzo"
                                            className="input"
                                        />
                                    </div>

                                    {/* Tipo de Contenido */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Tipo de Contenido
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {contentTypes.map((type) => (
                                                <div
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all text-center
                                                    ${selectedType === type.id
                                                            ? 'border-primary bg-primary/5 shadow-sm ring-4 ring-primary/10'
                                                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="text-5xl mb-3">{type.icon}</div>
                                                    <div className="font-semibold text-gray-900">{type.name}</div>
                                                    <div className="text-sm text-gray-500">{type.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Descripción / Briefing
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe tu proyecto: objetivo, público objetivo, mensaje principal, colores preferidos, etc."
                                            className="input min-h-[120px] resize-y"
                                        />
                                    </div>

                                    {/* Fecha y Prioridad */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Fecha de Entrega
                                            </label>
                                            <input
                                                type="date"
                                                value={deadline}
                                                onChange={(e) => setDeadline(e.target.value)}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Prioridad
                                            </label>
                                            <div className="grid grid-cols-4 gap-3">
                                                {priorities.map((p) => (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => setSelectedPriority(p.id)}
                                                        className={`py-3 px-2 rounded-xl border-2 cursor-pointer transition-all text-center text-sm font-semibold
                                                        ${selectedPriority === p.id
                                                                ? priorityColorMap[p.id]
                                                                : 'border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {p.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Recursos */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                                        Subir Recursos
                                    </h2>
                                    <p className="text-gray-500 mb-8">
                                        Agrega logos, fotos, documentos de marca y otros archivos necesarios
                                    </p>

                                    {/* File Upload */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Archivos <span className="font-normal text-gray-500">(Opcional)</span>
                                        </label>
                                        <label
                                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                                            onDragLeave={() => setIsDragOver(false)}
                                            onDrop={(e) => { e.preventDefault(); setIsDragOver(false) }}
                                            className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                                            ${isDragOver
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="text-5xl mb-4">📤</div>
                                            <div className="text-gray-900 mb-2">
                                                Arrastra tus archivos aquí o haz clic para buscar
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Máximo 50MB por archivo • JPG, PNG, PDF, AI, PSD
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleFileSelect}
                                                accept=".jpg,.jpeg,.png,.pdf,.ai,.psd,.zip"
                                            />
                                        </label>

                                        {/* File List */}
                                        {files.length > 0 && (
                                            <div className="mt-5 space-y-2">
                                                {files.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-lg">
                                                            📄
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm font-semibold text-gray-900">{file.name}</div>
                                                            <div className="text-xs text-gray-500">{file.size}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFile(index)}
                                                            className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-lg"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Notas Adicionales */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Notas Adicionales <span className="font-normal text-gray-500">(Opcional)</span>
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Instrucciones especiales, referencias, inspiración, etc."
                                            className="input min-h-[120px] resize-y"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Confirmación */}
                            {currentStep === 3 && (
                                <div>
                                    <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                                        Revisa y Confirma
                                    </h2>
                                    <p className="text-gray-500 mb-8">
                                        Verifica que toda la información sea correcta antes de enviar
                                    </p>

                                    <div className="space-y-5">
                                        {/* Título */}
                                        <div className="p-5 bg-gray-50 rounded-xl">
                                            <div className="text-sm text-gray-500 mb-1">Título del Proyecto</div>
                                            <div className="font-semibold text-gray-900">
                                                {title || 'Sin título'}
                                            </div>
                                        </div>

                                        {/* Tipo + Prioridad */}
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="p-5 bg-gray-50 rounded-xl">
                                                <div className="text-sm text-gray-500 mb-1">Tipo de Contenido</div>
                                                <div className="font-semibold text-gray-900">
                                                    {getContentTypeName()?.icon} {getContentTypeName()?.name}
                                                </div>
                                            </div>
                                            <div className="p-5 bg-gray-50 rounded-xl">
                                                <div className="text-sm text-gray-500 mb-1">Prioridad</div>
                                                <div className="font-semibold text-gray-900">
                                                    ⚡ {getPriorityLabel()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Descripción */}
                                        {description && (
                                            <div className="p-5 bg-gray-50 rounded-xl">
                                                <div className="text-sm text-gray-500 mb-1">Descripción</div>
                                                <div className="font-semibold text-gray-900">
                                                    {description}
                                                </div>
                                            </div>
                                        )}

                                        {/* Fecha + Revisiones */}
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="p-5 bg-gray-50 rounded-xl">
                                                <div className="text-sm text-gray-500 mb-1">Fecha de Entrega</div>
                                                <div className="font-semibold text-gray-900">
                                                    📅 {deadline || 'Sin fecha definida'}
                                                </div>
                                            </div>
                                            <div className="p-5 bg-gray-50 rounded-xl">
                                                <div className="text-sm text-gray-500 mb-1">Revisiones Disponibles</div>
                                                <div className="font-semibold text-gray-900">
                                                    2 revisiones incluidas
                                                </div>
                                            </div>
                                        </div>

                                        {/* Archivos */}
                                        <div className="p-5 bg-gray-50 rounded-xl">
                                            <div className="text-sm text-gray-500 mb-2">Archivos Adjuntos</div>
                                            <div className="flex flex-wrap gap-2">
                                                {files.map((file, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900"
                                                    >
                                                        📄 {file.name}
                                                    </span>
                                                ))}
                                                {files.length === 0 && (
                                                    <span className="text-sm text-gray-500">Sin archivos adjuntos</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info Box */}
                                        <div className="p-5 bg-primary/5 rounded-xl border-l-4 border-primary">
                                            <strong className="block mb-2">ℹ️ Información importante:</strong>
                                            <p className="text-sm text-gray-600">
                                                Una vez enviado el proyecto, un diseñador será asignado automáticamente.
                                                Recibirás una notificación cuando tu proyecto sea aceptado y comenzará el proceso de diseño.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-3 mt-8 pt-8 border-t border-gray-200">
                                {currentStep > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="btn-secondary"
                                        disabled={isSubmitting}
                                    >
                                        ← Anterior
                                    </button>
                                )}

                                {currentStep < 3 && (
                                    <button
                                        onClick={nextStep}
                                        className="btn-primary flex-1"
                                    >
                                        Siguiente →
                                    </button>
                                )}

                                {currentStep === 3 && (
                                    <button
                                        onClick={submitForm}
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="animate-spin">⏳</span>
                                                Creando...
                                            </>
                                        ) : (
                                            <>✓ Crear Solicitud</>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
