import type { Metadata } from "next";
import { Federant } from "next/font/google";
import "./globals.css";
import Navbar from "./componentes/navbar";

const federant = Federant({
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "Biblioteca virtual",
  description: "App de biblioteca virtual para libros y autores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${federant.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
