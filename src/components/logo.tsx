import Link from "next/link";
import { HeartPulse } from "lucide-react";

import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Logótipo: ícone clínico simples + nome (facilmente substituível — ver CLAUDE.md §6). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-md font-semibold tracking-tight",
        className,
      )}
      aria-label={`${siteConfig.name} — página inicial`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <HeartPulse className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-lg">
        <span className="text-foreground">Fisio</span>
        <span className="text-primary">Perto</span>
      </span>
    </Link>
  );
}
