/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    js: false,
    webpack: (config, { isServer }) => {
      config.resolve.fallback = {
        "@solana/spl-token-swap": require.resolve("@solana/spl-token-swap"),
        crypto: false,
        stream: false,
        querystring: false,
        https: false,
        zlib: false,
        http: false,
      }
  
      return config
    },
  }
  
  module.exports = nextConfig