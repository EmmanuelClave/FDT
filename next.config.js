/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', 'tls' on the client to prevent this error
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    
    // Handle node: protocol URIs
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:fs': false,
      'node:path': false,
      'node:crypto': false,
      'node:stream': false,
      'node:buffer': false,
    }
    
    return config
  },
}

module.exports = nextConfig
