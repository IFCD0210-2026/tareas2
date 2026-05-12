"use client"
import { useTareasStorage } from "@/store/useTareasStorage"
import { useEffect } from "react"

export default function Tareas() {


    const { tareas, loading, fetchTareas, eliminarTarea } = useTareasStorage()

    useEffect(() => {
        fetchTareas()
    }, [])

    if (loading) return <p>Cargando...</p>

    return (
        <section className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Tareas
            </h1>

            {tareas.length > 0 ? (
                <div className="space-y-4">
                    {tareas.map((t, i) => (
                        <article
                            key={i}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {t.titulo}
                                    </h2>

                                    <p className="text-gray-600 mt-1">
                                        {t.descripcion}
                                    </p>
                                </div>

                                <button
                                    // onClick={() => eliminarTarea(t.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Eliminar
                                </button>
                                {/* <button
                                    onClick={() => editarTarea(t.id)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Editar
                                </button> */}
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-100 border border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <h2 className="text-gray-500 text-lg">
                        No hay tareas...
                    </h2>
                </div>
            )}
        </section>
    )
}