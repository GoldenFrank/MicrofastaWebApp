import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // ✅ Required for static hosting (e.g. Firebase)

  typescript: {
    ignoreBuildErrors: true,
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
