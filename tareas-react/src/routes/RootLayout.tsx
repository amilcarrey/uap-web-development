import React, { useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import { useConfigStore } from "../components/store/useConfigStore";
import { useFondoStore } from "../components/store/useFondoStore";
import axios from "axios";

const RootLayout = () => {
  const fondoUrl = useFondoStore((s) => s.fondoUrl);
  const setIntervaloRefetch = useConfigStore((s) => s.setIntervaloRefetch);
  const setDescripcionMayusculas = useConfigStore((s) => s.setDescripcionMayusculas);
  const setTareasPorPagina = useConfigStore((s) => s.setTareasPorPagina);
  const setTareaBgColor = useConfigStore((s) => s.setTareaBgColor);
  const setFondoUrl = useFondoStore((s) => s.setFondoUrl);
  const recibirConfigBackend = useConfigStore((s) => s.recibirConfigBackend);

  useEffect(() => {
    // Solo cargar una vez al iniciar sesión
    axios.get("http://localhost:8008/api/config", { withCredentials: true })
      .then(res => {
        setIntervaloRefetch(res.data.intervalo_refetch ?? 10000);
        setTareasPorPagina(res.data.tareas_por_pagina ?? 3);
        setDescripcionMayusculas(!!res.data.descripcion_mayusculas);
        setTareaBgColor(res.data.tareaBgColor || res.data.tarea_bg_color || "#111827");
        setFondoUrl(res.data.fondoActual || ""); // <-- Usa fondoActual aquí
        recibirConfigBackend(res.data); // Sincroniza el store y localStorage
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      {/* Fondo de pantalla */}
      {fondoUrl && (
        <div
          className="fixed inset-0 -z-10 bg-black"
          style={{
            backgroundImage: `url(${fondoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(0px)",
          }}
        />
      )}
      {/* Overlay oscuro para mejorar contraste */}
      <div className="fixed inset-0 -z-5 bg-black/40 pointer-events-none" />
      <Header />
      <main>
        <div className="max-w-2xl mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
