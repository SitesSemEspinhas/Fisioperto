import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/conta/perfil");

  const params = await searchParams;
  const redirectTo = first(params.redirect);
  const erro = first(params.erro);

  return (
    <AuthShell title="Entrar" subtitle="Aceda à sua conta FisioPerto.">
      {erro === "confirmacao" && (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Não foi possível confirmar a ligação. Tente entrar ou peça um novo
          email.
        </p>
      )}
      <LoginForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
