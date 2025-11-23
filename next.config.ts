import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  // Ensure MDX files are processed correctly
  transpilePackages: [],
};

const withMDX = createMDX({
  // This tells Next.js to process MDX files
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // Ensure MDX files are compiled as React components
    development: process.env.NODE_ENV === 'development',
  },
});

export default withMDX(nextConfig);
