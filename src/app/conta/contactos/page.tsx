import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/auth";
import { getContactRequestsByPatient } from "@/lib/data";
import type { ContactStatus } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Os meus contactos",
  robots: { index: false, follow: false },
};

const dateFmt = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const STATUS_LABEL: Record<ContactStatus, string> = {
  new: "Enviado",
  read: "Lido",
  replied: "Respondido",
  archived: "Arquivado",
};

function statusVariant(status: ContactStatus) {
  if (status === "replied") return "success" as const;
  if (status === "new") return "secondary" as const;
  return "muted" as const;
}

export default async function ContaContactosPage() {
  const user = await getSessionUser();
  if (!user) redirect("/entrar?redirect=/conta/contactos");

  const contactos = await getContactRequestsByPatient(user.id);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Os meus contactos</h1>
        <p className="mt-1 text-muted-foreground">
          Histórico dos pedidos que enviou a fisioterapeutas.
        </p>
      </header>

      {contactos.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/30 p-10 text-center">
          <Send className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            Ainda não enviou pedidos de contacto. Encontre um profissional no
            diretório.
          </p>
          <Link
            href="/diretorio"
            className="mt-4 inline-block font-medium text-primary hover:underline"
          >
            Ver diretório →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {contactos.map((c) => (
            <li key={c.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {c.physio_slug ? (
                      <Link
                        href={`/fisioterapeuta/${c.physio_slug}`}
                        className="hover:text-primary"
                      >
                        {c.physio_name ?? "Fisioterapeuta"}
                      </Link>
                    ) : (
                      (c.physio_name ?? "Fisioterapeuta")
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dateFmt.format(new Date(c.created_at))}
                  </p>
                </div>
                <Badge variant={statusVariant(c.status)}>
                  {STATUS_LABEL[c.status]}
                </Badge>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                {c.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
