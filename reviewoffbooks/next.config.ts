import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
        port: '',
        pathname: '/books/**',
      },
    ],
  },
  // Suprimir errores de hidratación causados por extensiones del navegador
  experimental: {
    suppressHydrationWarning: true,
  },
};

export default nextConfig;
