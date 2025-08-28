# 📚 BookVerse – Plataforma de descubrimiento y reseñas de libros

App full-stack para buscar libros (Google Books), ver detalles y publicar reseñas con calificación (1–5 ⭐) y votación comunitaria (👍/👎). Incluye pruebas con **Vitest** y **Testing Library**.

---

## 🧰 Tech Stack
- **Frontend:** React + Vite + TypeScript, React Router, TanStack Query
- **Backend:** Node 20 + Express + TypeScript
- **Persistencia:** En memoria (simple para TP). Interfaz lista para migrar a DB.
- **Tests:** Vitest (front y back) + @testing-library/react (front)

> **API externa:** Google Books. Uso básico sin API key.

---

## 🚀 Puesta en marcha

### 1) Backend
```bash
cd server
npm i
npm run dev   # http://localhost:3000
