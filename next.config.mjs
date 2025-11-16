/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      middlewarePrefetch: "strict", // Ensure middleware runs
    },
  };
  
  export default nextConfig;
  