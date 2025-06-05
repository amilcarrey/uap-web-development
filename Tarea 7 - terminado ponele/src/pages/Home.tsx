import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useTasks } from '../hooks/useTasks'
import AddReminderForm from '../components/AddReminderForm'
import ClearCompletedForm from '../components/ClearCompletedForm'
import FilterLinks from '../components/FilterLinks'
import ReminderList from '../components/ReminderList'
import ToastContainer from '../components/ToastContainer'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import { useBoard } from '../hooks/useBoard' 

import { useTaskStore } from '../store/taskStore'

// ...

export default function Home() {
  const { boardId } = useParams({ from: '/boards/$boardId' })
  const { board, loading: boardLoading, error: boardError } = useBoard()

  const [page, setPage] = useState(1)
  const limit = 5

  const filter = useTaskStore((s) => s.filter) // ✅ filtro global
  const { data, isLoading, isError } = useTasks(boardId, page, limit)

  const reminders = data?.reminders ?? []

  return (
    <main className="max-w-[600px] mx-auto p-8 bg-rose-50 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-center text-rose-700 mb-8">
        Mis Recordatorios
        {boardLoading
          ? " (Cargando tablero...)"
          : boardError
          ? " (Error al cargar tablero)"
          : board
          ? ` (tablero: ${board.name})`
          : ""}
      </h1>

      <AddReminderForm />

      {isLoading ? (
        <p className="text-center text-gray-500">Cargando tareas...</p>
      ) : isError ? (
        <p className="text-center text-red-500">
          Error al cargar tareas de {boardId}
        </p>
      ) : (
        <ReminderList
          reminders={reminders}
          page={page}
          setPage={setPage}
          total={data?.total ?? 0}
          limit={limit}
          boardId={boardId}
        />
      )}

      <ClearCompletedForm reminders={reminders} />
      <FilterLinks /> {/* ✅ sin props */}
      <ToastContainer />
      <ConfirmDeleteModal />
    </main>
  )
}
