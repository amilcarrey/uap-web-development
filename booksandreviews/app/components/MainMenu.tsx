export default function MainMenu() {
  return (
    <div className="text-center space-y-12">
      {/* Welcome Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-amber-900">¡Bienvenido a Books & Reviews!</h2>
        <p className="text-xl text-amber-700 max-w-2xl mx-auto">
          Descubre nuevos libros, comparte tus opiniones y encuentra tu próxima lectura favorita
        </p>
      </div>

      {/* Features */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-amber-900 mb-8">¿Qué puedes hacer?</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="font-semibold text-amber-900 mb-2">Explorar Biblioteca</h4>
            <p className="text-amber-700 text-sm">Accede a miles de libros de diferentes géneros</p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h4 className="font-semibold text-amber-900 mb-2">Compartir Opiniones</h4>
            <p className="text-amber-700 text-sm">Califica y reseña tus libros favoritos</p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-amber-900 mb-2">Seguir Lecturas</h4>
            <p className="text-amber-700 text-sm">Mantén un registro de tus reseñas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
