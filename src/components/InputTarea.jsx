"use client";
import { supabase } from "@/app/utils/supabase/client";
import { useState } from "react";

export default function InputTarea() {
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Aquí puedes enviar la tarea a una API o estado global
        console.log("Nueva tarea:", formData);
        const { error } = await supabase.from("tareas").insert({
            titulo: formData.titulo,
            descripcion: formData.descripcion
        })

        if (error) {
            console.log("Error: ", error)
            return
        }

        // Reset del formulario
        setFormData({
            titulo: "",
            descripcion: "",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
            <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formData.titulo}
                onChange={handleChange}
                className="border p-2 rounded"
                required
            />

            <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                className="border p-2 rounded"
                rows={4}
                required
            />

            <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                Añadir tarea
            </button>
        </form>
    );
}