# 📚 Proyecto-Next

Aplicación web para buscar libros, ver detalles, dejar reseñas, votar y guardar favoritos, integrada con la **Google Books API**.  
Construida con **Next.js**, **TypeScript**, **Mongoose** y **MongoDB**.

---

## 🚀 Características

- 🔍 **Búsqueda de libros** usando la API de Google Books.
- 📖 **Detalles del libro** con título, autores, descripción e imagen.
- ⭐ **Favoritos**: cada usuario puede marcar libros como favoritos.
- 📝 **Reseñas**: los usuarios pueden dejar comentarios y calificar libros (1 a 5 estrellas).
- 👍👎 **Votos**: los usuarios pueden votar reseñas (like/dislike).
- 👤 **Autenticación** con modelo de usuarios (con hashing de contraseñas).
- 🛠 **Stack moderno**: Next.js + TypeScript + MongoDB + Mongoose.

---

## 🛠 Tecnologías

- [Next.js](https://nextjs.org/) – Framework de React con SSR/SSG
- [TypeScript](https://www.typescriptlang.org/) – Tipado estático
- [MongoDB](https://www.mongodb.com/) – Base de datos NoSQL
- [Mongoose](https://mongoosejs.com/) – ODM para MongoDB
- [Google Books API](https://developers.google.com/books) – Fuente de datos de libros
- [bcrypt](https://www.npmjs.com/package/bcrypt) – Hash de contraseñas

## ⚙️ Configuración

1. Clona el repositorio:
   git clone https://github.com/KiaraSeb/Proyecto-Next.git

Instala dependencias:
npm install

Configura las variables de entorno en .env.local:
# 🌍 URLs públicas
NEXT_PUBLIC_GOOGLE_BOOKS_API_URL=https://www.googleapis.com/books/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 🔐 Conexión a MongoDB
MONGODB_URI=mongodb://localhost:27017/bookhub

## Inicia el servidor de desarrollo:
npm run dev

Genera el build de producción:
npm run build
npm start

## Modelos principales

- Usuario (Usuario.ts)
- Favorito (Favorito.ts)
- Reseña (Review.ts)
- Voto (Vote.ts)


Alumna: Kiara Sebestyen