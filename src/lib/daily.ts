import { useEffect, useState } from "react";
import type { OracleCardData } from "@/data/deck";
import { useAuth } from "./auth";
import { dailyCardFor, getGuestId, localDateKey } from "./oracle";

/** Today's card for this person. Null until the browser has resolved who they are. */
export function useDailyCard(): { card: OracleCardData | null; dateKey: string | null } {
  const { user, loading } = useAuth();
  const [state, setState] = useState<{ card: OracleCardData | null; dateKey: string | null }>({
    card: null,
    dateKey: null,
  });

  useEffect(() => {
    if (loading) return;
    const seed = user?.id ?? getGuestId();
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const key = localDateKey();
      setState({ card: dailyCardFor(seed, key), dateKey: key });
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      timer = setTimeout(update, midnight.getTime() - now.getTime());
    };
    update();
    return () => clearTimeout(timer);
  }, [user, loading]);

  return state;
}
