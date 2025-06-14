
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
      'zod', // Keep Zod here for server-side externalization if also used directly by server components/actions
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Add the alias to prevent bundling of @opentelemetry/exporter-jaeger
    config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;

    // Attempt to force Zod to use its CJS build if SWC is failing on the .mjs file for client bundles
    // This might help if the ENOENT for zod/lib/index.mjs is due to SWC/Webpack issues with ESM
    if (!isServer) { // Apply this alias primarily for client-side bundles where SWC processes Zod
        config.resolve.alias['zod'] = 'zod/lib/index.js';
    }
    
    return config;
  },
};

export default nextConfig;
