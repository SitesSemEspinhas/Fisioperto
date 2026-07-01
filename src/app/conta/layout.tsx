import { redirect } from "next/navigation";

import { AccountNav, type AccountNavItem } from "@/components/account/account-nav";
import { getSessionUser } from "@/lib/auth";

export default async function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/entrar?redirect=/conta");

  const isPhysio = user.profile?.role === "physiotherapist";
  const items: AccountNavItem[] = isPhysio
    ? [
        { href: "/conta/perfil", label: "O meu perfil" },
        { href: "/conta/pedidos", label: "Pedidos de contacto" },
      ]
    : [
        { href: "/conta/favoritos", label: "Favoritos" },
        { href: "/conta/contactos", label: "Os meus contactos" },
      ];

  return (
    <div className="container py-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-20 md:self-start">
          <div className="mb-4">
            <p className="text-sm font-semibold">
              {user.profile?.full_name ?? "A minha conta"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <AccountNav items={items} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
