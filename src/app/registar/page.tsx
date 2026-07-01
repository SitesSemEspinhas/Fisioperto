import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function RegistarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/conta/perfil");

  const params = await searchParams;
  const perfil = first(params.perfil);

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Gratuito durante o beta. Sem compromissos."
    >
      <RegisterForm defaultRole={perfil} />
    </AuthShell>
  );
}
