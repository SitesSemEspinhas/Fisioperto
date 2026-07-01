/**
 * Tipos da base de dados (escritos à mão a partir de supabase/schema.sql).
 * Estrutura compatível com o inferidor de tipos do supabase-js.
 * Em produção podem ser regenerados com:
 *   supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 */

export type UserRole = "patient" | "physiotherapist" | "admin";
export type PlanTier = "beta" | "basico" | "premium";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type ContactStatus = "new" | "read" | "replied" | "archived";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      specialties: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      concelhos: {
        Row: {
          id: string;
          name: string;
          distrito: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          distrito: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          distrito?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      physiotherapists: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          ofp_number: string | null;
          verification: VerificationStatus;
          verified_at: string | null;
          bio: string | null;
          years_experience: number | null;
          photo_url: string | null;
          video_url: string | null;
          contact_phone: string | null;
          contact_whatsapp: string | null;
          contact_email: string | null;
          clinic_lat: number | null;
          clinic_lng: number | null;
          plan: PlanTier;
          is_published: boolean;
          slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          ofp_number?: string | null;
          verification?: VerificationStatus;
          verified_at?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          photo_url?: string | null;
          video_url?: string | null;
          contact_phone?: string | null;
          contact_whatsapp?: string | null;
          contact_email?: string | null;
          clinic_lat?: number | null;
          clinic_lng?: number | null;
          plan?: PlanTier;
          is_published?: boolean;
          slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string;
          ofp_number?: string | null;
          verification?: VerificationStatus;
          verified_at?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          photo_url?: string | null;
          video_url?: string | null;
          contact_phone?: string | null;
          contact_whatsapp?: string | null;
          contact_email?: string | null;
          clinic_lat?: number | null;
          clinic_lng?: number | null;
          plan?: PlanTier;
          is_published?: boolean;
          slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      physiotherapist_specialties: {
        Row: { physiotherapist_id: string; specialty_id: string };
        Insert: { physiotherapist_id: string; specialty_id: string };
        Update: { physiotherapist_id?: string; specialty_id?: string };
        Relationships: [];
      };
      physiotherapist_concelhos: {
        Row: { physiotherapist_id: string; concelho_id: string };
        Insert: { physiotherapist_id: string; concelho_id: string };
        Update: { physiotherapist_id?: string; concelho_id?: string };
        Relationships: [];
      };
      favorites: {
        Row: { user_id: string; physiotherapist_id: string; created_at: string };
        Insert: {
          user_id: string;
          physiotherapist_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          physiotherapist_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_requests: {
        Row: {
          id: string;
          physiotherapist_id: string;
          patient_user_id: string | null;
          sender_name: string;
          sender_email: string;
          sender_phone: string | null;
          concelho_id: string | null;
          specialty_id: string | null;
          message: string;
          status: ContactStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          physiotherapist_id: string;
          patient_user_id?: string | null;
          sender_name: string;
          sender_email: string;
          sender_phone?: string | null;
          concelho_id?: string | null;
          specialty_id?: string | null;
          message: string;
          status?: ContactStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          physiotherapist_id?: string;
          patient_user_id?: string | null;
          sender_name?: string;
          sender_email?: string;
          sender_phone?: string | null;
          concelho_id?: string | null;
          specialty_id?: string | null;
          message?: string;
          status?: ContactStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      profile_views: {
        Row: {
          id: string;
          physiotherapist_id: string;
          concelho_id: string | null;
          viewer_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          physiotherapist_id: string;
          concelho_id?: string | null;
          viewer_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          physiotherapist_id?: string;
          concelho_id?: string | null;
          viewer_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      plan_tier: PlanTier;
      verification_status: VerificationStatus;
      contact_status: ContactStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Atalhos úteis
export type Physiotherapist =
  Database["public"]["Tables"]["physiotherapists"]["Row"];
export type Specialty = Database["public"]["Tables"]["specialties"]["Row"];
export type Concelho = Database["public"]["Tables"]["concelhos"]["Row"];
export type ContactRequest =
  Database["public"]["Tables"]["contact_requests"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
