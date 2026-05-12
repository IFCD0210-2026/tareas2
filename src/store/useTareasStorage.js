// import { supabase } from "@/app/utils/supabase/client";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useTareasStorage = create(persist(set => ({
//     tareas: [],
//     loading: false,

//     fetchTareas: async () => {
//         set({ loading: true })

//         const { data, error } = await supabase
//             .from('tareas')
//             .select('*')


//         if (error) {
//             console.error(error)
//             set({ loading: false })
//             return
//         }

//         set({
//             tareas: data,
//             loading: false,
//         })
//     },

//     insertarTarea: (nuevaTarea) => {
//         set(state => ({
//             tareas: [...state.tareas, nuevaTarea]
//         }))
//     },

//     eliminarTarea: async (tareaId) => {
//         const { error } = await supabase
//             .from("tareas")
//             .delete().eq("id", tareaId)

//         if (error) {
//             console.error(error)
//             set({ loading: false })
//             return
//         }

//         set(state => ({
//             tareas: state.tareas.filter(t => t.id !== tareaId)
//         }))
//     }
// })),
//     { name: "tareas" }
// )

import { supabase } from "@/app/utils/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTareasStorage = create(persist(set => ({
    tareas: [],
    loading: false,
    fetchTareas: async () => {
        set({ loading: true })

        const { data, error } = await supabase.from("tareas").select("*")
        if (error) {
            console.error(error)
            set({ loading: false })
            return
        }
        set({
            loading: false,
            tareas: data
        })
    },
    insertarTarea: (nuevaTarea) => {
        set(state => ({
            tareas: [...state.tareas, nuevaTarea]
        }))
    },
    eliminarTarea: async (tareaId) => {
        set({ loading: true })
        const { error } = await supabase.from("tareas").delete().eq("id", tareaId)
        if (error) {
            console.error(error)
            set({ loading: false })
            return
        }
        set(
            state => ({
                tareas: state.tareas.filter(t => t.id !== tareaId),
                loading: false
            })
        )
    },
    editarTarea: async (nuevaTarea) => {
        set({ loading: true })
        const { error } = await supabase
            .from("tareas")
            .update({
                titulo: nuevaTarea.titulo,
                descripcion: nuevaTarea.descripcion
            })
            .eq("id", nuevaTarea.id)

        if (error) {
            console.error(error)
            set({ loading: false })
            return
        }

        set(state => ({
            loading: false,
            tareas: state.tareas.map(t => t.id === nuevaTarea.id ? nuevaTarea : t)
        }))

    }
}),
    { name: "tareas" }
))