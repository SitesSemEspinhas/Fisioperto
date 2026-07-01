"use client";

import { updateContactStatusAction } from "@/app/actions/profile";
import type { ContactStatus } from "@/lib/database.types";

const OPTIONS: { value: ContactStatus; label: string }[] = [
  { value: "new", label: "Novo" },
  { value: "read", label: "Lido" },
  { value: "replied", label: "Respondido" },
  { value: "archived", label: "Arquivado" },
];

export function ContactStatusControl({
  id,
  status,
}: {
  id: string;
  status: ContactStatus;
}) {
  return (
    <form action={updateContactStatusAction}>
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        Estado do pedido
      </label>
      <select
        id={`status-${id}`}
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
}
