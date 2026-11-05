import { DECK } from "./deck";
import { TAROT_DECK } from "./tarot";

export { DECK, TAROT_DECK };
export const ALL_CARDS = [...DECK, ...TAROT_DECK];
export const CARDS_BY_SLUG = Object.fromEntries(ALL_CARDS.map((card) => [card.slug, card]));
export const CARDS_BY_ID = Object.fromEntries(ALL_CARDS.map((card) => [card.id, card]));
export const cardNumeral = (card: (typeof ALL_CARDS)[number]) => card.numeral;