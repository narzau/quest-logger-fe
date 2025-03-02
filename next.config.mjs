import NextPWA from "next-pwa";

const withPWA = NextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateSitemap: true,
  generateRobotsTxt: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.questlog.site/api/v1/:path*", // Change to your FastAPI backend URL
        basePath: false,
      },
    ];
  },
};

export default withPWA(nextConfig);
