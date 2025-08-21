"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Main = () => {
  const [buscar, setBuscar] = useState("");
  const router = useRouter();

  const handleBuscar = () => {
    if (buscar.trim()) {
      router.push(`/search?q=${encodeURIComponent(buscar)}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center py-8">
      <div className="header text-center px-4 md:px-12">
        {/* Título principal */}
        <div className="row1 mt-4 text-center">
          <h1
            className="text-4xl font-bold mb-6 inline-block bg-white/70 px-6 py-4 rounded-lg shadow-md"
            style={{ color: "#5e3929" }}
          >
            Bienvenido a la biblioteca virtual Justito
            <br />
            porque te ofrecemos lo justo para leer
          </h1>
        </div>

        {/* Buscador */}
        <div className="row2 mb-8">
          <h2 className="text-2xl mb-4" style={{ color: "#5e3929" }}>
            Encuentra tu libro
          </h2>
          <div className="search flex justify-center items-center gap-4">
            <input
              type="text"
              placeholder="Ingresa el nombre del libro"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              className="px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2"
              style={{
                border: "2px solid #cd8c52",
                borderRadius: "0.375rem",
                color: "#000",
              }}
            />
            <button
              onClick={handleBuscar}
              style={{ backgroundColor: "#cd8c52", color: "#171717" }}
              className="px-4 py-2 rounded-md font-semibold shadow-md"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
