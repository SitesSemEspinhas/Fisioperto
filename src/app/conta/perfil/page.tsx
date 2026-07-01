import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProfileEditor } from "@/components/account/profile-editor";
import { getSessionUser } from "@/lib/auth";
import {
  getPhysioForUser,
  getSelectedTagIds,
  getReferenceForForms,
} from "@/lib/account";

export const metadata: Metadata = {
  title: "O meu perfil",
  robots: { index: false, follow: false },
};

export default async function ContaPerfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/entrar?redirect=/conta/perfil");

  if (user.profile?.role !== "physiotherapist") {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold">Área de fisioterapeutas</h1>
        <p className="mt-2 text-muted-foreground">
          Esta secção é para profissionais. A sua conta é de paciente.
        </p>
        <Link
          href="/diretorio"
          className="mt-4 inline-block font-medium text-primary hover:underline"
        >
          Ir para o diretório →
        </Link>
      </div>
    );
  }

  const physio = await getPhysioForUser(user.id);
  const { specialties, concelhos } = await getReferenceForForms();
  const { specialtyIds, concelhoIds } = physio
    ? await getSelectedTagIds(physio.id)
    : { specialtyIds: [], concelhoIds: [] };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">O meu perfil</h1>
        <p className="mt-1 text-muted-foreground">
          Preencha os dados que os pacientes veem no diretório.
        </p>
      </header>

      <ProfileEditor
        physio={physio}
        userId={user.id}
        specialties={specialties}
        concelhos={concelhos}
        selectedSpecialtyIds={specialtyIds}
        selectedConcelhoIds={concelhoIds}
      />
    </div>
  );
}
