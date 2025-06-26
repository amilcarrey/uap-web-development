"use client"

import { CheckIcon, TrashIcon } from "@heroicons/react/24/solid"
import { CheckIcon as CheckOutline } from "@heroicons/react/24/outline"
import { useState } from "react"

interface Props {
  task: {
    id: number
    title: string
    completed: boolean
  }
  onToggle?: () => Promise<void>
  onDelete?: () => Promise<void>
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    if (!onToggle || isToggling) return
    setIsToggling(true)
    try {
      await onToggle()
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={`group bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 transition-all duration-300 hover:shadow-md ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {onToggle && (
            <button
              onClick={handleToggle}
              disabled={isToggling}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                task.completed
                  ? "bg-gradient-to-br from-orange-500 to-red-500 border-orange-500 text-white"
                  : "border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              } ${isToggling ? "animate-pulse" : ""}`}
            >
              {task.completed ? (
                <CheckIcon className="w-4 h-4 mx-auto" />
              ) : (
                <CheckOutline className="w-4 h-4 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-orange-500" />
              )}
            </button>
          )}

          <span
            className={`flex-1 transition-all duration-200 ${
              task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {task.title}
          </span>
        </div>

        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-200 flex items-center justify-center"
            title="Eliminar tarea"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <TrashIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
