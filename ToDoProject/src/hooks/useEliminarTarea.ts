// import { useCallback } from "react";

// export function useEliminarTarea(onEliminar: (id: number) => void) {
//   return useCallback(async (id: number) => {
//     try {
//       const res = await fetch("http://localhost:4321/api/eliminar", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       if (res.ok) {
//         onEliminar(id);
//       } else {
//         alert("Error al eliminar la tarea");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }, [onEliminar]);
// }