// import { useCallback } from "react";

// export function useEditarTarea(onEditar: (id: number, nuevaDescripcion: string) => void) {
//   return useCallback(async (id: number, nuevaDescripcion: string) => {
//     try {
//       const res = await fetch("http://localhost:4321/api/editar", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, descripcion: nuevaDescripcion }),
//       });
//       if (res.ok) {
//         onEditar(id, nuevaDescripcion);
//       } else {
//         alert("Error al editar la tarea");
//       }
//     } catch (err) {
//       console.error("Error al editar:", err);
//     }
//   }, [onEditar]);
// }