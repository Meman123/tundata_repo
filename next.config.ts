import type { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure you spread the existing config if it's not empty,
  // or add your specific Next.js configurations here.
  // For example:
  // reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
