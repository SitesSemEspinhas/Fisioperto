import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetRequestForm } from "@/components/auth/reset-request-form";

export const metadata: Metadata = {
  title: "Recuperar password",
  robots: { index: false, follow: false },
};

export default function RecuperarPasswordPage() {
  return (
    <AuthShell
      title="Recuperar password"
      subtitle="Enviamos-lhe um link para definir uma nova password."
    >
      <ResetRequestForm />
    </AuthShell>
  );
}
