import React from "react";

type Props = {
  filtro: string;
  setFiltro: (filtro: "todas" | "activas" | "completadas") => void;
};

const Header = ({ filtro, setFiltro }: Props) => {
  return (
    <header className="bg-gray-800 text-white w-full z-50 p-4 fixed top-0 left-0 text-center shadow-md h-[100px] flex flex-col justify-center">
      <h1 className="text-4xl tracking-wider md:text-2xl">2.DO</h1>
      <nav className="tabs flex justify-center mt-2 space-x-4">
        {["todas", "activas", "completadas"].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f as any)}
            className={`tab text-gray-400 font-bold hover:text-greenyellow ${
              filtro === f ? "text-greenyellow" : ""
            }`}
          >
            {f === "todas" ? "Todas" : f === "activas" ? "Incompletas" : "Completas"}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
