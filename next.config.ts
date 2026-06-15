import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecimg.cafe24img.com",
      },
      {
        protocol: "https",
        hostname: "*.cafe24img.com",
      },
      {
        protocol: "https",
        hostname: "*.cafe24.com",
      },
      {
        protocol: "http",
        hostname: "ecimg.cafe24img.com",
      },
      {
        protocol: "http",
        hostname: "*.cafe24img.com",
      },
      {
        protocol: "http",
        hostname: "*.cafe24.com",
      },
    ],
  },
  // Allowed development origins for HMR support
  allowedDevOrigins: ["lvh.me"],
  async rewrites() {
    return [
      {
        source: "/exec/:path*",
        destination: "https://hypq.cafe24.com/exec/:path*",
      },
    ];
  },
};

export default nextConfig;
