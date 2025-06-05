// src/pages/RemindersPage.tsx
import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import ReminderList from "../components/ReminderList";

export default function RemindersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const boardId = "default"; // Aquí puedes cambiarlo por el ID del tablero que necesites
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useTasks(boardId, page, limit, );

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        {/* Un spinner simple con Tailwind */}
        <svg
          className="animate-spin h-10 w-10 text-rose-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          />
        </svg>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 py-10">
        <p>Error al cargar tareas:</p>
        <p className="font-mono">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <>
      {/* isFetching sigue true mientras refetch ocurre, puedes usarlo para un badge pequeño */}
      {isFetching && (
        <div className="text-sm text-gray-500 mb-2">Actualizando datos…</div>
      )}
      <ReminderList
        reminders={data?.reminders ?? []}
        page={page}
        setPage={setPage}
        total={data?.total ?? 0}
        limit={limit}
        boardId={boardId} // Pasamos el boardId para que ReminderList pueda usarlo si es necesario
      />
    </>
  );
}
