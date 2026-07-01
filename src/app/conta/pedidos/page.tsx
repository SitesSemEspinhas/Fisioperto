import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Phone, MapPin, Stethoscope, Inbox } from "lucide-react";

import { ContactStatusControl } from "@/components/account/contact-status-control";
import { getSessionUser } from "@/lib/auth";
import { getPhysioForUser, getReferenceForForms } from "@/lib/account";
import { getContactRequestsFor } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pedidos de contacto",
  robots: { index: false, follow: false },
};

const dateFmt = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function ContaPedidosPage() {
  const user = await getSessionUser();
  if (!user) redirect("/entrar?redirect=/conta/pedidos");

  if (user.profile?.role !== "physiotherapist") {
    redirect("/conta/favoritos");
  }

  const physio = await getPhysioForUser(user.id);
  if (!physio) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold">Ainda não tem perfil</h1>
        <p className="mt-2 text-muted-foreground">
          Crie o seu perfil profissional para começar a receber pedidos.
        </p>
        <Link
          href="/conta/perfil"
          className="mt-4 inline-block font-medium text-primary hover:underline"
        >
          Criar o meu perfil →
        </Link>
      </div>
    );
  }

  const [requests, { specialties, concelhos }] = await Promise.all([
    getContactRequestsFor(physio.id),
    getReferenceForForms(),
  ]);
  const specName = new Map(specialties.map((s) => [s.id, s.name]));
  const concName = new Map(concelhos.map((c) => [c.id, c.name]));

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pedidos de contacto</h1>
        <p className="mt-1 text-muted-foreground">
          {requests.length === 0
            ? "Ainda não recebeu pedidos."
            : `${requests.length} pedido(s) recebido(s).`}
        </p>
      </header>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/30 p-10 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            Quando um paciente enviar um pedido através do seu perfil, aparece aqui.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => (
            <li key={r.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.sender_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {dateFmt.format(new Date(r.created_at))}
                  </p>
                </div>
                <ContactStatusControl id={r.id} status={r.status} />
              </div>

              <p className="mt-3 whitespace-pre-line text-sm text-foreground/90">
                {r.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <a
                  href={`mailto:${r.sender_email}`}
                  className="flex items-center gap-1.5 hover:text-foreground"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {r.sender_email}
                </a>
                {r.sender_phone && (
                  <a
                    href={`tel:${r.sender_phone}`}
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {r.sender_phone}
                  </a>
                )}
                {r.specialty_id && specName.get(r.specialty_id) && (
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4" aria-hidden="true" />
                    {specName.get(r.specialty_id)}
                  </span>
                )}
                {r.concelho_id && concName.get(r.concelho_id) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {concName.get(r.concelho_id)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
