import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // No detiene el build por errores de ESLint
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
