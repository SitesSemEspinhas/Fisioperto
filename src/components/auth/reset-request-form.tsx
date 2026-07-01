"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  requestPasswordResetAction,
  type AuthState,
} from "@/app/actions/auth";

const initial: AuthState = { ok: false, message: "" };

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    initial,
  );

  useEffect(() => {
    /* mensagens mostradas inline abaixo */
  }, [state]);

  if (state.ok && state.message) {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <MailCheck className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/entrar">Voltar ao início de sessão</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email da conta</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {state.message && !state.ok && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "A enviar…" : "Enviar instruções"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/entrar" className="font-medium text-primary hover:underline">
          Voltar
        </Link>
      </p>
    </form>
  );
}
