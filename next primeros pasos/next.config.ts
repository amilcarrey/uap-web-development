import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        new URL('https://www.googleapis.com/books/v1/volumes')
    ],
  },
};

export default nextConfig;
