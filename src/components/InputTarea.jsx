"use client";
import { supabase } from "@/app/utils/supabase/client";
import { useTareasStorage } from "@/store/useTareasStorage";
import { useState } from "react";

export default function InputTarea() {
    const { insertarTarea } = useTareasStorage()
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
        // En la base de datos ya está metida la tarea
        const { data, error } = await supabase.from("tareas").insert({
            titulo: formData.titulo,
            descripcion: formData.descripcion
        }).select()

        if (error) {
            console.log("Error: ", error)
            return
        }
        
        insertarTarea(data[0])


        // Reset del formulario
        setFormData({
            titulo: "",
            descripcion: "",
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                </label>

                <input
                    type="text"
                    name="titulo"
                    placeholder="Ej: Terminar proyecto"
                    value={formData.titulo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>

                <textarea
                    name="descripcion"
                    placeholder="Describe la tarea..."
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition"
            >
                Añadir tarea
            </button>
        </form>
    )
}