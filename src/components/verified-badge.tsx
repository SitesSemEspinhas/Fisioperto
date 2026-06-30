import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Selo "Verificado OFP" — o diferencial de confiança nº1.
 * Só deve ser apresentado quando verification === 'verified'.
 */
export function VerifiedBadge({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "sm";
}) {
  return (
    <Badge
      variant="success"
      className={cn(size === "sm" && "px-2 py-0", className)}
      title="Cédula profissional validada junto da Ordem dos Fisioterapeutas"
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Verificado OFP
    </Badge>
  );
}
