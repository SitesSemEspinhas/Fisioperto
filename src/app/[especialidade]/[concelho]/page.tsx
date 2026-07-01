import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Stethoscope } from "lucide-react";

import { PhysioCard } from "@/components/physio-card";
import { Badge } from "@/components/ui/badge";
import { listPhysiotherapists } from "@/lib/data";
import {
  getSpecialty,
  getConcelho,
  specialties,
  concelhos,
} from "@/lib/reference";
import { siteConfig } from "@/lib/config";

// Renderizada no servidor a pedido (SSR) — ver nota em /fisioterapeuta/[slug].
export const dynamic = "force-dynamic";

type Params = Promise<{ especialidade: string; concelho: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { especialidade, concelho } = await params;
  const spec = getSpecialty(especialidade);
  const conc = getConcelho(concelho);
  if (!spec || !conc) return { title: "Página não encontrada" };

  const title = `Fisioterapia ${spec.short} ao domicílio em ${conc.name}`;
  const description = `${spec.seoLead} Encontre fisioterapeutas verificados pela OFP para ${spec.short.toLowerCase()} em ${conc.name} (distrito de ${conc.distrito}).`;

  return {
    title,
    description,
    alternates: { canonical: `/${spec.slug}/${conc.slug}` },
    openGraph: { title: `${title} · ${siteConfig.name}`, description },
  };
}

export default async function EspecialidadeConcelhoPage({
  params,
}: {
  params: Params;
}) {
  const { especialidade, concelho } = await params;
  const spec = getSpecialty(especialidade);
  const conc = getConcelho(concelho);
  if (!spec || !conc) notFound();

  const physios = await listPhysiotherapists({
    especialidade: spec.slug,
    concelho: conc.slug,
  });

  const title = `Fisioterapia ${spec.short} ao domicílio em ${conc.name}`;

  // Interligações SEO
  const outrasEspecialidades = specialties.filter((s) => s.slug !== spec.slug).slice(0, 6);
  const outrosConcelhos = concelhos.filter((c) => c.slug !== conc.slug).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: `${siteConfig.url}/${spec.slug}/${conc.slug}`,
    about: spec.name,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: physios.length,
      itemListElement: physios.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteConfig.url}/fisioterapeuta/${p.slug}`,
        name: p.display_name,
      })),
    },
  };

  return (
    <div className="container py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Migalhas"
        className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Início
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <Link href="/diretorio" className="hover:text-foreground">
          Diretório
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span className="text-foreground">
          {spec.short} em {conc.name}
        </span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{spec.seoLead}</p>
        <p className="mt-3 text-muted-foreground">
          Todos os profissionais têm cédula validada pela Ordem dos
          Fisioterapeutas e prestam serviço ao domicílio em {conc.name} (distrito
          de {conc.distrito}).
        </p>
      </header>

      {physios.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {physios.map((p) => (
            <PhysioCard key={p.id} physio={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed bg-muted/30 p-10 text-center">
          <h2 className="text-lg font-semibold">
            Ainda não há {spec.short.toLowerCase()} em {conc.name}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Estamos a crescer. Veja profissionais desta especialidade noutros
            concelhos, ou explore o diretório completo.
          </p>
          <Link
            href="/diretorio"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Ver diretório completo →
          </Link>
        </div>
      )}

      {/* Interligações SEO */}
      <section className="mt-14 grid gap-8 border-t pt-10 md:grid-cols-2">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Stethoscope className="h-5 w-5 text-primary" aria-hidden="true" />
            Outras especialidades em {conc.name}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {outrasEspecialidades.map((s) => (
              <Link key={s.slug} href={`/${s.slug}/${conc.slug}`}>
                <Badge variant="secondary">{s.short}</Badge>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
            {spec.short} noutros concelhos
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {outrosConcelhos.map((c) => (
              <Link key={c.slug} href={`/${spec.slug}/${c.slug}`}>
                <Badge variant="outline">{c.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
