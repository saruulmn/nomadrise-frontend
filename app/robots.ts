import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/scholarships", "/sponsor", "/events", "/terms", "/policy"],
        disallow: [
          "/admin",
          "/api",
          "/dashboard",
          "/login",
          "/register",
          "/logout",
          "/_next",
          "/private",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: "https://nomadrise.mn/sitemap.xml",
    host: "https://nomadrise.mn",
  };
}
