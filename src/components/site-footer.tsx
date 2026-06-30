import Link from "next/link";

import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/config";
import { specialties } from "@/lib/reference";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const topSpecialties = specialties.slice(0, 5);

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              {siteConfig.tagline} Diretório de fisioterapeutas verificados pela
              Ordem dos Fisioterapeutas, com atendimento ao domicílio.
            </p>
          </div>

          <nav aria-label="Explorar">
            <h2 className="mb-3 text-sm font-semibold">Explorar</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="/diretorio">
                  Diretório completo
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/como-funciona">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/para-profissionais">
                  Para profissionais
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Especialidades">
            <h2 className="mb-3 text-sm font-semibold">Especialidades</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {topSpecialties.map((s) => (
                <li key={s.slug}>
                  <Link
                    className="hover:text-foreground"
                    href={`/diretorio?especialidade=${s.slug}`}
                  >
                    {s.short}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Conta">
            <h2 className="mb-3 text-sm font-semibold">Conta</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="/entrar">
                  Entrar
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/registar">
                  Criar conta
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Beta gratuito. Projeto em fase de validação.
          </p>
          <p>
            A verificação OFP confirma a cédula profissional; não substitui
            aconselhamento médico.
          </p>
        </div>
      </div>
    </footer>
  );
}
