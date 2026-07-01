import Image from "next/image";

import { cn } from "@/lib/utils";

/** Avatar do fisioterapeuta. Usa photo_url ou gera um avatar de iniciais. */
export function PhysioAvatar({
  name,
  photoUrl,
  size = 64,
  className,
}: {
  name: string;
  photoUrl?: string | null;
  size?: number;
  className?: string;
}) {
  const src =
    photoUrl && photoUrl.length > 0
      ? photoUrl
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name,
        )}&background=0e7490&color=fff&size=256&format=png`;

  return (
    <Image
      src={src}
      alt={`Fotografia de ${name}`}
      width={size}
      height={size}
      className={cn(
        "rounded-full border bg-muted object-cover",
        className,
      )}
    />
  );
}
