"use client"
import { supabase } from "@/app/utils/supabase/client"
import { useEffect, useState } from "react"

export default function Tareas() {
    const [tareas, setTareas] = useState([])

    useEffect(() => {
        const fetchTareas = async () => {
            console.log("FETCH INICIADO")

            const { data, error } = await supabase.from("tareas").select("*")

            console.log("RESPUESTA COMPLETA:", { data, error })

            console.log("DATA:", data)
            setTareas(data)
        }

        fetchTareas()
    }, [])

    return (
        <section>
            <h1>Tareas</h1>

            {tareas.length > 0 ? (
                tareas.map((t, i) => (
                    <article key={i}>
                        {t.titulo} - {t.descripcion}
                    </article>
                ))
            ) : (
                <h2>No hay tareas...</h2>
            )}
        </section>
    )
}