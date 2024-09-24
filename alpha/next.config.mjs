/**
 * NEXT.JS Configuration
 */

/** @type {import('next').NextConfig} */

console.debug('nodejs Environment:', process.env.NODE_ENV);
console.debug('Environment:', process.env.ENVIRONMENT);

const nextConfig = {
  basePath: process.env.BASE_PATH,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
  /*
   * SVGR (Scalable Vector Graphic Raw) Webpack Configuration
   */
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  experimental: {
    ppr: 'incremental',
  },
};

export default nextConfig;
