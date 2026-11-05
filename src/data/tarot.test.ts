import { describe, expect, it } from "vitest";
import { DECK } from "./deck";
import { TAROT_DECK } from "./tarot";
import { ALL_CARDS, CARDS_BY_ID, CARDS_BY_SLUG } from "./catalog";

describe("uploaded tarot deck", () => {
  it("contains all 78 cards in supplied order, without replacing the 36 oracle cards", () => {
    expect(TAROT_DECK).toHaveLength(78);
    expect(DECK).toHaveLength(36);
    expect(TAROT_DECK.map((c) => c.sort_order)).toEqual(Array.from({ length: 78 }, (_, i) => i));
    expect(new Set(ALL_CARDS.map((c) => c.id)).size).toBe(114);
    expect(new Set(ALL_CARDS.map((c) => c.slug)).size).toBe(114);
  });

  it("uses 0 for the Fool and Roman numerals I through XXI for the Major Arcana", () => {
    const major = TAROT_DECK.filter((c) => c.arcana === "major");
    expect(major).toHaveLength(22);
    expect(major[0]?.name).toBe("The Fool");
    expect(major[0]?.numeral).toBe("0");
    expect(major[1]?.numeral).toBe("I");
    expect(major[21]?.numeral).toBe("XXI");
  });

  for (const [suit, start] of [["wands",22],["cups",36],["swords",50],["pentacles",64]] as const) {
    it(`orders fourteen ${suit} from ${start} through ${start + 13}`, () => {
      const cards = TAROT_DECK.filter((c) => c.suit === suit);
      expect(cards).toHaveLength(14);
      expect(cards[0]?.sort_order).toBe(start);
      expect(cards[13]?.sort_order).toBe(start + 13);
      expect(cards[0]?.name).toBe(`Ace of ${suit[0]?.toUpperCase()}${suit.slice(1)}`);
      expect(cards[13]?.name).toBe(`King of ${suit[0]?.toUpperCase()}${suit.slice(1)}`);
    });
  }

  it("preserves the non-morbid renewal motif for Death", () => {
    expect(CARDS_BY_SLUG["tarot-death"]?.motif).toBe("five-petal rose with a rising sun on the horizon (renewal, never morbid)");
    expect(CARDS_BY_ID[TAROT_DECK[13]?.id ?? ""]?.name).toBe("Death");
  });
});