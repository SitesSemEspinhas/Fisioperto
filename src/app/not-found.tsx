import Link from "next/link";
import { House, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100dvh-16rem)] flex-col items-center justify-center py-16 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        A página que procura pode ter sido movida ou já não existe. Encontre um
        fisioterapeuta no diretório.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <House className="h-4 w-4" />
            Voltar ao início
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/diretorio">
            <Search className="h-4 w-4" />
            Ver diretório
          </Link>
        </Button>
      </div>
    </div>
  );
}
