/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the dev compiler isolated from production builds. Sharing `.next`
  // lets `next build` replace CSS and lazy chunks while `next dev` is still
  // serving them, which produces intermittent `/_next/static/*` 404s.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
