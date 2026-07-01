"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction, type AuthState } from "@/app/actions/auth";

const initial: AuthState = { ok: false, message: "" };

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, initial);

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">Nova password</Label>
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
        {pending ? "A guardar…" : "Definir nova password"}
      </Button>
    </form>
  );
}
