// Documento de esquema (solo referencia). En este prototipo no se aplica directamente.
// Aquí puedes colocar migrations o definiciones ORM en futuro.
export const SCHEMA = {
  users: {
    id: "serial",
    username: "text",
    email: "text"
  },
  books: {
    id: "text",
    title: "text",
    authors: "text[]",
    raw: "jsonb",
    last_sync: "timestamp"
  },
  reviews: {
    id: "serial",
    user_id: "int",
    book_id: "text",
    rating: "int",
    content: "text"
  },
  review_votes: {
    id: "serial",
    review_id: "int",
    user_id: "int",
    vote: "smallint"
  }
};
