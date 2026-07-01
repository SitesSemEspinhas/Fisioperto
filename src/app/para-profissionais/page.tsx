import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, TrendingUp, MapPin, Euro, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Para profissionais",
  description:
    "Fisioterapeuta? Crie um perfil verificado no FisioPerto e receba pedidos de pacientes na sua zona. Durante o beta é gratuito.",
  alternates: { canonical: "/para-profissionais" },
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Selo Verificado OFP",
    text: "A validação da sua cédula transmite confiança imediata aos pacientes e famílias.",
  },
  {
    icon: MapPin,
    title: "Leads na sua zona",
    text: "Apareça nas pesquisas por especialidade e concelho e receba pedidos de contacto qualificados.",
  },
  {
    icon: TrendingUp,
    title: "Presença digital sem esforço",
    text: "Um perfil profissional pronto a partilhar, otimizado para aparecer no Google.",
  },
  {
    icon: Euro,
    title: "Gratuito durante o beta",
    text: "Sem custos nesta fase. No futuro, planos a partir de menos do que o valor de uma sessão por mês.",
  },
];

export default function ParaProfissionaisPage() {
  return (
    <div>
      <section className="border-b bg-grid-clinical">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Ganhe presença digital e{" "}
              <span className="text-primary">leads qualificados</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              O FisioPerto liga fisioterapeutas verificados a pacientes que
              procuram acompanhamento ao domicílio na sua zona. Crie o seu perfil
              em minutos.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/registar?perfil=fisioterapeuta">
                  Criar perfil gratuito
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/entrar">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-semibold">{b.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
