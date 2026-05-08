"use client";
import { useState } from "react";
import { supabase } from "./utils/supabase/client";

export default function TaskForm() {
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
    const { data, error } = await supabase.from("tareas").select("*")

    if (error) {
      console.log("Error: ", error)
      return
    }

    console.log(data)

    // const { data, error } = await createClient
    //   .from('tareas')
    //   .insert({
    //     titulo: formData.titulo,
    //     descripcion: formData.descripcion,
    //   })

    // Reset del formulario
    setFormData({
      title: "",
      description: "",
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