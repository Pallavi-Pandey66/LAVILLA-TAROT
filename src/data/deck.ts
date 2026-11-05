/**
 * The Lumina Oracle deck — single source of truth for card content and motifs.
 * The database `cards` table is seeded from this exact data (same ids), so
 * readings and favorites reference these ids directly.
 */
export type OracleCardData = {
  deck?: "oracle" | "tarot";
  arcana?: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  sort_order?: number;
  numeral?: string;
  id: string;
  number: number;
  slug: string;
  name: string;
  theme: string;
  keywords: [string, string, string];
  message: string;
  reflection: string;
  motif: string;
};

const id = (n: number) => `a1000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

type Raw = Omit<OracleCardData, "id">;

const raw: Raw[] = [
  {
    number: 1,
    slug: "the-moon",
    name: "The Moon",
    theme: "intuition",
    keywords: ["Intuition", "Receptivity", "Inner knowing"],
    message:
      "Some truths arrive quietly, the way moonlight finds a room. Let yourself trust what you sense before you can fully explain it. Your inner knowing has been speaking softly all along.",
    reflection: "What do you already know that you have not yet said aloud?",
    motif: "crescent cradling a small circle",
  },
  {
    number: 2,
    slug: "the-sun",
    name: "The Sun",
    theme: "vitality",
    keywords: ["Vitality", "Warmth", "Presence"],
    message:
      "There is a warmth in you that does not need permission to shine. Let yourself be seen in your full light today. Energy returns when you stop dimming what is naturally bright.",
    reflection: "Where in your life are you ready to take up a little more space?",
    motif: "circle with 12 alternating long and short rays",
  },
  {
    number: 3,
    slug: "the-star",
    name: "The Star",
    theme: "hope",
    keywords: ["Hope", "Renewal", "Faith"],
    message:
      "Even on the darkest nights, a single point of light can guide the way home. Hope is not naivety; it is a quiet decision to keep looking up. Let something gentle restore you.",
    reflection: "What small light are you holding on to right now?",
    motif: "eight-pointed star inside a thin ring",
  },
  {
    number: 4,
    slug: "the-eye",
    name: "The Eye",
    theme: "clarity",
    keywords: ["Clarity", "Perception", "Honesty"],
    message:
      "When the noise settles, things become simple to see. Look at the situation as it is, not as you fear or wish it to be. Clear sight is a kindness you can offer yourself.",
    reflection: "If you looked at this with fresh eyes, what would you notice first?",
    motif: "almond eye with radiating rays above",
  },
  {
    number: 5,
    slug: "the-key",
    name: "The Key",
    theme: "unlocking",
    keywords: ["Access", "Solution", "Permission"],
    message:
      "The answer you have been searching for may already be in your hand. Sometimes what unlocks a situation is a single honest question or a small, brave step. Try the door again.",
    reflection: "What permission are you waiting to give yourself?",
    motif: "ornate key with a circular bow",
  },
  {
    number: 6,
    slug: "the-door",
    name: "The Door",
    theme: "threshold",
    keywords: ["Threshold", "Opportunity", "Courage"],
    message:
      "You are standing at the edge of something new, and light is already spilling through. You do not need to see the whole room to take the first step. Thresholds ask only for willingness.",
    reflection: "What is waiting for you on the other side of this choice?",
    motif: "arched doorway with light spilling through",
  },
  {
    number: 7,
    slug: "the-path",
    name: "The Path",
    theme: "direction",
    keywords: ["Direction", "Patience", "Progress"],
    message:
      "Not every road is straight, and that is part of its wisdom. Each turn has shaped your view of the horizon. Keep walking at your own pace; the way reveals itself as you go.",
    reflection: "What is the next single step you can take with confidence?",
    motif: "winding line rising to a horizon sun",
  },
  {
    number: 8,
    slug: "the-lantern",
    name: "The Lantern",
    theme: "guidance",
    keywords: ["Guidance", "Support", "Steadiness"],
    message:
      "You do not need to light the whole path, only the few steps in front of you. Guidance often comes in modest forms: a friend, a book, a quiet hunch. Let yourself be helped.",
    reflection: "Who or what has been a steady light for you lately?",
    motif: "hanging lantern with a small flame",
  },
  {
    number: 9,
    slug: "the-feather",
    name: "The Feather",
    theme: "lightness",
    keywords: ["Lightness", "Ease", "Play"],
    message:
      "Not everything needs to be carried so heavily. Allow a little softness, a little humor, a little air. What you hold lightly often moves more freely toward you.",
    reflection: "What could you set down today, even just for a while?",
    motif: "single feather with a fine central quill",
  },
  {
    number: 10,
    slug: "the-messenger",
    name: "The Messenger",
    theme: "signs",
    keywords: ["Signs", "Communication", "Attention"],
    message:
      "Pay gentle attention to what keeps returning: a word, a song, a thought. Meaning often travels on ordinary wings. Be open to the conversations life is trying to start with you.",
    reflection: "What message has been repeating itself in your life?",
    motif: "bird in flight, symmetrical wings",
  },
  {
    number: 11,
    slug: "the-serpent",
    name: "The Serpent",
    theme: "renewal",
    keywords: ["Renewal", "Cycles", "Shedding"],
    message:
      "Endings and beginnings are part of one continuous circle. You are allowed to outgrow old skins, habits and stories. What falls away makes room for a truer version of you.",
    reflection: "What are you ready to shed so that something new can grow?",
    motif: "ouroboros circle",
  },
  {
    number: 12,
    slug: "the-tree",
    name: "The Tree",
    theme: "growth and roots",
    keywords: ["Growth", "Grounding", "Belonging"],
    message:
      "The higher a tree reaches, the deeper its roots must go. Tend to what nourishes you beneath the surface. Steady growth is built on quiet, patient foundations.",
    reflection: "What keeps you rooted when life feels uncertain?",
    motif: "branches mirrored by roots inside a circle",
  },
  {
    number: 13,
    slug: "the-seed",
    name: "The Seed",
    theme: "potential",
    keywords: ["Potential", "Beginnings", "Trust"],
    message:
      "Something small and full of promise is beginning in you. It does not need to bloom today. Give it time, warmth and attention, and trust the unseen work of becoming.",
    reflection: "What idea or hope deserves a little more care from you?",
    motif: "seed splitting with a sprout",
  },
  {
    number: 14,
    slug: "the-mountain",
    name: "The Mountain",
    theme: "endurance",
    keywords: ["Endurance", "Resilience", "Perspective"],
    message:
      "Mountains are not climbed in a single stride. Your strength is shown in steady return, not in speed. Rest when you need to; the summit will still be there.",
    reflection: "What has your persistence already carried you through?",
    motif: "three peaks with a moon above",
  },
  {
    number: 15,
    slug: "the-river",
    name: "The River",
    theme: "flow",
    keywords: ["Flow", "Adaptability", "Movement"],
    message:
      "Water does not force its way; it finds its way. Let yourself move with what is unfolding rather than against it. There is grace in adapting without losing your direction.",
    reflection: "Where could you allow more ease instead of effort?",
    motif: "three sinuous parallel lines",
  },
  {
    number: 16,
    slug: "the-tide",
    name: "The Tide",
    theme: "release",
    keywords: ["Release", "Rhythm", "Surrender"],
    message:
      "Everything has its season of coming in and going out. You can let go without losing what truly matters. Trust the rhythm; what is meant for you returns in its own time.",
    reflection: "What are you holding on to that is ready to drift away?",
    motif: "curling wave with a crescent",
  },
  {
    number: 17,
    slug: "the-flame",
    name: "The Flame",
    theme: "passion",
    keywords: ["Passion", "Desire", "Creativity"],
    message:
      "There is a spark in you that wants to be tended, not hidden. Follow what makes you feel alive and curious. A small, steady flame can warm an entire life.",
    reflection: "What lights you up in a way you cannot quite explain?",
    motif: "teardrop flame with an inner flame",
  },
  {
    number: 18,
    slug: "the-wind",
    name: "The Wind",
    theme: "change",
    keywords: ["Change", "Freshness", "Movement"],
    message:
      "A change in the air is clearing space for something fresh. You do not have to know where the wind is going to feel its lift. Open the windows of your mind and breathe.",
    reflection: "What change would you welcome if fear were not part of it?",
    motif: "spiral gusts",
  },
  {
    number: 19,
    slug: "the-crystal",
    name: "The Crystal",
    theme: "focus",
    keywords: ["Focus", "Intention", "Precision"],
    message:
      "Light becomes brilliant when it passes through a clear form. Gather your attention on what matters most to you now. Fewer things, held with care, can shine brightly.",
    reflection: "What deserves your full and undivided attention?",
    motif: "faceted hexagonal gem",
  },
  {
    number: 20,
    slug: "the-mirror",
    name: "The Mirror",
    theme: "self-reflection",
    keywords: ["Reflection", "Self-awareness", "Acceptance"],
    message:
      "What you notice in others may be showing you something about yourself. Look with curiosity rather than judgment. Being honest with yourself is the beginning of being gentle with yourself.",
    reflection: "What are you learning about yourself through the people around you?",
    motif: "oval hand mirror with a star glint",
  },
  {
    number: 21,
    slug: "the-veil",
    name: "The Veil",
    theme: "mystery",
    keywords: ["Mystery", "Patience", "The unknown"],
    message:
      "Not everything is meant to be understood right away. Some things are revealed slowly, in their own time. Let the unknown be a place of wonder rather than worry.",
    reflection: "How might you rest more comfortably with what you cannot yet see?",
    motif: "draped curved lines over a circle",
  },
  {
    number: 22,
    slug: "the-bridge",
    name: "The Bridge",
    theme: "connection",
    keywords: ["Connection", "Reconciliation", "Understanding"],
    message:
      "A bridge is built from both sides. Reaching out, listening, or forgiving can close a distance that once felt wide. Connection often begins with one sincere gesture.",
    reflection: "Is there a relationship that would benefit from you reaching out?",
    motif: "arched bridge reflected in water",
  },
  {
    number: 23,
    slug: "the-compass",
    name: "The Compass",
    theme: "purpose",
    keywords: ["Purpose", "Values", "Orientation"],
    message:
      "When you feel unsure, return to what you value most. Your values are a quiet north that does not move. Let them orient your choices more than outside expectations.",
    reflection: "Which of your values feels most important to honor right now?",
    motif: "compass rose, 4 long points and 4 short",
  },
  {
    number: 24,
    slug: "the-hourglass",
    name: "The Hourglass",
    theme: "timing",
    keywords: ["Timing", "Patience", "Presence"],
    message:
      "Some things cannot be rushed, and some moments will not wait. Notice which is which. Being present with the grain of time falling now is often enough.",
    reflection: "Are you waiting for the right time, or is the right time now?",
    motif: "hourglass with a thin sand stream",
  },
  {
    number: 25,
    slug: "the-crown",
    name: "The Crown",
    theme: "sovereignty",
    keywords: ["Sovereignty", "Self-respect", "Leadership"],
    message:
      "You are the author of your own choices. Wear your dignity lightly but surely. Leading your life with kindness and conviction is its own quiet kind of royalty.",
    reflection: "Where are you being called to stand in your own authority?",
    motif: "minimal three-point crown with small orbs",
  },
  {
    number: 26,
    slug: "the-open-heart",
    name: "The Open Heart",
    theme: "compassion",
    keywords: ["Compassion", "Tenderness", "Openness"],
    message:
      "An open heart is not a fragile one; it is a brave one. Offer yourself the same compassion you so easily give to others. Softness can be a source of great strength.",
    reflection: "How can you be a little kinder to yourself today?",
    motif: "heart outline with a small star inside",
  },
  {
    number: 27,
    slug: "the-hands",
    name: "The Hands",
    theme: "offering",
    keywords: ["Generosity", "Receiving", "Service"],
    message:
      "Open hands can both give and receive. Notice what you have to offer and what you are being offered in return. Exchange, freely made, enriches everyone involved.",
    reflection: "What gift could you share, and what help could you accept?",
    motif: "two open palms holding a small orb",
  },
  {
    number: 28,
    slug: "the-anchor",
    name: "The Anchor",
    theme: "stability",
    keywords: ["Stability", "Security", "Calm"],
    message:
      "When the waters feel restless, return to what holds you steady. Simple routines, trusted people and familiar places can ground you. Stability is something you can create from within.",
    reflection: "What helps you feel safe and steady when things move quickly?",
    motif: "anchor inside a circle",
  },
  {
    number: 29,
    slug: "the-butterfly",
    name: "The Butterfly",
    theme: "transformation",
    keywords: ["Transformation", "Growth", "Emergence"],
    message:
      "Change can feel uncomfortable while it is happening. Yet every stage has its purpose, even the quiet and hidden ones. Something beautiful is forming in you.",
    reflection: "What part of you is in the middle of becoming something new?",
    motif: "symmetrical wings",
  },
  {
    number: 30,
    slug: "the-owl",
    name: "The Owl",
    theme: "wisdom",
    keywords: ["Wisdom", "Observation", "Discernment"],
    message:
      "Wisdom often speaks the least and notices the most. Take a moment to observe before you respond. You may find that the right answer is calmer than you expected.",
    reflection: "What would the wisest version of you do in this situation?",
    motif: "geometric owl face",
  },
  {
    number: 31,
    slug: "the-lotus",
    name: "The Lotus",
    theme: "awakening",
    keywords: ["Awakening", "Grace", "Rising"],
    message:
      "The lotus grows from the mud and blooms clean above the water. Your experiences, even the difficult ones, have fed your growth. Let yourself open toward the light.",
    reflection: "What has a challenging time taught you that you now value?",
    motif: "seven-petal lotus",
  },
  {
    number: 32,
    slug: "the-spiral",
    name: "The Spiral",
    theme: "inner journey",
    keywords: ["Inner journey", "Depth", "Returning"],
    message:
      "You may feel as if you are circling the same lessons, but each turn brings you closer to the center. Growth is rarely linear. Every return carries new understanding.",
    reflection: "What familiar lesson is showing up again, and what is different this time?",
    motif: "golden-ratio spiral",
  },
  {
    number: 33,
    slug: "the-eclipse",
    name: "The Eclipse",
    theme: "shadow work",
    keywords: ["Shadow", "Integration", "Wholeness"],
    message:
      "The parts of yourself you keep in shadow still deserve understanding. Meeting them with patience makes you more whole, not less. Light and dark together create the full picture.",
    reflection: "What part of yourself would benefit from more acceptance?",
    motif: "circle overlapping a crescent with a corona",
  },
  {
    number: 34,
    slug: "the-dawn",
    name: "The Dawn",
    theme: "new beginnings",
    keywords: ["Beginnings", "Freshness", "Possibility"],
    message:
      "Every morning offers a clean page. You do not have to carry yesterday into today. Begin again, gently, with whatever light you have.",
    reflection: "If today were a fresh start, how would you like it to begin?",
    motif: "half sun on a horizon line",
  },
  {
    number: 35,
    slug: "the-chalice",
    name: "The Chalice",
    theme: "abundance",
    keywords: ["Abundance", "Gratitude", "Fullness"],
    message:
      "Your cup is fuller than it may seem. Gratitude has a way of revealing riches that were already present. Let yourself receive, enjoy and share what is good.",
    reflection: "What are you grateful for that you rarely pause to notice?",
    motif: "chalice with a rising star",
  },
  {
    number: 36,
    slug: "the-thread",
    name: "The Thread",
    theme: "connection and fate",
    keywords: ["Connection", "Meaning", "Weaving"],
    message:
      "The moments of your life are stitched together in ways you may only see later. People, places and choices weave a larger pattern. Trust that your thread belongs in the whole.",
    reflection: "Looking back, which unexpected connection shaped you the most?",
    motif: "continuous looped thread with a small needle",
  },
];

export const DECK: OracleCardData[] = raw.map((c) => ({ ...c, id: id(c.number) }));

export const DECK_BY_SLUG: Record<string, OracleCardData> = Object.fromEntries(
  DECK.map((c) => [c.slug, c]),
);

export const DECK_BY_ID: Record<string, OracleCardData> = Object.fromEntries(
  DECK.map((c) => [c.id, c]),
);

export const THEMES: string[] = Array.from(new Set(DECK.map((c) => c.theme))).sort();
