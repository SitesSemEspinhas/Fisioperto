import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, Stethoscope, ChevronRight } from "lucide-react";

import { PhysioAvatar } from "@/components/physio-avatar";
import { VerifiedBadge } from "@/components/verified-badge";
import { ContactForm } from "@/components/contact-form";
import { ProfileViewTracker } from "@/components/profile-view-tracker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPhysiotherapistBySlug,
  getAllPublishedSlugs,
} from "@/lib/data";
import { getSpecialty } from "@/lib/reference";
import { siteConfig } from "@/lib/config";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const physio = await getPhysiotherapistBySlug(slug);
  if (!physio) {
    return { title: "Perfil não encontrado" };
  }

  const areas = physio.concelhos.map((c) => c.name).join(", ");
  const especialidades = physio.specialties.map((s) => s.name).join(", ");
  const description =
    physio.bio?.slice(0, 155) ??
    `Fisioterapeuta ao domicílio${areas ? ` em ${areas}` : ""}. ${especialidades}.`;

  return {
    title: `${physio.display_name} — Fisioterapia ao domicílio`,
    description,
    alternates: { canonical: `/fisioterapeuta/${physio.slug}` },
    openGraph: {
      type: "profile",
      title: `${physio.display_name} — ${siteConfig.name}`,
      description,
      images: physio.photo_url ? [{ url: physio.photo_url }] : undefined,
    },
  };
}

export default async function PhysioProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const physio = await getPhysiotherapistBySlug(slug);
  if (!physio) notFound();

  const areas = physio.concelhos.map((c) => c.name);

  // Dados estruturados JSON-LD (MedicalBusiness) para SEO.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: physio.display_name,
    description: physio.bio ?? undefined,
    image: physio.photo_url ?? undefined,
    url: `${siteConfig.url}/fisioterapeuta/${physio.slug}`,
    medicalSpecialty: physio.specialties.map((s) => s.name),
    areaServed: areas.map((name) => ({ "@type": "City", name })),
    availableService: {
      "@type": "MedicalProcedure",
      name: "Fisioterapia ao domicílio",
    },
    telephone: physio.contact_phone ?? undefined,
  };

  return (
    <div className="container py-8 md:py-12">
      <ProfileViewTracker physiotherapistId={physio.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Migalhas */}
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
        <span className="text-foreground">{physio.display_name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Coluna principal */}
        <div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <PhysioAvatar
              name={physio.display_name}
              photoUrl={physio.photo_url}
              size={112}
              className="h-28 w-28 shrink-0"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {physio.display_name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {physio.verification === "verified" && <VerifiedBadge />}
                {typeof physio.years_experience === "number" && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                    {physio.years_experience} anos de experiência
                  </span>
                )}
              </div>
              {areas.length > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {areas.join(" · ")}
                </p>
              )}
            </div>
          </div>

          {physio.bio && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Sobre</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/90">
                {physio.bio}
              </p>
            </section>
          )}

          {physio.specialties.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Especialidades</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {physio.specialties.map((s) => (
                  <Link
                    key={s.id}
                    href={`/diretorio?especialidade=${s.slug}`}
                    className="inline-flex"
                  >
                    <Badge variant="secondary" className="gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
                      {getSpecialty(s.slug)?.short ?? s.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {physio.concelhos.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Áreas de atuação</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {physio.concelhos.map((c) => (
                  <Link key={c.id} href={`/diretorio?concelho=${c.slug}`}>
                    <Badge variant="outline" className="gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {c.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Coluna de contacto */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Contactar {physio.display_name.split(" ")[0]}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm
                physiotherapistId={physio.id}
                physioName={physio.display_name}
                concelho={physio.concelhos[0]?.slug}
                especialidade={physio.specialties[0]?.slug}
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
