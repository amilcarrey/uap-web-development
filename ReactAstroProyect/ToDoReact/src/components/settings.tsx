import { useState } from "react";
import { useCategorias } from "../hooks/useCategorias";
import { useLogout } from '../hooks/useAuthUser';
import { useModalStore } from "../store/modalStore";
import { useSettingsStore } from "../store/settingsStore";
import type { Categoria } from "../types";

export default function Settings() {
  const { categoriasQuery, addCategoriaMutation, deleteCategoriaMutation } = useCategorias();
  const logout = useLogout();
  const [newCategoriaName, setNewCategoriaName] = useState("");

  // Configuraciones globales
  const refetchInterval = useSettingsStore((state) => state.refetchInterval);
  const setRefetchInterval = useSettingsStore((state) => state.setRefetchInterval);
  const uppercaseDescriptions = useSettingsStore((state) => state.uppercaseDescriptions);
  const toggleUppercaseDescriptions = useSettingsStore((state) => state.toggleUppercaseDescriptions);

const handleAddCategoria = (name: string) => {
  // Verificar si el nombre ya está en uso
  if (categoriasQuery.data?.some((categoria: Categoria) => categoria.name.toLowerCase() === name.toLowerCase())) {
    useModalStore.getState().openModal("El nombre de la categoría ya está en uso", "error");
    return;
  }

  // Generar un ID único basado en el nombre
  const id = name.toLowerCase().replace(/\s+/g, "-");

  // Enviar la solicitud al backend con el ID y el nombre
  addCategoriaMutation.mutate({ id, name }, {
    onSuccess: () => useModalStore.getState().openModal("Categoría creada", "success"),
    onError: () => useModalStore.getState().openModal("Error al crear la categoría", "error"),
  });
};

  const handleDeleteCategoria = (id: string) => {
    deleteCategoriaMutation.mutate(id, {
      onSuccess: () => useModalStore.getState().openModal("Categoría eliminada", "success"),
      onError: () => useModalStore.getState().openModal("Error al eliminar la categoría", "error"),
    });
  };

  const handleLogout = () => {
    logout.mutate();
  };

console.log("uppercaseDescriptions en Settings:", uppercaseDescriptions);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Configuraciones</h1>

      {/* Configuración de Refetch */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Intervalo de Refetch (segundos):</label>
        <input
          type="number"
          value={refetchInterval}
          onChange={(e) => setRefetchInterval(Number(e.target.value))}
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Configuración de Mayúsculas */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Descripción en Mayúsculas:</label>
        <input
          type="checkbox"
          checked={uppercaseDescriptions}
            onChange={() => {
    toggleUppercaseDescriptions();
  }}
          className="mr-2"
        />
        Activar
      </div>

      {/* Categorías */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Categorías</h2>
        {categoriasQuery.isLoading ? (
          <p>Cargando categorías...</p>
        ) : categoriasQuery.isError ? (
          <p>Error al cargar categorías</p>
        ) : categoriasQuery.data && categoriasQuery.data.length > 0 ? ( // Verifica que data esté definido y tenga elementos
          <ul className="mb-4">
            {categoriasQuery.data.map((categoria: { id: string; name: string }) => (
              <li key={categoria.id} className="flex items-center justify-between border-b py-2">
                <span>{categoria.name}</span>
                <div>
                  <button
                    onClick={() => (window.location.href = `/categorias/${categoria.id}`)}
                    className="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Ir
                  </button>
                  <button
                    onClick={() => handleDeleteCategoria(categoria.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay categorías disponibles.</p> // Maneja el caso donde data está vacío
        )}

        {/* Crear categoría nueva */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoriaName}
            onChange={(e) => setNewCategoriaName(e.target.value)}
            placeholder="Nueva categoría"
            className="border rounded px-2 py-1"
          />
          <button
            onClick={() => {
              if (newCategoriaName.trim() !== "") {
                handleAddCategoria(newCategoriaName);
                setNewCategoriaName("");
              }
            }}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Crear
          </button>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>

  );
}