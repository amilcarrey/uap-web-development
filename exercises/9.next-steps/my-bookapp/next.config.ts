import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "books.googleusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }
    ]
  }
};

export default nextConfig;
//output: "standalone" → hace que al compilar la app, Next.js genere un paquete independiente.
//Esto lo pide Vercel/Docker porque hace más fácil desplegar sin todo el node_modules.

//images.remotePatterns → le dice a Next qué dominios externos puede usar para <Image>.