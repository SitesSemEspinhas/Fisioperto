"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { User, Stethoscope, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signUpAction, type AuthState } from "@/app/actions/auth";

const initial: AuthState = { ok: false, message: "" };

const roles = [
  {
    value: "patient",
    icon: User,
    title: "Sou paciente / familiar",
    text: "Procuro um fisioterapeuta e quero guardar favoritos.",
  },
  {
    value: "physiotherapist",
    icon: Stethoscope,
    title: "Sou fisioterapeuta",
    text: "Quero criar o meu perfil e receber pedidos.",
  },
];

export function RegisterForm({ defaultRole }: { defaultRole?: string }) {
  const [state, action, pending] = useActionState(signUpAction, initial);
  const [role, setRole] = useState(
    defaultRole === "fisioterapeuta" || defaultRole === "physiotherapist"
      ? "physiotherapist"
      : "patient",
  );

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message);
  }, [state]);

  if (state.ok && state.message) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h3 className="mt-3 font-semibold">Quase lá</h3>
        <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/entrar">Ir para o início de sessão</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="role" value={role} />

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Tipo de conta</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((r) => {
            const active = role === r.value;
            return (
              <button
                type="button"
                key={r.value}
                onClick={() => setRole(r.value)}
                aria-pressed={active}
                className={cn(
                  "rounded-lg border p-4 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-primary/40 hover:bg-accent/40",
                )}
              >
                <r.icon
                  className={cn(
                    "h-5 w-5",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                  aria-hidden="true"
                />
                <span className="mt-2 block text-sm font-semibold">
                  {r.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {r.text}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="full_name">Nome</Label>
        <Input id="full_name" name="full_name" required autoComplete="name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "A criar conta…" : "Criar conta"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
