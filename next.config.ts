import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // ✅ Required for static hosting (e.g. Firebase)

  typescript: {
    ignoreBuildErrors: false, // Changed to false to surface any TypeScript errors
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
};

export default nextConfig;
