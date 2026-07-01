import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Definir nova password",
  robots: { index: false, follow: false },
};

export default function RedefinirPasswordPage() {
  return (
    <AuthShell
      title="Definir nova password"
      subtitle="Escolha uma nova password para a sua conta."
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
