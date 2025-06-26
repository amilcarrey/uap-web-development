"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../api"
import { useAuth } from "../auth"
import { useViewMode } from "../hooks/useViewMode"
import { PlusIcon, RectangleStackIcon, ShareIcon, UserIcon, SparklesIcon } from "@heroicons/react/24/outline"

type Board = {
  id: number
  name: string
  ownerId: number
}

export default function Boards() {
  const { user } = useAuth()
  const { viewMode } = useViewMode()
  const [own, setOwn] = useState<Board[]>([])
  const [shared, setShared] = useState<Board[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const load = () =>
    api<Board[]>("/boards")
      .then((bs) => {
        const uid = Number(user!.id)
        setOwn(bs.filter((b) => b.ownerId === uid))
        setShared(bs.filter((b) => b.ownerId !== uid))
      })
      .catch(() => {
        setOwn([])
        setShared([])
      })

  useEffect(() => {
    load()
  }, [])

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await api("/boards", {
        method: "POST",
        body: JSON.stringify({ name }),
      })
      setName("")
      load()
    } finally {
      setLoading(false)
    }
  }

  const BoardCard = ({ board, isOwner }: { board: Board; isOwner: boolean }) => {
    if (viewMode === "list") {
      return (
        <Link
          to={`/board/${board.id}`}
          className="block bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
                  isOwner
                    ? "bg-gradient-to-br from-red-500 to-yellow-600"
                    : "bg-gradient-to-br from-orange-500 to-red-600"
                }`}
              >
                {isOwner ? (
                  <RectangleStackIcon className="w-6 h-6 text-white" />
                ) : (
                  <ShareIcon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3
                  className={`font-semibold text-lg transition-colors duration-200 ${
                    isOwner
                      ? "text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400"
                      : "text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                  }`}
                >
                  {board.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{isOwner ? "Propietario" : "Compartido contigo"}</p>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className={`w-3 h-3 rounded-full ${isOwner ? "bg-red-500" : "bg-orange-500"}`}></div>
            </div>
          </div>
        </Link>
      )
    }

    // Grid view (default)
    return (
      <Link
        to={`/board/${board.id}`}
        className="block bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group"
      >
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
              isOwner ? "bg-gradient-to-br from-red-500 to-yellow-600" : "bg-gradient-to-br from-orange-500 to-red-600"
            }`}
          >
            {isOwner ? (
              <RectangleStackIcon className="w-8 h-8 text-white" />
            ) : (
              <ShareIcon className="w-8 h-8 text-white" />
            )}
          </div>
          <h3
            className={`font-semibold text-lg mb-2 transition-colors duration-200 ${
              isOwner
                ? "text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400"
                : "text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400"
            }`}
          >
            {board.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{isOwner ? "Propietario" : "Compartido contigo"}</p>
        </div>
      </Link>
    )
  }

  const EmptyState = ({
    icon: Icon,
    title,
    subtitle,
  }: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    subtitle: string
  }) => (
    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
      <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500">{subtitle}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <SparklesIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 dark:from-red-400 dark:to-yellow-400 bg-clip-text text-transparent">
              Tus Tableros
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Organiza tus proyectos y colabora con tu equipo</p>
        </div>

        {/* Create Board Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-8 transition-colors duration-300">
          <form onSubmit={createBoard} className="flex gap-4">
            <div className="flex-1">
              <input
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Nombre del nuevo tablero..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-gradient-to-r from-red-600 to-yellow-600 dark:from-red-500 dark:to-yellow-500 text-white px-6 py-3 rounded-xl font-medium hover:from-red-700 hover:to-yellow-700 dark:hover:from-red-600 dark:hover:to-yellow-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <PlusIcon className="w-5 h-5" />
              )}
              <span>Crear</span>
            </button>
          </form>
        </div>

        {/* Boards Layout */}
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-8" : "space-y-8"}>
          {/* Own Boards */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <UserIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis Tableros</h2>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {own.length}
              </span>
            </div>

            {own.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                {own.map((board) => (
                  <BoardCard key={board.id} board={board} isOwner={true} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={RectangleStackIcon}
                title="No tienes tableros aún"
                subtitle="Crea tu primer tablero arriba"
              />
            )}
          </div>

          {/* Shared Boards */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <ShareIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Compartidos</h2>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {shared.length}
              </span>
            </div>

            {shared.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                {shared.map((board) => (
                  <BoardCard key={board.id} board={board} isOwner={false} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ShareIcon}
                title="No tienes tableros compartidos"
                subtitle="Los tableros compartidos aparecerán aquí"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
