"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { getSpecialty } from "@/lib/reference";
import { saveProfileAction, type ProfileState } from "@/app/actions/profile";
import type { Physiotherapist, VerificationStatus } from "@/lib/database.types";
import type { SpecialtyTag, ConcelhoTag } from "@/lib/data";

const initial: ProfileState = { ok: false, message: "" };

function VerificationBanner({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-success" aria-hidden="true" />
        <div>
          <p className="font-medium text-success">Cédula verificada</p>
          <p className="text-sm text-muted-foreground">
            O seu perfil apresenta o selo Verificado OFP.
          </p>
        </div>
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" aria-hidden="true" />
        <div>
          <p className="font-medium text-destructive">Verificação recusada</p>
          <p className="text-sm text-muted-foreground">
            Confirme o número de cédula e volte a submeter.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <ShieldQuestion className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
      <div>
        <p className="font-medium">Verificação pendente</p>
        <p className="text-sm text-muted-foreground">
          Submeta o número de cédula OFP. Após validação manual, o selo
          Verificado OFP aparece no seu perfil e este passa a surgir no diretório.
        </p>
      </div>
    </div>
  );
}

export function ProfileEditor({
  physio,
  userId,
  specialties,
  concelhos,
  selectedSpecialtyIds,
  selectedConcelhoIds,
}: {
  physio: Physiotherapist | null;
  userId: string;
  specialties: SpecialtyTag[];
  concelhos: ConcelhoTag[];
  selectedSpecialtyIds: string[];
  selectedConcelhoIds: string[];
}) {
  const [state, action, pending] = useActionState(saveProfileAction, initial);
  const [photoUrl, setPhotoUrl] = useState(physio?.photo_url ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  // Agrupar concelhos por distrito
  const byDistrito = concelhos.reduce<Record<string, ConcelhoTag[]>>((acc, c) => {
    (acc[c.distrito] ??= []).push(c);
    return acc;
  }, {});

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem é demasiado grande (máx. 5 MB).");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setPhotoUrl(data.publicUrl);
      toast.success("Fotografia carregada.");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível carregar a fotografia.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-8">
      <VerificationBanner status={physio?.verification ?? "pending"} />

      {/* Foto */}
      <section className="space-y-3">
        <Label>Fotografia</Label>
        <div className="flex items-center gap-4">
          <Image
            src={
              photoUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                physio?.display_name ?? "Perfil",
              )}&background=0e7490&color=fff&size=256&format=png`
            }
            alt="Pré-visualização da fotografia"
            width={80}
            height={80}
            className="h-20 w-20 rounded-full border object-cover"
            unoptimized
          />
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4" />
              {uploading ? "A carregar…" : "Carregar foto"}
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">JPG ou PNG, máx. 5 MB.</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />
        </div>
        <input type="hidden" name="photo_url" value={photoUrl} />
      </section>

      {/* Dados */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="display_name">Nome a apresentar</Label>
          <Input
            id="display_name"
            name="display_name"
            required
            defaultValue={physio?.display_name ?? ""}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={5}
            defaultValue={physio?.bio ?? ""}
            placeholder="Apresente-se em poucas linhas: áreas de foco, abordagem, experiência."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="years_experience">Anos de experiência</Label>
          <Input
            id="years_experience"
            name="years_experience"
            type="number"
            min={0}
            max={60}
            defaultValue={physio?.years_experience ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">Telefone</Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            type="tel"
            defaultValue={physio?.contact_phone ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_whatsapp">WhatsApp</Label>
          <Input
            id="contact_whatsapp"
            name="contact_whatsapp"
            type="tel"
            defaultValue={physio?.contact_whatsapp ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_email">Email de contacto</Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={physio?.contact_email ?? ""}
          />
        </div>
      </section>

      {/* Cédula OFP */}
      <section className="space-y-1.5">
        <Label htmlFor="ofp_number">Número de cédula OFP</Label>
        <Input
          id="ofp_number"
          name="ofp_number"
          defaultValue={physio?.ofp_number ?? ""}
          placeholder="Ex.: FT-12345"
        />
        <p className="text-xs text-muted-foreground">
          Submeter ou alterar a cédula coloca o perfil em validação.
        </p>
      </section>

      {/* Especialidades */}
      <section className="space-y-3">
        <Label>Especialidades</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {specialties.map((s) => (
            <label
              key={s.id}
              className="flex items-center gap-2.5 rounded-md border p-3 text-sm hover:bg-accent/40"
            >
              <Checkbox
                name="specialties"
                value={s.id}
                defaultChecked={selectedSpecialtyIds.includes(s.id)}
              />
              {getSpecialty(s.slug)?.short ?? s.name}
            </label>
          ))}
        </div>
      </section>

      {/* Concelhos */}
      <section className="space-y-3">
        <Label>Concelhos de atuação</Label>
        <div className="space-y-4">
          {Object.entries(byDistrito).map(([distrito, list]) => (
            <div key={distrito}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {distrito}
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {list.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2.5 rounded-md border p-2.5 text-sm hover:bg-accent/40"
                  >
                    <Checkbox
                      name="concelhos"
                      value={c.id}
                      defaultChecked={selectedConcelhoIds.includes(c.id)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Publicação */}
      <section className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            name="is_published"
            defaultChecked={physio?.is_published ?? false}
            className={cn("mt-0.5")}
          />
          <span>
            <span className="block text-sm font-medium">Publicar o meu perfil</span>
            <span className="block text-sm text-muted-foreground">
              Fica visível no diretório assim que a cédula estiver verificada.
            </span>
          </span>
        </label>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending || uploading}>
          {pending ? "A guardar…" : "Guardar perfil"}
        </Button>
        {physio?.slug && physio.is_published && (
          <a
            href={`/fisioterapeuta/${physio.slug}`}
            className="text-sm font-medium text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Ver perfil público →
          </a>
        )}
      </div>
    </form>
  );
}
