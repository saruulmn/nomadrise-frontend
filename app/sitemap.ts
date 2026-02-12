import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nomadrise.mn";
  const languages = ["en", "mn"];
  const routes = ["", "/scholarships", "/sponsor", "/events", "/terms", "/policy"];

  // Generate routes for each language
  const sitemapEntries = languages.flatMap((lang) =>
    routes.map((route) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1 : 0.8,
    }))
  );

  // Add root path
  sitemapEntries.unshift({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  });

  return sitemapEntries;
}
