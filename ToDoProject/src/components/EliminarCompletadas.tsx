type Props = {
  onEliminar: (idsEliminados: number[]) => void;
};

function EliminarCompletadas({ onEliminar }: Props) {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Por si algún contenedor externo es un formulario

    try {
      const respuesta = await fetch("http://localhost:4321/api/eliminarCompletadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!respuesta.ok) {
        alert("No se pudieron eliminar las tareas completadas.");
        return;
      }

      const data = await respuesta.json();

      // Asegurate que el backend devuelve `ids`:
      // { success: true, mensaje: "...", ids: [...] }

      if (Array.isArray(data.ids)) {
        onEliminar(data.ids); // Actualiza el estado con los ids eliminados
      } else {
        console.warn("La respuesta del servidor no contiene 'ids'.", data);
      }
    } catch (err) {
      console.error("Error al eliminar tareas completadas:", err);
    }
  };

  return (
    <button
      type="button"
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
      onClick={handleClick}
      id="clear"
    >
      Eliminar todas las tareas completadas
    </button>
  );
}

export default EliminarCompletadas;