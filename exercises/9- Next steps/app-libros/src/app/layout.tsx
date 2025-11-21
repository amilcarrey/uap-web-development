import QueryProvider from "@/provider/QueryProvider";
import "./globals.css";

export const metadata = {
  title: "Reseñas de Libros",
  description: "App con Next.js + Google Books API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
