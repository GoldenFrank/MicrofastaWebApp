
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
    // Prevent bundling of @opentelemetry/exporter-jaeger for client-side bundles
    // It's an optional dependency for OpenTelemetry and can cause issues in static exports.
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/exporter-jaeger': false,
      };
    }
    return config;
  },
};

export default nextConfig;
