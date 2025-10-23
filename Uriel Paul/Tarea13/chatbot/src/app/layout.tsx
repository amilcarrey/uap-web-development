import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ejercicio 13 · Chatbot",
  description:
    "Chatbot con Next.js, Tailwind CSS y Vercel AI SDK usando OpenRouter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
