/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http',  hostname: '35.172.107.240' },
      { protocol: 'https', hostname: 'louiseresto.com' },
    ],
  },
}

export default nextConfig
