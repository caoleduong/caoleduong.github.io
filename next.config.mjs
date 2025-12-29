/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/social-links' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/social-links' : '',
}

export default nextConfig
