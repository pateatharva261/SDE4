import { withContentlayer } from 'next-contentlayer2';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: process.env.NEXT_OUTPUT === 'export' ? 'export' : undefined,
  images: { unoptimized: true },  // static-export friendly
  experimental: { mdxRs: false }, // contentlayer handles MDX
  turbopack: {},                  // Silence Turbopack webpack custom configuration warning/error in Next 16
  async redirects() {
    return [
      { source: '/app', destination: '/', permanent: true },
      { source: '/platform/app', destination: '/', permanent: true },
    ];
  },
};

export default withContentlayer(nextConfig);
