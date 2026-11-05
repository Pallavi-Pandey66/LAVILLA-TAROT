import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth";
import type { SpreadType } from "./oracle";
import { getSupabase } from "./supabase";

export type Reading = {
  id: string;
  user_id: string;
  spread_type: SpreadType;
  card_ids: string[];
  intention: string | null;
  note: string | null;
  created_at: string;
};

export type NewReading = {
  spread_type: SpreadType;
  card_ids: string[];
  intention: string | null;
  note?: string | null;
};

const PENDING_KEY = "lumina.pending-reading";

export const readingsKey = (userId: string) => ["readings", userId] as const;
export const favoritesKey = (userId: string) => ["favorites", userId] as const;

export function useReadings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: readingsKey(user?.id ?? "anon"),
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from("readings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Reading[];
    },
  });
}

async function insertReading(r: NewReading) {
  const { data, error } = await getSupabase().from("readings").insert(r).select().single();
  if (error) throw error;
  return data as Reading;
}

export function useSaveReading() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: insertReading,
    onSuccess: () => {
      if (user) qc.invalidateQueries({ queryKey: readingsKey(user.id) });
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await getSupabase()
        .from("readings")
        .update({ note: note.trim() || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => user && qc.invalidateQueries({ queryKey: readingsKey(user.id) }),
  });
}

export function useDeleteReading() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase().from("readings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => user && qc.invalidateQueries({ queryKey: readingsKey(user.id) }),
  });
}

/** Keep a guest's reading so it can be saved right after they sign in. */
export function stashPendingReading(r: NewReading) {
  try {
    window.localStorage.setItem(PENDING_KEY, JSON.stringify(r));
  } catch {
    /* storage unavailable */
  }
}

/** Saves a stashed guest reading once a session exists. Mount once. */
export function usePendingReadingSync() {
  const { user } = useAuth();
  const save = useSaveReading();
  const ran = useRef<string | null>(null);
  useEffect(() => {
    if (!user || ran.current === user.id) return;
    ran.current = user.id;
    let pending: NewReading | null = null;
    try {
      const raw = window.localStorage.getItem(PENDING_KEY);
      pending = raw ? (JSON.parse(raw) as NewReading) : null;
    } catch {
      pending = null;
    }
    if (!pending) return;
    window.localStorage.removeItem(PENDING_KEY);
    save.mutate(pending, {
      onSuccess: () => toast("Your reading has been saved to your journal."),
      onError: () => toast("We could not save your reading. Please try again from the draw."),
    });
  }, [user, save]);
}

/* ---------- Favorites (bookmarks) ---------- */

export function useFavorites() {
  const { user } = useAuth();
  return useQuery({
    queryKey: favoritesKey(user?.id ?? "anon"),
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await getSupabase().from("favorites").select("card_id");
      if (error) throw error;
      return new Set((data ?? []).map((r: { card_id: string }) => r.card_id));
    },
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ cardId, on }: { cardId: string; on: boolean }) => {
      const sb = getSupabase();
      const { error } = on
        ? await sb.from("favorites").insert({ card_id: cardId })
        : await sb.from("favorites").delete().eq("card_id", cardId);
      if (error) throw error;
    },
    onMutate: async ({ cardId, on }) => {
      if (!user) return;
      const key = favoritesKey(user.id);
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Set<string>>(key);
      const next = new Set(prev ?? []);
      if (on) next.add(cardId);
      else next.delete(cardId);
      qc.setQueryData(key, next);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (user && ctx?.prev) qc.setQueryData(favoritesKey(user.id), ctx.prev);
      toast("We could not update your bookmark. Please try again.");
    },
    onSettled: () => user && qc.invalidateQueries({ queryKey: favoritesKey(user.id) }),
  });
}
