'use client'

import AdminPlansEditor from '@/components/AdminPlansEditor'

export default function AdminPlansPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Planes
                </h1>
                {/* Aquí podríamos agregar un botón para "Crear Plan" en el futuro */}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Estos son los planes actualmente visibles para los usuarios.
                </p>

                {/* Reutilizamos el componente PlansSection por ahora para visualizar */}
                <AdminPlansEditor />
            </div>
        </div>
    )
}
