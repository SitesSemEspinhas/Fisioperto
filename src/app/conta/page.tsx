import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";

export default async function ContaIndex() {
  const user = await getSessionUser();
  if (!user) redirect("/entrar?redirect=/conta");
  redirect(
    user.profile?.role === "physiotherapist"
      ? "/conta/perfil"
      : "/conta/favoritos",
  );
}
