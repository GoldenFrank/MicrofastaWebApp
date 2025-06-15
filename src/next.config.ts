
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure output: 'export' is NOT here for server-side features.
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
    serverComponentsExternalPackages: [
      '@genkit-ai/googleai',
      'genkit',
      '@genkit-ai/core',
      'zod', 
      'handlebars',
      'dotprompt',
      '@opentelemetry/api',
      '@opentelemetry/sdk-node',
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // This alias is to prevent issues with an optional Genkit dependency.
    config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
    
    return config;
  },
};

export default nextConfig;
