
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
    // esmExternals: 'loose', // Removed this to rely on Next.js defaults
    serverComponentsExternalPackages: [
      '@genkit-ai/googleai',
      'genkit',
      '@genkit-ai/core',
      'handlebars',
      'dotprompt',
      '@opentelemetry/api',
      '@opentelemetry/sdk-node',
    ],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
    
    return config;
  },
};

export default nextConfig;
