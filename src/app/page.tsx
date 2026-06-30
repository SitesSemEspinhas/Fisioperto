import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Search,
  House,
  Stethoscope,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { specialties, concelhos } from "@/lib/reference";

const steps = [
  {
    icon: Search,
    title: "Pesquise",
    text: "Escolha a especialidade clínica e o seu concelho. Sem precisar de saber o termo técnico exato.",
  },
  {
    icon: ShieldCheck,
    title: "Compare com confiança",
    text: "Veja perfis de fisioterapeutas com cédula validada pela Ordem dos Fisioterapeutas.",
  },
  {
    icon: HeartHandshake,
    title: "Contacte diretamente",
    text: "Envie um pedido de contacto sem custos e combine o acompanhamento ao domicílio.",
  },
];

const trustPoints = [
  { icon: ShieldCheck, label: "Cédula OFP validada" },
  { icon: Stethoscope, label: "8 especialidades clínicas" },
  { icon: House, label: "Atendimento ao domicílio" },
];

export default function HomePage() {
  const topConcelhos = concelhos.slice(0, 8);

  return (
    <>
      {/* HERÓI */}
      <section className="relative overflow-hidden border-b bg-grid-clinical">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Fisioterapeutas verificados pela OFP
            </span>

            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Fisioterapia ao domicílio,{" "}
              <span className="text-primary">com confiança.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
              Encontre um fisioterapeuta com a especialidade certa, no seu
              concelho, com cédula profissional validada. Sem sair de casa.
            </p>

            <SearchBar className="mx-auto mt-8 max-w-2xl" />

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {trustPoints.map((point) => (
                <li key={point.label} className="inline-flex items-center gap-2">
                  <point.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  {point.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Como funciona</h2>
          <p className="mt-3 text-muted-foreground">
            Três passos simples para encontrar ajuda de confiança.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} className="border-border/70">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 flex items-center gap-2 text-lg font-semibold">
                  <span className="text-sm text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section className="border-y bg-muted/30">
        <div className="container py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight">
                Pesquise por especialidade clínica
              </h2>
              <p className="mt-3 text-muted-foreground">
                Cada situação clínica tem a sua abordagem. Escolha a área que
                precisa.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/diretorio">
                Ver diretório completo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.map((s) => (
              <Link
                key={s.slug}
                href={`/diretorio?especialidade=${s.slug}`}
                className="group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <Stethoscope
                  className="h-6 w-6 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-semibold group-hover:text-primary">
                  {s.short}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONCELHOS POPULARES */}
      <section className="container py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">
            Encontre perto de si
          </h2>
          <p className="mt-3 text-muted-foreground">
            Comece pelos concelhos com mais procura.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {topConcelhos.map((c) => (
            <Button key={c.slug} asChild variant="secondary" size="sm">
              <Link href={`/diretorio?concelho=${c.slug}`}>
                <MapPin className="h-4 w-4" />
                {c.name}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {/* CTA PROFISSIONAIS */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="container flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              É fisioterapeuta? Ganhe presença digital.
            </h2>
            <p className="mt-3 text-primary-foreground/90">
              Crie o seu perfil verificado e receba pedidos de pacientes na sua
              zona. Durante o beta, é totalmente gratuito.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="shrink-0">
            <Link href="/para-profissionais">
              Criar perfil gratuito
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
