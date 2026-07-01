import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config";
import {
  getAllPublishedSlugs,
  getActiveSpecialtyConcelhoCombos,
} from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/diretorio`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/como-funciona`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/para-profissionais`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let slugs: string[] = [];
  let combos: { especialidade: string; concelho: string }[] = [];
  try {
    [slugs, combos] = await Promise.all([
      getAllPublishedSlugs(),
      getActiveSpecialtyConcelhoCombos(),
    ]);
  } catch {
    // Sem BD disponível: devolve apenas as rotas estáticas.
  }

  const profileRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/fisioterapeuta/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const landingRoutes: MetadataRoute.Sitemap = combos.map((c) => ({
    url: `${base}/${c.especialidade}/${c.concelho}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...profileRoutes, ...landingRoutes];
}
