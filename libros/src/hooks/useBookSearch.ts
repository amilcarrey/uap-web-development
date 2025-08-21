import { useState } from 'react';

/**
 * Hook personalizado para manejar la búsqueda de libros
 * 
 * Este hook encapsula toda la lógica relacionada con:
 * - Estado de búsqueda (término, resultados, loading, errores)
 * - Detección automática del tipo de búsqueda (ISBN, autor, título)
 * - Formateo de queries para la API de Google Books
 * - Manejo de errores y estados de carga
 * 
 * @returns {Object} Objeto con estados y funciones para la búsqueda
 */
const useBookSearch = () => {
  // Estados del hook
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda ingresado por el usuario
  const [books, setBooks] = useState([]); // Array de libros encontrados
  const [isLoading, setIsLoading] = useState(false); // Indica si está realizando una búsqueda
  const [error, setError] = useState<string | null>(null); // Mensaje de error si algo sale mal

  /**
   * Función principal que ejecuta la búsqueda de libros
   * 
   * Proceso:
   * 1. Valida que haya un término de búsqueda
   * 2. Detecta el tipo de búsqueda (ISBN, autor, o título)
   * 3. Formatea el query apropiadamente para Google Books API
   * 4. Realiza la petición HTTP
   * 5. Procesa los resultados y maneja errores
   */
  const searchBooks = async () => {
    // No buscar si el campo está vacío
    if (searchTerm.trim() === '') return;

    setIsLoading(true); // Activar estado de carga
    setError(null); // Limpiar errores previos

    try {
      // Detectar si es un ISBN (solo números, con o sin guiones)
      const cleanTerm = searchTerm.replace(/[-\s]/g, ''); // Remover guiones y espacios
      const isISBN = /^\d{10}(\d{3})?$/.test(cleanTerm); // Regex para ISBN-10 o ISBN-13
      
      // Formatear la query según el tipo de búsqueda detectado
      let query = '';
      if (isISBN) {
        // Búsqueda específica por ISBN
        query = `isbn:${cleanTerm}`;
      } else {
        // Verificar si es búsqueda por autor (contiene "autor:" o "author:")
        const isAuthorSearch = searchTerm.toLowerCase().includes('autor:') || 
                              searchTerm.toLowerCase().includes('author:');
        if (isAuthorSearch) {
          // Extraer el nombre del autor y usar el filtro específico
          const authorName = searchTerm.replace(/autor:|author:/gi, '').trim();
          query = `inauthor:${authorName}`;
        } else {
          // Búsqueda general por título
          query = searchTerm;
        }
      }

      // Realizar petición a Google Books API
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      // Verificar si se encontraron resultados
      if (data.totalItems === 0) {
        setError('No se encontraron libros con ese término de búsqueda.');
      }
      
      // Guardar resultados (data.items puede ser undefined si no hay resultados)
      setBooks(data.items || []);
    } catch (err) {
      // Manejar errores de red o de la API
      setError('Error al buscar libros. Inténtalo de nuevo.');
    } finally {
      // Siempre desactivar el estado de carga, sin importar si hubo error o éxito
      setIsLoading(false);
    }
  };

  // Retornar todo lo que los componentes necesitan para usar este hook
  return {
    searchTerm,      // Término actual de búsqueda
    setSearchTerm,   // Función para actualizar el término
    books,           // Array de libros encontrados
    isLoading,       // Estado de carga
    error,           // Mensaje de error (si existe)
    searchBooks,     // Función para ejecutar la búsqueda
  };
};

export default useBookSearch;