# Supabase — Base de datos como servicio

## ¿Qué es Supabase?

Supabase es una alternativa open-source a Firebase. Te da una base de datos PostgreSQL con una API REST generada automáticamente, autenticación, almacenamiento de ficheros y tiempo real, todo sin tener que escribir un backend.

En este proyecto usamos solo la base de datos para guardar y leer tareas.

---

## Arquitectura: local vs. producción

Este proyecto tiene Supabase corriendo **en local** (con Docker):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
```

El puerto `54321` es el API de Supabase local. El puerto `54323` abre Supabase Studio (interfaz visual, como phpMyAdmin).

En producción cambiarías esas variables de entorno a los valores del proyecto en supabase.com, sin tocar el código.

---

## Crear el cliente

Solo hay que crearlo una vez y exportarlo:

```js
// src/app/utils/supabase/client.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- `supabaseUrl`: la dirección del servidor de Supabase.
- `supabaseKey`: la clave anónima pública. Con ella puedes hacer lo que las reglas de seguridad (RLS) permitan sin autenticarte.
- El prefijo `NEXT_PUBLIC_` hace que Next.js incluya esa variable en el código del navegador. Sin ese prefijo, solo estaría disponible en el servidor.

---

## Operaciones básicas

Todas las operaciones siguen el mismo patrón: construyes una query encadenando métodos y la `await`as para obtener `{ data, error }`.

### Leer todos los registros

```js
const { data, error } = await supabase
    .from("tareas")
    .select("*");

// data → array de objetos [ { id, titulo, descripcion, ... }, ... ]
// error → null si fue bien, objeto de error si falló
```

### Insertar un registro

```js
const { data, error } = await supabase
    .from("tareas")
    .insert({
        titulo: "Estudiar Supabase",
        descripcion: "Leer los apuntes"
    })
    .select();   // ← sin esto, data sería null

// data → [ { id: 42, titulo: "Estudiar Supabase", ... } ]
```

`.select()` al final del insert le dice a Supabase que devuelva el registro que acaba de crear (con el `id` generado por la BD, por ejemplo).

### Eliminar un registro

```js
const { error } = await supabase
    .from("tareas")
    .delete()
    .eq("id", idTarea);   // WHERE id = idTarea
```

`.eq()` es el equivalente a `WHERE campo = valor`. Hay también `.gt()`, `.lt()`, `.like()`, etc.

---

## Manejo de errores

Supabase nunca lanza excepciones. Siempre devuelve el objeto `{ data, error }`. La forma correcta de gestionarlo:

```js
const { data, error } = await supabase.from("tareas").select("*");

if (error) {
    console.error(error);
    return;   // salir antes de usar data
}

// A partir de aquí, data es seguro de usar
console.log(data);
```

> No uses `try/catch` con Supabase. No lo necesitas salvo para errores de red muy raros.

---

## Cómo se conecta con Zustand en este proyecto

El cliente de Supabase y el store de Zustand son independientes. La conexión ocurre manualmente en las acciones del store y en los componentes:

**En el store** (`fetchTareas`): Supabase lee la BD → Zustand guarda en el estado.

```js
// useTareasStorage.js
fetchTareas: async () => {
    const { data, error } = await supabase.from("tareas").select("*")
    if (error) { /* ... */ return }
    set({ tareas: data })
}
```

**En el componente** (`InputTarea`): Supabase escribe en la BD → Zustand actualiza el estado local.

```js
// InputTarea.jsx
const { insertarTarea } = useTareasStorage()

// Al enviar el formulario:
const { data, error } = await supabase.from("tareas").insert({ ... }).select()
if (error) return
insertarTarea(data[0])   // actualiza el store con lo que devolvió la BD
```

Este segundo patrón se llama **actualización optimista** (o casi-optimista): en vez de volver a hacer un `fetchTareas` completo, añades directamente el objeto recién insertado. Es más rápido para el usuario.

---

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Dirección del servidor Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública para peticiones sin autenticar |

Estas variables van en `.env.local` (no se sube al repositorio). En producción se configuran en el panel de despliegue (Vercel, etc.).

---

## Resumen rápido

| Operación | Código |
|---|---|
| Leer todo | `.from("tabla").select("*")` |
| Leer con filtro | `.from("tabla").select("*").eq("campo", valor)` |
| Insertar y obtener el resultado | `.from("tabla").insert({...}).select()` |
| Eliminar | `.from("tabla").delete().eq("id", id)` |
| Comprobar errores | `if (error) { return }` antes de usar `data` |
