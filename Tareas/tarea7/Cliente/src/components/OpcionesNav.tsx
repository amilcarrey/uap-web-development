import { Link } from "react-router-dom";
import { useGoToFirstTab } from "../hooks/useGoToFirstTab";

export function OpcionesNav() {
    const goToFirstTab = useGoToFirstTab();

    return (
        <nav className="text-center my-2">
            <a href="#" className="mr-4" onClick={e => { e.preventDefault(); goToFirstTab(); }}>Tableros</a>
            <Link to="/configuracion">Configuración</Link>
        </nav>
    );
}