
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // ✅ Required for static hosting (e.g. Firebase)

  typescript: {
    ignoreBuildErrors: false, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    esmExternals: 'loose', 
  },
  webpack: (config, { isServer }) => {
    // Prevent bundling of @opentelemetry/exporter-jaeger, an optional dependency.
    // This can cause issues if not installed, especially for static exports.
    // Applying it unconditionally to cover both client and server-like parts of the build.
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentelemetry/exporter-jaeger': false,
    };
    return config;
  },
};

export default nextConfig;
