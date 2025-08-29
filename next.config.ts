import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to prevent deployment failures from content warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
