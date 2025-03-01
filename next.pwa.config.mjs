import NextPWA from "next-pwa";

const withPWA = NextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8000/api/v1/:path*",
        basePath: false,
      },
    ];
  },
};

export default withPWA(nextConfig);
