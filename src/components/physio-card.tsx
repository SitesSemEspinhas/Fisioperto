import Link from "next/link";
import { MapPin, Briefcase } from "lucide-react";

import { PhysioAvatar } from "@/components/physio-avatar";
import { VerifiedBadge } from "@/components/verified-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getSpecialty } from "@/lib/reference";
import type { PhysioCard as PhysioCardData } from "@/lib/data";

export function PhysioCard({ physio }: { physio: PhysioCardData }) {
  const href = `/fisioterapeuta/${physio.slug}`;
  const concelhoNames = physio.concelhos.map((c) => c.name);

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-4 pt-6">
        <div className="flex items-start gap-4">
          <PhysioAvatar
            name={physio.display_name}
            photoUrl={physio.photo_url}
            size={64}
            className="h-16 w-16 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold">
              <Link href={href} className="hover:text-primary">
                {physio.display_name}
              </Link>
            </h3>
            {physio.verification === "verified" && (
              <div className="mt-1">
                <VerifiedBadge size="sm" />
              </div>
            )}
            {typeof physio.years_experience === "number" && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                {physio.years_experience} anos de experiência
              </p>
            )}
          </div>
        </div>

        {physio.bio && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {physio.bio}
          </p>
        )}

        {physio.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {physio.specialties.map((s) => (
              <Badge key={s.id} variant="secondary">
                {getSpecialty(s.slug)?.short ?? s.name}
              </Badge>
            ))}
          </div>
        )}

        {concelhoNames.length > 0 && (
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{concelhoNames.join(" · ")}</span>
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={href}>Ver perfil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
