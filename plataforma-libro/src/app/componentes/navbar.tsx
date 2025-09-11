import Link from "next/link"; //para no recargar la pagina

const Navbar = () => {
    return (
    <nav className="bg-brown-700 p-4 flex space-between items-center">
      <div className="text-white text-2xl font-bold">
        <Link href="/">Busca el librooo</Link>
      </div>
    </nav>
    )
}

export default Navbar;
