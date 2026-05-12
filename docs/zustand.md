# Zustand — Gestión de estado global

## ¿Qué problema resuelve?

En React, el estado vive dentro de componentes. Si dos componentes necesitan los mismos datos, tienes que subirlo al padre común ("lifting state up") y pasarlo por props. Cuando la app crece, esto se vuelve un lío.

Zustand crea un **store global** fuera del árbol de componentes. Cualquier componente puede leer o modificar ese estado sin necesidad de props ni contexto.

---

## Crear un store

```js
// src/store/useTareasStorage.js
import { create } from "zustand";

export const useTareasStorage = create((set) => ({
    // Estado inicial
    tareas: [],
    loading: false,

    // Acciones
    fetchTareas: async () => { /* ... */ },
    insertarTarea: (nuevaTarea) => { /* ... */ },
}));
```

`create()` recibe una función que devuelve un objeto con:
- **Estado**: los datos que quieres compartir (`tareas`, `loading`).
- **Acciones**: funciones que modifican ese estado.

La función recibe `set` como argumento, que es lo que usas para actualizar el estado.

---

## Leer y modificar estado desde un componente

```js
// En cualquier componente
const { tareas, loading, fetchTareas } = useTareasStorage();
```

Solo desestructuras lo que necesitas. El componente solo se re-renderiza cuando cambia algo de lo que está usando.

---

## La función `set`

`set` fusiona lo que le pases con el estado actual (como `setState` en clases, pero más sencillo).

**Actualización simple:**
```js
set({ loading: true })
// El resto del estado (tareas, etc.) queda intacto
```

**Actualización basada en el estado anterior:**
```js
set(state => ({
    tareas: [...state.tareas, nuevaTarea]
}))
// Recibes el estado actual como argumento y devuelves el nuevo
```

Cuando necesitas leer el estado actual para calcular el siguiente valor, usas la forma con función.

---

## Acciones asíncronas

Zustand no tiene nada especial para async/await. Simplemente funciona:

```js
fetchTareas: async () => {
    set({ loading: true })                          // 1. Activa el spinner

    const { data, error } = await supabase          // 2. Espera a la BD
        .from("tareas")
        .select("*")

    if (error) {
        console.error(error)
        set({ loading: false })
        return
    }

    set({ loading: false, tareas: data })           // 3. Guarda los datos
},
```

El patrón `loading: true` → petición → `loading: false` es estándar para saber cuándo mostrar un spinner.

---

## Middleware `persist`

Por defecto, si recargas la página, el store vuelve a su estado inicial. El middleware `persist` guarda automáticamente el estado en `localStorage`.

```js
import { persist } from "zustand/middleware";

export const useTareasStorage = create(
    persist(
        (set) => ({
            tareas: [],
            // ...
        }),
        { name: "tareas" }  // clave en localStorage
    )
);
```

`persist` envuelve la función del store. El objeto `{ name: "tareas" }` indica bajo qué clave se guarda en `localStorage`. Puedes verificarlo en DevTools → Application → Local Storage.

> **Ojo:** En este proyecto, los datos también vienen de Supabase al cargar. El `persist` aquí funciona como caché temporal entre recargas.

---

## Flujo completo en este proyecto

```
Componente monta
    → useEffect llama fetchTareas()
    → set({ loading: true })           → UI muestra "Cargando..."
    → supabase.select("*")             → petición a la BD
    → set({ tareas: data, loading: false }) → UI muestra las tareas
```

```
Usuario envía el formulario (InputTarea)
    → supabase.insert(...)             → guarda en la BD
    → insertarTarea(data[0])           → añade al store local
    → UI se actualiza instantáneamente (sin recargar)
```

---

## Resumen rápido

| Concepto | Qué hace |
|---|---|
| `create(set => ({...}))` | Define el store con estado y acciones |
| `set({ clave: valor })` | Actualiza parte del estado |
| `set(state => ({...}))` | Actualiza basándose en el estado anterior |
| `useTareasStorage()` | Hook para usar el store en un componente |
| `persist(...)` | Guarda el estado en localStorage automáticamente |
