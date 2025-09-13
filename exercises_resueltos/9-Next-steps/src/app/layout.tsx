import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BookDiscovery - Encuentra y reseña tus libros favoritos',
  description: 'Plataforma de descubrimiento y reseñas de libros',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary-700 flex items-center">
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h-2v-6h2v6zm4 0h-2v-6h2v6zm-6-8c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm8 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1z"/>
                </svg>
                BookDiscovery
              </h1>
              <nav>
                <ul className="flex space-x-6">
                  <li><a href="/" className="text-gray-700 hover:text-primary-600">Inicio</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-primary-600">Explorar</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-primary-600">Favoritos</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 BookDiscovery. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}