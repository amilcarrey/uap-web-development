import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js + OpenRouter Chat",
  description: "Chatbot con Next.js + AI SDK (Vercel) usando OpenRouter en backend."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
