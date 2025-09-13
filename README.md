### ESTRUCTURA BASICA
/pages
  index.tsx          -> Página principal / búsqueda de libros
  /books
    [id].tsx         -> Detalle de un libro
/components
  BookCard.tsx       -> Tarjeta de libro en la búsqueda
  ReviewForm.tsx     -> Formulario para agregar reseña
  ReviewList.tsx     -> Lista de reseñas
/utils
  googleBooks.ts     -> Funciones para llamar a la API
/types
  index.ts           -> Tipos TS (Book, Review, etc.)
