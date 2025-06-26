"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { api } from "../api"
import TaskItem from "../components/TaskItem"
import ShareModal from "../components/ShareModal"
import { useAuth } from "../auth"
import {
  PencilIcon,
  ShareIcon,
  PlusIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline"

type Task = {
  id: number
  title: string
  completed: boolean
  creatorId: number | null
}

type BoardSummary = {
  id: number
  name: string
  ownerId: number
  roles: { userId: number; role: "OWNER" | "EDITOR" | "VIEWER" }[]
}

export default function BoardDetail() {
  const { user, loading } = useAuth()
  const { id } = useParams()
  const boardId = Number(id)

  const [tasksOwn, setTasksOwn] = useState<Task[]>([])
  const [tasksOthers, setTasksOthers] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [boardName, setBoardName] = useState("")
  const [owner, setOwner] = useState(false)
  const [edit, setEdit] = useState(false)
  const [showShare, setShare] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const refreshInterval = useRef<number | null>(null)

  const loadTasks = () => {
    if (!user || user.id === undefined || user.id === null) {
      return Promise.resolve()
    }

    return api<Task[]>(`/boards/${boardId}/tasks`).then((all) => {
      const uid = Number(user.id)
      const ownTasks = all.filter((t) => Number(t.creatorId) === uid)
      const otherTasks = all.filter((t) => Number(t.creatorId) !== uid)

      setTasksOwn(ownTasks)
      setTasksOthers(otherTasks)
    })
  }

  useEffect(() => {
    if (loading || !user || user.id === undefined || user.id === null) {
      return
    }

    api<BoardSummary[]>("/boards").then((bs) => {
      const b = bs.find((x) => x.id === boardId)
      if (!b) return

      setBoardName(b.name)
      const uid = Number(user.id)
      setOwner(Number(b.ownerId) === uid)

      const roleRec = b.roles.find((r) => Number(r.userId) === uid)
      setEdit(uid === b.ownerId || roleRec?.role === "EDITOR")
    })

    loadTasks()

    api("/preferences").then((p: any) => {
      if (refreshInterval.current) clearInterval(refreshInterval.current)
      if (p?.autoRefreshInterval) {
        refreshInterval.current = window.setInterval(loadTasks, p.autoRefreshInterval * 1000)
      }
    })

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current)
    }
  }, [boardId, user, loading])

  const rename = async () => {
    if (!owner || !boardName.trim()) return
    setIsEditing(true)
    try {
      await api(`/boards/${boardId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: boardName }),
      })
    } finally {
      setIsEditing(false)
    }
  }

  const createTask = async () => {
    if (!title.trim()) return
    setIsCreating(true)
    try {
      await api(`/boards/${boardId}/tasks`, {
        method: "POST",
        body: JSON.stringify({ title }),
      })
      setTitle("")
      loadTasks()
    } finally {
      setIsCreating(false)
    }
  }

  if (loading || !user)
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 dark:border-red-400 border-t-red-600 dark:border-t-red-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando tablero...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-8 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
              </div>

              {owner ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    className="text-2xl font-bold bg-transparent border-none outline-none focus:bg-gray-50 dark:focus:bg-gray-800 rounded-lg px-2 py-1 transition-all duration-200 flex-1 text-gray-900 dark:text-gray-100"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    onBlur={rename}
                    onKeyPress={(e) => e.key === "Enter" && rename()}
                  />
                  <button
                    onClick={rename}
                    disabled={isEditing}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    title="Guardar cambios"
                  >
                    {isEditing ? (
                      <div className="w-5 h-5 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <PencilIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{boardName}</h1>
              )}
            </div>

            <button
              onClick={() => setShare(true)}
              className="bg-gradient-to-r from-red-600 to-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-700 hover:to-yellow-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* Create Task */}
        {edit && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-8 transition-colors duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <PlusIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <input
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Escribe una nueva tarea..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && createTask()}
                />
              </div>
              <button
                onClick={createTask}
                disabled={!title.trim() || isCreating}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transform hover:scale-105 active:scale-95"
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PlusIcon className="w-5 h-5" />
                )}
                <span>Añadir</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Tasks */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <CheckBadgeIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tus Tareas</h2>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {tasksOwn.length}
              </span>
            </div>

            {tasksOwn.length > 0 ? (
              <div className="space-y-3">
                {tasksOwn.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={async () => {
                      await api(`/boards/${boardId}/tasks/${task.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ completed: !task.completed }),
                      })
                      loadTasks()
                    }}
                    onDelete={async () => {
                      await api(`/boards/${boardId}/tasks/${task.id}`, {
                        method: "DELETE",
                      })
                      loadTasks()
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <CheckBadgeIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No tienes tareas aún</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Crea tu primera tarea arriba</p>
              </div>
            )}
          </div>

          {/* Others' Tasks */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <UserGroupIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tareas del Equipo</h2>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {tasksOthers.length}
              </span>
            </div>

            {tasksOthers.length > 0 ? (
              <div className="space-y-3">
                {tasksOthers.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={
                      edit
                        ? async () => {
                            await api(`/boards/${boardId}/tasks/${task.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({ completed: !task.completed }),
                            })
                            loadTasks()
                          }
                        : undefined
                    }
                    onDelete={
                      edit
                        ? async () => {
                            await api(`/boards/${boardId}/tasks/${task.id}`, {
                              method: "DELETE",
                            })
                            loadTasks()
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <UserGroupIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No hay tareas del equipo</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Las tareas de otros miembros aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        {/* Share Modal */}
        {showShare && <ShareModal boardId={boardId} onClose={() => setShare(false)} />}
      </div>
    </div>
  )
}
