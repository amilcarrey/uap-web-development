import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     domains: ["books.google.com"]
  }
};

const path = require('path')

module.exports = {
  outputFileTracingRoot: path.join(__dirname, '../../'), // ajusta según tu estructura
}

export default nextConfig;
