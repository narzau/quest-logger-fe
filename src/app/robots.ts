import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/profile/", "/settings/"],
      },
    ],
    sitemap: "https://quest-logger-fe.vercel.app/sitemap.xml",
  };
}
