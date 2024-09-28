/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailingSlash is set to true for static exports
  trailingSlash: true,
};

export default nextConfig;
