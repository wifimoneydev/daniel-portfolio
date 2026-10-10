import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllProjects } from "@/lib/content/loader";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/tech", "/projects", "/architecture", "/architecture/projects", "/lab", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const projects = getAllProjects().map((p) => ({
    url: `${site.url}${p.href}`,
    changeFrequency: "monthly" as const,
    priority: p.featured ? 0.9 : 0.6,
  }));
  return [...pages, ...projects];
}
