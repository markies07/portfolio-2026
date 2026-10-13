/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow overriding distDir via environment variable for local SSD caching when working on secondary drives
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
};

export default nextConfig;

