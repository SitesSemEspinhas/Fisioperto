import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

import { PhysioCard } from "@/components/physio-card";
import { getSessionUser } from "@/lib/auth";
import { getFavoritePhysios } from "@/lib/data";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false, follow: false },
};

export default async function ContaFavoritosPage() {
  const user = await getSessionUser();
  if (!user) redirect("/entrar?redirect=/conta/favoritos");

  const favoritos = await getFavoritePhysios(user.id);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Favoritos</h1>
        <p className="mt-1 text-muted-foreground">
          Os fisioterapeutas que guardou para mais tarde.
        </p>
      </header>

      {favoritos.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/30 p-10 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            Ainda não guardou nenhum fisioterapeuta. Explore o diretório e toque
            em <span className="font-medium">Guardar</span> num perfil.
          </p>
          <Link
            href="/diretorio"
            className="mt-4 inline-block font-medium text-primary hover:underline"
          >
            Ver diretório →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {favoritos.map((p) => (
            <PhysioCard key={p.id} physio={p} />
          ))}
        </div>
      )}
    </div>
  );
}
