
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = "superadmin" | "admin" | "user";

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  companyId?: string;
  companyName?: string;
}

export interface AuthUser extends SupabaseUser {
  profile?: Profile;
}
