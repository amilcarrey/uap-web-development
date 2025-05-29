// import { useCallback } from "react";

// export function useToggleTarea(onToggle: (id: number) => void) {
//   return useCallback(async (id: number) => {
//     try {
//       const res = await fetch("http://localhost:4321/api/toggle", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({ id: id.toString() }),
//       });
//       if (res.ok) {
//         onToggle(id);
//       } else {
//         alert("Error al cambiar el estado");
//       }
//     // } catch (err) {
//       console.error("Error al hacer toggle:", err);
//     }
//   }, [onToggle]);
// }