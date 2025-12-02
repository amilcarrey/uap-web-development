import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chatbot - Next.js & Vercel AI SDK",
  description: "Chatbot seguro con Next.js 15 y OpenRouter asheeee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
