import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Necesario para calcular __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config) => {
    config.resolve.alias["@react-native-async-storage/async-storage"] = path.resolve(
      __dirname,
      "./src/utils/asyncStorageShim.js"
    );
    return config;
  },
  experimental: {
    esmExternals: "loose",
  },
};

// 👇 ESTA ES LA LÍNEA CORRECTA PARA EXPORTAR EN ESM
export default nextConfig;
