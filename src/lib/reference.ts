/**
 * Dados de referência (espelham supabase/seed.sql).
 * Usados pela UI de pesquisa e para gerar as rotas SEO /[especialidade]/[concelho]
 * sem depender de uma chamada à base de dados.
 * Os slugs DEVEM corresponder exatamente aos de seed.sql.
 */

export interface SpecialtyRef {
  slug: string;
  name: string;
  /** Rótulo curto para chips/filtros. */
  short: string;
  description: string;
  /** Frase usada nas landings SEO. */
  seoLead: string;
}

export interface ConcelhoRef {
  slug: string;
  name: string;
  distrito: string;
}

export const specialties: SpecialtyRef[] = [
  {
    slug: "ortopedica",
    name: "Fisioterapia Ortopédica e Traumatológica",
    short: "Ortopédica",
    description: "Fraturas, próteses, lesões musculares, dores articulares.",
    seoLead:
      "Recuperação de fraturas, próteses e lesões musculoesqueléticas, no conforto de casa.",
  },
  {
    slug: "neurologica",
    name: "Fisioterapia Neurológica",
    short: "Neurológica",
    description: "AVC, Parkinson, esclerose múltipla, paralisia cerebral.",
    seoLead:
      "Reabilitação após AVC e em doenças neurológicas, com acompanhamento ao domicílio.",
  },
  {
    slug: "geriatrica",
    name: "Fisioterapia Geriátrica",
    short: "Geriátrica",
    description: "Quedas, mobilidade reduzida, demência, pós-hospitalização.",
    seoLead:
      "Apoio à mobilidade e prevenção de quedas em pessoas idosas, em casa.",
  },
  {
    slug: "respiratoria",
    name: "Fisioterapia Respiratória",
    short: "Respiratória",
    description: "DPOC, asma, pós-COVID, fibrose cística.",
    seoLead:
      "Reabilitação respiratória para DPOC, pós-COVID e outras condições, ao domicílio.",
  },
  {
    slug: "pos-cirurgica",
    name: "Fisioterapia Pós-cirúrgica",
    short: "Pós-cirúrgica",
    description: "Recuperação após intervenção cirúrgica.",
    seoLead:
      "Recuperação funcional após cirurgia, sem ter de sair de casa.",
  },
  {
    slug: "pediatrica",
    name: "Fisioterapia Pediátrica",
    short: "Pediátrica",
    description: "Crianças e adolescentes, atrasos de desenvolvimento.",
    seoLead:
      "Acompanhamento do desenvolvimento motor de crianças, em ambiente familiar.",
  },
  {
    slug: "oncologica",
    name: "Fisioterapia Oncológica",
    short: "Oncológica",
    description: "Reabilitação durante e após tratamentos de cancro.",
    seoLead:
      "Reabilitação durante e após tratamentos oncológicos, com cuidado e proximidade.",
  },
  {
    slug: "desportiva",
    name: "Fisioterapia Desportiva",
    short: "Desportiva",
    description: "Lesões desportivas, retorno ao treino.",
    seoLead:
      "Tratamento de lesões desportivas e retorno seguro ao treino, ao domicílio.",
  },
];

export const concelhos: ConcelhoRef[] = [
  { slug: "olhao", name: "Olhão", distrito: "Faro" },
  { slug: "faro", name: "Faro", distrito: "Faro" },
  { slug: "loule", name: "Loulé", distrito: "Faro" },
  { slug: "tavira", name: "Tavira", distrito: "Faro" },
  { slug: "portimao", name: "Portimão", distrito: "Faro" },
  { slug: "lagos", name: "Lagos", distrito: "Faro" },
  { slug: "albufeira", name: "Albufeira", distrito: "Faro" },
  { slug: "silves", name: "Silves", distrito: "Faro" },
  { slug: "lisboa", name: "Lisboa", distrito: "Lisboa" },
  { slug: "sintra", name: "Sintra", distrito: "Lisboa" },
  { slug: "cascais", name: "Cascais", distrito: "Lisboa" },
  { slug: "oeiras", name: "Oeiras", distrito: "Lisboa" },
  { slug: "porto", name: "Porto", distrito: "Porto" },
  { slug: "vila-nova-de-gaia", name: "Vila Nova de Gaia", distrito: "Porto" },
  { slug: "matosinhos", name: "Matosinhos", distrito: "Porto" },
  { slug: "braga", name: "Braga", distrito: "Braga" },
  { slug: "coimbra", name: "Coimbra", distrito: "Coimbra" },
  { slug: "aveiro", name: "Aveiro", distrito: "Aveiro" },
  { slug: "setubal", name: "Setúbal", distrito: "Setúbal" },
  { slug: "funchal", name: "Funchal", distrito: "Madeira" },
];

export function getSpecialty(slug: string): SpecialtyRef | undefined {
  return specialties.find((s) => s.slug === slug);
}

export function getConcelho(slug: string): ConcelhoRef | undefined {
  return concelhos.find((c) => c.slug === slug);
}

/** Concelhos agrupados por distrito (para selects e SEO). */
export function concelhosByDistrito(): Record<string, ConcelhoRef[]> {
  return concelhos.reduce<Record<string, ConcelhoRef[]>>((acc, c) => {
    (acc[c.distrito] ??= []).push(c);
    return acc;
  }, {});
}
