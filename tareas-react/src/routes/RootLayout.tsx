import React from "react";
import { Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import { useFondoStore } from "../components/store/useFondoStore";
import CambiarFondo from "../components/CambiarFondo";

const RootLayout = () => {
  const fondoUrl = useFondoStore((s) => s.fondoUrl);

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
          <CambiarFondo />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
