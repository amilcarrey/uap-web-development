"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, Flame, Target, Trophy, PenLine, RefreshCw } from "lucide-react";

interface Stats {
  totalBooks: number;
  totalPages: number;
  averageRating: number;
  topGenre: string;
  topAuthor: string;
  booksThisMonth: number;
  streak: number;
  challenges: string[];
}

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("📊 Fetching stats from API...");
      const response = await fetch("/api/tools/getReadingStats?userId=demo-user");
      
      if (!response.ok) {
        throw new Error("Error al cargar estadísticas");
      }
      
      const data = await response.json();
      console.log("📊 Data received:", data);
      
      // Si NO tiene totalBooks, significa que no hay libros leídos
      if (data.message && !data.totalBooks) {
        console.log("📭 No hay libros leídos");
        setStats({
          totalBooks: 0,
          totalPages: 0,
          averageRating: 0,
          topGenre: "Sin datos",
          topAuthor: "Sin datos",
          booksThisMonth: 0,
          streak: 0,
          challenges: ["Empieza a leer y marca tus libros como leídos para ver tus estadísticas."],
        });
      } else {
        // Tiene datos, usar los valores de la API
        console.log("✅ Stats cargadas correctamente");
        setStats({
          totalBooks: data.totalBooks || 0,
          totalPages: data.totalPages || 0,
          averageRating: parseFloat(data.averageRating) || 0,
          topGenre: data.topGenre || "Sin datos",
          topAuthor: data.topAuthor || "Sin datos",
          booksThisMonth: data.booksThisMonth || 0,
          streak: data.streak || 0,
          challenges: data.challenges || [],
        });
      }
    } catch (err) {
      console.error("❌ Error al cargar estadísticas:", err);
      setError("No se pudieron cargar las estadísticas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="max-w-md w-full mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg text-white">
        <div className="text-center py-8">
          <RefreshCw className="animate-spin mx-auto mb-2" size={32} />
          <p className="text-gray-400">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md w-full mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg text-white">
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const {
    totalBooks,
    totalPages,
    averageRating,
    topGenre,
    topAuthor,
    booksThisMonth,
    streak,
    challenges,
  } = stats;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg text-white space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-400">
          Tus estadísticas de lectura
        </h2>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="p-2 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
          title="Actualizar estadísticas"
        >
          <RefreshCw className={`${isLoading ? 'animate-spin' : ''}`} size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Stat icon={<BookOpen />} label="Libros leídos" value={totalBooks} />
        <Stat icon={<Star />} label="Rating promedio" value={averageRating.toFixed(2)} />
        <Stat icon={<Target />} label="Género favorito" value={topGenre} />
        <Stat icon={<PenLine />} label="Autor favorito" value={topAuthor} />
        <Stat icon={<Flame />} label="Racha actual" value={`${streak} día${streak > 1 ? "s" : ""}`} />
        <Stat icon={<Trophy />} label="Este mes" value={`${booksThisMonth} libro${booksThisMonth > 1 ? "s" : ""}`} />
      </div>

    </motion.div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-xl">
      <span className="text-green-400">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
