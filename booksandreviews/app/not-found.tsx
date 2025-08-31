import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">Página no encontrada</h2>
        <p className="text-amber-700 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link 
          href="/" 
          className="bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
