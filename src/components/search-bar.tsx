"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { concelhos, specialties } from "@/lib/reference";

const ANY = "all";

export function SearchBar({
  defaultEspecialidade,
  defaultConcelho,
  className,
}: {
  defaultEspecialidade?: string;
  defaultConcelho?: string;
  className?: string;
}) {
  const router = useRouter();
  const [especialidade, setEspecialidade] = useState(
    defaultEspecialidade ?? ANY,
  );
  const [concelho, setConcelho] = useState(defaultConcelho ?? ANY);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Ambos escolhidos → landing SEO limpa /[especialidade]/[concelho]
    if (especialidade !== ANY && concelho !== ANY) {
      router.push(`/${especialidade}/${concelho}`);
      return;
    }

    // Caso contrário, diretório com filtros via query string
    const params = new URLSearchParams();
    if (especialidade !== ANY) params.set("especialidade", especialidade);
    if (concelho !== ANY) params.set("concelho", concelho);
    const qs = params.toString();
    router.push(qs ? `/diretorio?${qs}` : "/diretorio");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      aria-label="Pesquisar fisioterapeutas"
    >
      <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-1.5 text-left">
          <Label htmlFor="especialidade-trigger">Especialidade</Label>
          <Select value={especialidade} onValueChange={setEspecialidade}>
            <SelectTrigger id="especialidade-trigger" aria-label="Especialidade">
              <SelectValue placeholder="Qualquer especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Qualquer especialidade</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.short}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 text-left">
          <Label htmlFor="concelho-trigger">Concelho</Label>
          <Select value={concelho} onValueChange={setConcelho}>
            <SelectTrigger id="concelho-trigger" aria-label="Concelho">
              <SelectValue placeholder="Qualquer concelho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Qualquer concelho</SelectItem>
              {concelhos.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Search className="h-4 w-4" />
          Pesquisar
        </Button>
      </div>
    </form>
  );
}
