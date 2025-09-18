import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      }
    ],
  },
  turbopack: {
    root: "C:\\Users\\johann beskow\\Desktop\\uap-web-development\\Tareas\\tarea9\\tutorial",
  },

};

export default nextConfig;
