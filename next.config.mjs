/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow overriding distDir via environment variable for local SSD caching when working on secondary drives
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  images: {
    // AVIF first (typically 20–30% smaller than WebP at the same quality),
    // WebP for browsers without it
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

