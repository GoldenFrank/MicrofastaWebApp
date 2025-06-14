
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure output: 'export' is NOT here for server-side features.
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
      'zod', // Keep Zod here for server-side externalization; Webpack will bundle it for client components if imported there.
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Add the alias to prevent bundling of @opentelemetry/exporter-jaeger
    config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;

    // Removed the problematic alias for zod: config.resolve.alias['zod'] = 'zod/lib/index.js';
    
    return config;
  },
};

export default nextConfig;
