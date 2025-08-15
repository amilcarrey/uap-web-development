// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Simple y efectivo
    domains: ['books.google.com', 'books.googleusercontent.com'],

    // Alternativa:
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'books.google.com' },
    //   { protocol: 'https', hostname: 'books.googleusercontent.com' },
    // ],
  },
};

module.exports = nextConfig;
