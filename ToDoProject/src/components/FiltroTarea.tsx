type Props = {
    onFiltrar: (tareasFiltradas: { id: number; descripcion: string; completada: boolean }[]) => void;
  };
  
  function FiltroTareas({ onFiltrar }: Props) {
    const aplicarFiltro = async (filtro: string) => {
      try {
        const respuesta = await fetch("http://localhost:4321/api/filtro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filtro }),
        });
  
        if (!respuesta.ok) {
          alert("Error al aplicar el filtro");
          return;
        }
        
      const data = await respuesta.json();
      onFiltrar(data.tareas);

      } catch (error) {
        console.error("Error aplicando el filtro:", error);
      }
    };
  
    return (
      <div className="flex justify-center space-x-2 mt-3">
        <button onClick={() => aplicarFiltro("todas")} className="boton-filtro">
          Todas
        </button>
        <button onClick={() => aplicarFiltro("completadas")} className="boton-filtro">
          Terminadas
        </button>
        <button onClick={() => aplicarFiltro("pendientes")} className="boton-filtro">
          Pendientes
        </button>
      </div>
    );
  }
  
  export default FiltroTareas;
  