import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Development only: Next.js blocks dev-server assets requested from any host other than
  // localhost, which stops React hydrating when the site is opened from a phone on the
  // local network (menu, theme toggle and other interactive controls appear dead).
  // Allow private-network addresses and .local hostnames. Has no effect on production builds.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
  },
  // Make sure content files are available to server code at build time.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
