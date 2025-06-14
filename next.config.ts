
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
    serverComponentsExternalPackages: [
      '@genkit-ai/googleai',
      'genkit',
      '@genkit-ai/core',
      'handlebars',
      'dotprompt',
      '@opentelemetry/api',
      '@opentelemetry/sdk-node', // This might help with the jaeger issue source
    ],
  },
  webpack: (config, { isServer }) => {
    // Ensure config.resolve and config.resolve.alias exist
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Add the alias to prevent bundling of @opentelemetry/exporter-jaeger
    // This helps if sdk-node tries to dynamically require it.
    config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
    
    return config;
  },
};

export default nextConfig;
