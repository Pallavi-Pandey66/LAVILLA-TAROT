import { DECK, type OracleCardData } from "@/data/deck";

const NUMERALS: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(n: number): string {
  let out = "";
  let rest = n;
  for (const [value, sym] of NUMERALS) {
    while (rest >= value) {
      out += sym;
      rest -= value;
    }
  }
  return out;
}

/** FNV-1a 32-bit hash — stable across browsers and sessions. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Local calendar date as YYYY-MM-DD (changes at the viewer's local midnight). */
export function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Same seed + same local date always yields the same card. */
export function dailyCardFor(seed: string, dateKey: string, deck: OracleCardData[] = DECK) {
  return deck[hashString(`${seed}::${dateKey}`) % deck.length]!;
}

/** Fisher–Yates shuffle returning a new array. */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const GUEST_KEY = "lumina.guest-id";

export function getGuestId(): string {
  try {
    let v = window.localStorage.getItem(GUEST_KEY);
    if (!v) {
      v = crypto.randomUUID();
      window.localStorage.setItem(GUEST_KEY, v);
    }
    return v;
  } catch {
    return "guest";
  }
}

export const SPREADS = {
  single: { label: "Single Card", positions: ["Your card"] },
  three: { label: "Three Card", positions: ["Past", "Present", "Future"] },
} as const;

export type SpreadType = keyof typeof SPREADS;
