// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/books/content*',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/content*',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/books/publisher/content*',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/publisher/content*',
      },
      {
        protocol: 'http',
        hostname: 'books.googleusercontent.com',
        pathname: '/books/content*',
      },
      {
        protocol: 'https',
        hostname: 'books.googleusercontent.com',
        pathname: '/books/content*',
      },
    ],
  },
};

module.exports = nextConfig;
