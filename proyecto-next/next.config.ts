import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["books.google.com"], // Permite imágenes desde Google Books
  },
};

export default nextConfig;
