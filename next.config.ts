import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allows production builds to complete even if type errors exist
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to complete even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
