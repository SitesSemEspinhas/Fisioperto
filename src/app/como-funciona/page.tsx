import type { Metadata } from "next";
import Link from "next/link";
import { Search, ShieldCheck, HeartHandshake, House } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";

export const metadata: Metadata = {
  title: "Como funciona",
  description:
    "Saiba como encontrar um fisioterapeuta verificado pela OFP para atendimento ao domicílio, em três passos simples.",
  alternates: { canonical: "/como-funciona" },
};

const steps = [
  {
    icon: Search,
    title: "1. Pesquise por especialidade e concelho",
    text: "Diga-nos o tipo de ajuda (ex.: neurológica, geriátrica) e a sua zona. Não precisa de saber o termo clínico exato.",
  },
  {
    icon: ShieldCheck,
    title: "2. Escolha com confiança",
    text: "Todos os perfis mostram o selo Verificado OFP — a cédula profissional foi validada junto da Ordem dos Fisioterapeutas.",
  },
  {
    icon: HeartHandshake,
    title: "3. Envie um pedido de contacto",
    text: "Descreva a situação e envie um pedido gratuito. O profissional recebe a sua mensagem e responde diretamente.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
          <House className="h-4 w-4" aria-hidden="true" />
          Fisioterapia ao domicílio
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
          Como funciona
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Encontrar ajuda de confiança não tem de ser complicado. Veja como.
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <step.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <h2 className="text-center text-xl font-semibold">
          Comece a sua pesquisa
        </h2>
        <SearchBar className="mt-4" />
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/diretorio">Ver todos os fisioterapeutas</Link>
        </Button>
      </div>
    </div>
  );
}
