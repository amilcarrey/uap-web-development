// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 font-sans text-gray-800">
        <header className="p-4 bg-blue-600 text-white text-2xl font-bold shadow">
          📚 Book Reviews
        </header>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
