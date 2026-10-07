import type { Metadata } from "next";
import { site } from "@/data/site";

/** Builds page metadata with consistent canonical + Open Graph values. */
export function pageMetadata({
  title,
  description = site.description,
  path = "/",
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`,
      description,
      siteName: site.name,
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`,
      description,
    },
  };
}
