"use client";
import React, {useState, FormEvent} from "react";

interface barraDeBusqueda {
    onSearch: (query: string) => void;
}

const BarraBusqueda: React.FC<barraDeBusqueda> = ({onSearch}) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="border border-gray-300 rounded-md p-2 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

            />
            <button type="submit" className="ml-2 bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Buscar
            </button>
        </form>
    );
};

export default BarraBusqueda;