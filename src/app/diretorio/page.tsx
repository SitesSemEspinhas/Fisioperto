import type { Metadata } from "next";
import { Users } from "lucide-react";

import { SearchBar } from "@/components/search-bar";
import { PhysioCard } from "@/components/physio-card";
import { listPhysiotherapists } from "@/lib/data";
import { getSpecialty, getConcelho } from "@/lib/reference";

export const metadata: Metadata = {
  title: "Diretório de fisioterapeutas ao domicílio",
  description:
    "Explore fisioterapeutas verificados pela OFP para atendimento ao domicílio em Portugal. Filtre por especialidade clínica e concelho.",
  alternates: { canonical: "/diretorio" },
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DiretorioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const especialidade = first(params.especialidade);
  const concelho = first(params.concelho);

  const spec = especialidade ? getSpecialty(especialidade) : undefined;
  const conc = concelho ? getConcelho(concelho) : undefined;

  const physios = await listPhysiotherapists({
    especialidade: spec?.slug,
    concelho: conc?.slug,
  });

  const titleParts: string[] = ["Fisioterapeutas"];
  if (spec) titleParts.push(`de ${spec.short}`);
  if (conc) titleParts.push(`em ${conc.name}`);
  const heading = titleParts.join(" ");

  return (
    <div className="container py-10 md:py-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Todos os profissionais listados têm cédula validada pela Ordem dos
          Fisioterapeutas e prestam serviço ao domicílio.
        </p>
      </header>

      <SearchBar
        className="mt-6"
        defaultEspecialidade={spec?.slug}
        defaultConcelho={conc?.slug}
      />

      <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" aria-hidden="true" />
        {physios.length === 1
          ? "1 profissional encontrado"
          : `${physios.length} profissionais encontrados`}
      </div>

      {physios.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {physios.map((p) => (
            <PhysioCard key={p.id} physio={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed bg-muted/30 p-10 text-center">
          <h2 className="text-lg font-semibold">
            Ainda não há profissionais para esta pesquisa
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Experimente alargar a pesquisa — escolha outra especialidade ou um
            concelho vizinho. Estamos a crescer todas as semanas.
          </p>
        </div>
      )}
    </div>
  );
}
