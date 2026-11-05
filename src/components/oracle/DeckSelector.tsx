import { Button } from "@/components/ui/button";

export function DeckSelector({ value, onChange }: {
  value: "oracle" | "tarot";
  onChange: (value: "oracle" | "tarot") => void;
}) {
  return <div className="mx-auto flex w-fit gap-2" role="group" aria-label="Deck">
    <Button variant={value === "oracle" ? "default" : "ritual"} aria-pressed={value === "oracle"} onClick={() => onChange("oracle")}>Oracle · 36</Button>
    <Button variant={value === "tarot" ? "default" : "ritual"} aria-pressed={value === "tarot"} onClick={() => onChange("tarot")}>Tarot · 78</Button>
  </div>;
}