"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/app/actions/favorites";

export function FavoriteButton({
  physiotherapistId,
  initialFavorited,
  isAuthenticated,
  redirectTo,
  className,
}: {
  physiotherapistId: string;
  initialFavorited: boolean;
  isAuthenticated: boolean;
  redirectTo: string;
  className?: string;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/entrar?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    startTransition(async () => {
      const res = await toggleFavoriteAction(physiotherapistId);
      if (res.needAuth) {
        router.push(`/entrar?redirect=${encodeURIComponent(redirectTo)}`);
        return;
      }
      if (!res.ok) {
        toast.error("Não foi possível atualizar os favoritos.");
        return;
      }
      setFavorited(res.favorited);
      toast.success(
        res.favorited ? "Adicionado aos favoritos." : "Removido dos favoritos.",
      );
    });
  }

  return (
    <Button
      type="button"
      variant={favorited ? "secondary" : "outline"}
      onClick={handleClick}
      disabled={pending}
      aria-pressed={favorited}
      className={cn(className)}
    >
      <Heart
        className={cn("h-4 w-4", favorited && "fill-current text-primary")}
        aria-hidden="true"
      />
      {favorited ? "Guardado" : "Guardar"}
    </Button>
  );
}
