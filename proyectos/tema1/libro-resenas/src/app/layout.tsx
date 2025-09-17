'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PerfilUsuarioHeader } from "./components/PerfilUsuario";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const path = window.location.pathname;
    // Permitir acceso libre a /login y /register
    if (path === "/login" || path === "/register") return;
    const match =
      typeof document !== "undefined" &&
      document.cookie.match(/(?:^|; )user=([^;]*)/);
    if (!match) {
      router.push("/login");
    }
  }, [router]);
  // Mostrar el header en todas las páginas excepto login/register
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const showHeader = path !== "/login" && path !== "/register";
  return (
    <>
      {showHeader && (
        <header
          style={{
            background: "#ffb6c1",
            padding: "1rem 2rem",
            borderBottom: "2px solid #e75480",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 2px 8px #e7548055"
          }}
        >
          <PerfilUsuarioHeader />
        </header>
      )}
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
