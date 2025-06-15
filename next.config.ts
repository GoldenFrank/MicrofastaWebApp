
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
  // Moved serverExternalPackages to top-level and removed lucide-react
  serverExternalPackages: [ 
    '@genkit-ai/googleai',
    'genkit',
    '@genkit-ai/core',
    'zod', 
    'handlebars',
    'dotprompt',
    '@opentelemetry/api',
    '@opentelemetry/sdk-node',
  ],
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // This alias is to prevent issues with an optional Genkit dependency.
    config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
    
    // If it's a server-side build, treat Node.js built-in modules as external.
    // This can prevent Webpack from trying to polyfill or incorrectly process them.
    if (isServer) {
      // Ensure config.externals is an array. Next.js might initialize it differently.
      if (!Array.isArray(config.externals)) {
        config.externals = [];
      }
      // Add a regex to match Node.js built-in modules.
      // This regex matches 'node:fs', 'fs', etc.
      config.externals.push(/^(node:)?(fs|path|stream|crypto|http|https|net|tls|zlib|url|util|string_decoder|events|assert|os|buffer|child_process|constants|dns|domain|http2|inspector|module|perf_hooks|process|punycode|querystring|readline|repl|sys|timers|tty|dgram|v8|vm|worker_threads)$/i);
    }
    
    return config;
  },
};

export default nextConfig;
