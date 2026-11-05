import { describe, expect, it } from "vitest";
import { DECK } from "@/data/deck";
import { dailyCardFor, localDateKey, toRoman } from "./oracle";

describe("deck", () => {
  it("has exactly 36 cards with unique numbers 1–36 and unique slugs", () => {
    expect(DECK).toHaveLength(36);
    expect(new Set(DECK.map((c) => c.number)).size).toBe(36);
    expect(new Set(DECK.map((c) => c.slug)).size).toBe(36);
    expect(DECK[0]!.name).toBe("The Moon");
    expect(DECK[35]!.name).toBe("The Thread");
  });

  it("gives every card three keywords", () => {
    for (const c of DECK) expect(c.keywords).toHaveLength(3);
  });
});

describe("daily card", () => {
  it("is the same card for the same person all day", () => {
    const a = dailyCardFor("user-123", "2026-11-05");
    const b = dailyCardFor("user-123", "2026-11-05");
    expect(a.id).toBe(b.id);
  });

  it("changes across days for the same person over a week", () => {
    const week = ["01", "02", "03", "04", "05", "06", "07"].map(
      (d) => dailyCardFor("user-123", `2026-11-${d}`).id,
    );
    expect(new Set(week).size).toBeGreaterThan(1);
  });

  it("uses the local calendar date as the day key", () => {
    expect(localDateKey(new Date(2026, 10, 5, 23, 59))).toBe("2026-11-05");
    expect(localDateKey(new Date(2026, 10, 6, 0, 0))).toBe("2026-11-06");
  });
});

describe("roman numerals", () => {
  it("formats card numbers", () => {
    expect(toRoman(1)).toBe("I");
    expect(toRoman(4)).toBe("IV");
    expect(toRoman(9)).toBe("IX");
    expect(toRoman(36)).toBe("XXXVI");
  });
});
