// src/components/ClearCompletedForm.tsx
//import React from "react";
import { useMatch } from "@tanstack/react-router";
import { useTasks } from "../hooks/useTasks";
import { useClearCompleted } from "../hooks/useClearCompleted";


export default function ClearCompletedForm() {
  const {
    params: { boardId },
  } = useMatch({ from: "/reminder/$boardId" });

  // Llamada sin paginación ni filtro
  const { data } = useTasks(boardId);
  const { mutate, isPending } = useClearCompleted();

  const reminders = data ?? [];
  const hasCompleted = reminders.some((r:any) => r.completed);

  if (!hasCompleted) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate(boardId);
      }}
      className="my-4"
    >
      <button
        disabled={isPending}
        className="w-full bg-red-100 text-red-700 p-2 rounded"
      >
        {isPending ? "Limpiando..." : "Limpiar completadas"}
      </button>
    </form>
  );
}


// // src/components/ClearCompletedForm.tsx
// import React from "react";
// import { useMatch } from "@tanstack/react-router";
// import { useTasks } from "../hooks/useTasks";
// import { useClearCompleted } from "../hooks/useClearCompleted";

// // Si luego pasás estos valores desde configStore, se pueden usar desde allí también
// const DEFAULT_PAGE = 1;
// const DEFAULT_LIMIT = 10;
// const DEFAULT_FILTER = "all";

// export default function ClearCompletedForm() {
//   const {
//     params: { boardId },
//   } = useMatch({ from: "/boards/$boardId" });

//   const { data } = useTasks(boardId, DEFAULT_PAGE, DEFAULT_LIMIT, DEFAULT_FILTER);
//   const { mutate, isPending } = useClearCompleted();

//   const reminders = data?.reminders ?? [];
//   const hasCompleted = reminders.some((r) => r.completed);

//   if (!hasCompleted) return null;

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         mutate();
//       }}
//       className="my-4"
//     >
//       <button
//         disabled={isPending}
//         className="w-full bg-red-100 text-red-700 p-2 rounded"
//       >
//         {isPending ? "Limpiando..." : "Limpiar completadas"}
//       </button>
//     </form>
//   );
// }
