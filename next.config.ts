import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      'udhqfoqejatqmzakiliv.supabase.co' // ✅ your Supabase project domain
    ],
  },
};

export default nextConfig;
