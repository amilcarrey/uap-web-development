import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["ai", "@ai-sdk/openai"],
  turbopack: { root: __dirname },
};

export default nextConfig;
