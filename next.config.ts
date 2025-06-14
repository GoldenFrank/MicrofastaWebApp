
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // REMOVED: output: 'export', - This allows for server-side features.
  typescript: {
    ignoreBuildErrors: false, // Re-enable TypeScript error checking
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
      '@opentelemetry/sdk-node', // Keep this for Genkit's tracing
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Add the alias to prevent bundling of @opentelemetry/exporter-jaeger
    // This helps if sdk-node tries to dynamically require it.
    // This should apply for server-side builds as well.
    config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
    
    return config;
  },
};

export default nextConfig;
