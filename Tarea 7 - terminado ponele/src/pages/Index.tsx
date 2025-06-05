import { Link, useParams } from "@tanstack/react-router";

export function Index() {
 

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">wELCOME TO EL GESTOR DE RECORDATORIOS</h1>
       <Link to="/boards/hola">BOARD</Link>
        <Link to="/boards/configuracion">CONFIGURACION</Link>
    </div>
  );
}
