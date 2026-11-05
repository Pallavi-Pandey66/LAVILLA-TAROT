import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type AuthState = {
  user: User | null;
  profile: Profile | null;
  profileError: Error | null;
  /** True until the stored session has been checked in the browser. */
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  profileError: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await getSupabase().from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      return data as Profile;
    },
    retry: false,
  });

  useEffect(() => {
    const supabase = getSupabase();
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    supabase.auth.getUser()
      .then(({ data }) => { if (active) setUser(data.user ?? null); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [queryClient]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await getSupabase().auth.signOut();
  };

  return <AuthContext.Provider value={{ user, loading, signOut, profile: profileQuery.data ?? null, profileError: profileQuery.error }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
