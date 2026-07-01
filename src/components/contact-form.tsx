"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactRequest, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = { ok: false, message: "" };

export function ContactForm({
  physiotherapistId,
  physioName,
  especialidade,
  concelho,
}: {
  physiotherapistId: string;
  physioName: string;
  especialidade?: string;
  concelho?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    submitContactRequest,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const succeeded = state.ok && state.message.length > 0;

  useEffect(() => {
    if (state.message) {
      if (state.ok) {
        toast.success(state.message);
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  if (succeeded) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h3 className="mt-3 font-semibold">Pedido enviado</h3>
        <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="physiotherapistId" value={physiotherapistId} />
      {especialidade && (
        <input type="hidden" name="especialidade" value={especialidade} />
      )}
      {concelho && <input type="hidden" name="concelho" value={concelho} />}

      {/* Honeypot anti-spam — escondido de utilizadores reais */}
      <div className="hidden" aria-hidden="true">
        <label>
          Não preencher
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sender_name">Nome</Label>
        <Input id="sender_name" name="sender_name" required autoComplete="name" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sender_email">Email</Label>
          <Input
            id="sender_email"
            name="sender_email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sender_phone">Telefone (opcional)</Label>
          <Input
            id="sender_phone"
            name="sender_phone"
            type="tel"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={`Descreva a situação e o que procura. Ex.: acompanhamento para ${physioName.split(" ")[0]} ao domicílio, algumas vezes por semana.`}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        <Send className="h-4 w-4" />
        {isPending ? "A enviar…" : "Enviar pedido de contacto"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Ao enviar, os seus dados são partilhados apenas com este profissional
        para lhe responder.
      </p>
    </form>
  );
}
