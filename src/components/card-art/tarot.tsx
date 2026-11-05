import type { ReactNode } from "react";
import type { OracleCardData } from "@/data/deck";
import { Art, Rays, starPoints, type ArtProps } from "./primitives";

const Star = ({ x = 50, y = 30, r = 9, n = 4 }: { x?: number | undefined; y?: number | undefined; r?: number; n?: number }) => <polygon points={starPoints(x, y, n, r, r * .4)} />;
const Sun = ({ x = 50, y = 25, r = 10 }: { x?: number; y?: number; r?: number }) => <><circle cx={x} cy={y} r={r} /><Rays cx={x} cy={y} r1={r + 3} r2={r + 9} count={12} alt={r + 6} /></>;
const Moon = () => <path d="M56 10 A13 13 0 1 0 66 31 A12 12 0 0 1 56 10Z" />;
const Infinity = () => <path d="M50 20 C28 0 20 38 50 20 C80 0 72 38 50 20Z" />;
const Cup = () => <><path d="M-8 -10 H8 V-3 Q8 5 0 5 Q-8 5 -8 -3Z M0 5 V13 M-6 13 H6" /></>;
const Wand = () => <path d="M-2 -18 L2 18 M-2 -8 Q-12 -15 -8 -19 Q-1 -17 -2 -8 M1 7 Q12 1 10 -5 Q2 -3 1 7" />;
const Sword = () => <path d="M0 -22 L4 -15 L2 10 H9 M2 10 H-9 M-2 10 L-4 -15 L0 -22 M0 10 V20 M-3 20 H3" />;
const Pentacle = () => <><circle r={9} /><polygon points={starPoints(0, 0, 5, 8, 3.1)} /></>;
const Crown = ({ queen = false }: { queen?: boolean }) => queen ? <path d="M38 18 Q50 32 62 18 Q58 38 50 38 Q42 38 38 18Z" /> : <><path d="M35 34 L32 19 L42 25 L50 15 L58 25 L68 19 L65 34Z" /><circle cx="50" cy="12" r="2" /><circle cx="30" cy="17" r="2" /><circle cx="70" cy="17" r="2" /></>;
const Horizon = () => <path d="M12 76 H88" />;
const Arch = () => <path d="M18 90 V39 Q50 -2 82 39 V90" />;

function Major({ index }: { index: number }) {
  const motifs: ReactNode[] = [
    <><Sun x={72} y={22} r={9} /><circle cx="40" cy="50" r="6" /><path d="M18 68 H42 L56 88 M40 56 L52 65 L65 61" /></>,
    <><Infinity /><path d="M50 40 L55 84 M15 63 H85" /><g transform="translate(24 76) scale(.35)"><Wand /></g><g transform="translate(40 77) scale(.45)"><Cup /></g><g transform="translate(59 77) scale(.35)"><Sword /></g><g transform="translate(77 77) scale(.5)"><Pentacle /></g></>,
    <><Moon /><path d="M18 85 V20 H28 V85 M72 85 V20 H82 V85 M30 35 Q50 50 70 35 M30 45 Q50 60 70 45 M30 55 Q50 70 70 55" /></>,
    <><circle cx="50" cy="47" r="16" /><path d="M50 63 V89 M40 79 H60 M23 18 Q50 1 77 18 M20 87 Q20 56 30 43 M80 87 Q80 56 70 43" />{Array.from({ length: 12 }, (_, i) => <Star key={i} x={22 + i * 5} y={18 - 11 * Math.sin(i * Math.PI / 11)} r={1.6} />)}</>,
    <><path d="M25 83 V32 H75 V83Z M20 87 H80 M30 32 Q8 12 26 15 Q35 15 35 26 M70 32 Q92 12 74 15 Q65 15 65 26 M84 35 V82" /><Star x={84} y={29} r={5} /></>,
    <><path d="M50 14 V62 M41 25 H59 M36 36 H64 M30 47 H70 M30 73 L70 89 M70 73 L30 89" /><circle cx="28" cy="72" r="5" /><circle cx="72" cy="72" r="5" /></>,
    <><Sun /><circle cx="38" cy="66" r="21" /><circle cx="62" cy="66" r="21" /></>,
    <><path d="M22 85 V43 H78 V85Z M18 43 L26 18 H74 L82 43Z" /><Star y={30} r={8} /><path d="M37 53 A11 11 0 1 0 37 76 A9 9 0 0 1 37 53 M63 53 A11 11 0 1 1 63 76 A9 9 0 0 0 63 53" /></>,
    <><Infinity /><circle cx="50" cy="62" r="29" /><path d="M28 44 L38 40 L50 46 L62 40 L72 44 L65 72 L50 84 L35 72Z M40 55 L44 57 M60 55 L56 57 M45 66 H55 L50 72Z" /></>,
    <><path d="M29 28 H65 V74 H29Z M36 28 V20 Q47 10 58 20 V28 M80 13 V88" /><Star x={47} y={51} n={6} r={12} /></>,
    <><circle cx="50" cy="50" r="31" /><circle cx="50" cy="50" r="25" /><Rays cx={50} cy={50} r1={0} r2={31} count={8} />{[[13,13],[87,13],[13,87],[87,87]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2" />)}</>,
    <><path d="M50 12 L54 21 L52 79 M48 79 V21 L50 12 M40 77 H60 M50 33 H80 M50 33 H20 M20 33 L10 62 H30Z M80 33 L70 62 H90Z" /></>,
    <><path d="M15 15 H85 M50 15 V34 L25 39 L50 79 L75 39Z" /><circle cx="50" cy="79" r="11" /></>,
    <><Sun x={50} y={73} r={10} /><Horizon />{Array.from({length:5},(_,i)=><ellipse key={i} cx="50" cy="30" rx="7" ry="17" transform={`rotate(${i*72} 50 45)`} />)}<circle cx="50" cy="45" r="6" /></>,
    <><g transform="translate(23 40)"><Cup /></g><g transform="translate(77 62)"><Cup /></g><path d="M31 38 Q48 37 70 57" /><circle cx="50" cy="78" r="10" /><path d="M50 70 L57 83 H43Z" /></>,
    <><circle cx="50" cy="42" r="28" /><polygon points={starPoints(50,42,5,25,9,90)} /><ellipse cx="31" cy="80" rx="7" ry="12" transform="rotate(-30 31 80)" /><ellipse cx="69" cy="80" rx="7" ry="12" transform="rotate(30 69 80)" /></>,
    <><path d="M30 90 V37 H70 V90 M55 12 L39 45 H56 L44 72 M27 26 L25 14 L40 20 L50 9 L60 20 L75 14 L73 26Z" /><Star x={18} y={51} r={3} /><Star x={81} y={66} r={3} /></>,
    <><Star y={38} r={21} n={8} />{[[15,20],[85,20],[19,52],[81,52],[28,72],[72,72],[50,79]].map(([x,y],i)=><Star key={i} x={x} y={y} r={4} n={8} />)}<path d="M15 89 Q50 81 85 89" /></>,
    <><circle cx="50" cy="25" r="15" /><path d="M15 72 V36 H29 V72 M71 72 V36 H85 V72 M50 45 Q31 59 51 70 Q71 81 50 93 M35 46 L33 50 M65 46 L67 50" /></>,
    <><Sun y={38} r={23} /><path d="M15 82 H85 M15 88 H85 M30 82 V88 M50 82 V88 M70 82 V88" /></>,
    <><path d="M25 20 H55 L75 12 V36 L55 28 H25Z M40 28 V40 Q40 48 50 48 M70 43 L80 53 M60 44 L62 58 M50 73 Q25 52 10 75 M80 75 Q65 52 50 73 M20 88 Q50 60 80 88" /></>,
    <><ellipse cx="50" cy="50" rx="27" ry="39" /><ellipse cx="50" cy="50" rx="32" ry="43" /><Star y={50} r={17} />{[[10,12],[90,12],[10,88],[90,88]].map(([x,y],i)=><Star key={i} x={x} y={y} r={5} n={i%2?4:6} />)}</>,
  ];
  return motifs[index] ?? null;
}

function Minor({ card }: { card: OracleCardData }) {
  const rank = card.number;
  const Symbol = card.suit === "wands" ? Wand : card.suit === "cups" ? Cup : card.suit === "swords" ? Sword : Pentacle;
  const count = Math.min(rank, 10);
  let positions = Array.from({ length: count }, (_, i) => ({
    x: count === 1 ? 50 : 26 + (i % (count > 6 ? 3 : 2)) * (count > 6 ? 24 : 48),
    y: count === 1 ? 52 : 32 + Math.floor(i / (count > 6 ? 3 : 2)) * (count > 6 ? 16 : 20),
  }));
  if (card.suit === "wands" && [5,7,8,9,10].includes(rank)) {
    positions = Array.from({length: count}, (_, i) => ({x: 18 + i * 64 / Math.max(1,count - 1), y: rank === 7 && i === 6 ? 24 : rank === 8 ? 24 + i * 6 : 56}));
  }
  if (card.suit === "cups" && [3,6,7,9,10].includes(rank)) {
    positions = Array.from({length: count}, (_, i) => ({x: 15 + i * 70 / Math.max(1,count - 1), y: 55 - 15 * Math.sin(i * Math.PI / Math.max(1,count - 1))}));
  }
  if (card.suit === "pentacles" && rank === 2) positions = [{x:27,y:50},{x:73,y:50}];
  if (card.suit === "pentacles" && rank === 4) positions = [{x:50,y:18},{x:50,y:50},{x:26,y:80},{x:74,y:80}];
  if (card.suit === "pentacles" && rank === 8) positions = Array.from({length:8},(_,i)=>({x:50,y:10+i*11}));
  if (card.suit === "pentacles" && rank === 10) positions = [{x:50,y:8},{x:25,y:23},{x:75,y:23},{x:50,y:38},{x:25,y:51},{x:75,y:51},{x:50,y:64},{x:25,y:77},{x:75,y:77},{x:50,y:92}];
  if (rank > 10) return <>
    {rank === 11 ? <Star y={22} /> : rank === 12 ? <path d="M37 28 L50 15 L63 28" /> : <Crown queen={rank === 13} />}
    <g transform="translate(50 66) scale(1.35)"><Symbol /></g>
  </>;
  return <>
    {positions.map(({x,y},i)=><g key={i} transform={`translate(${x} ${y}) rotate(${card.suit==='wands' && rank===8 ? 40 : card.suit==='wands' && [2,5,10].includes(rank) ? (i-count/2)*12 : card.suit==='cups' && rank===5 && i<3 ? 180 : card.suit==='swords' && [5,7].includes(rank) && i<3 ? 65 : 0}) scale(${rank===1?1.7:card.suit==='pentacles'&&rank===8?.55:card.suit==='pentacles'?.9:.65})`}><Symbol /></g>)}
    {rank===1 && <path d="M12 37 Q20 24 29 34 Q35 17 44 26" />}
    {card.suit==='wands' && rank===2 && <circle cx="50" cy="75" r="10" />}
    {card.suit==='wands' && rank===3 && <path d="M65 81 L76 68 V81Z M60 85 H86" />}
    {card.suit==='wands' && rank===4 && <path d="M18 20 Q50 43 82 20" />}
    {card.suit==='wands' && rank===6 && <ellipse cx="75" cy="23" rx="10" ry="6" />}
    {card.suit==='wands' && rank===7 && <path d="M12 88 L88 70" />}
    {card.suit==='wands' && rank===10 && <path d="M28 55 Q50 63 72 55 M28 59 Q50 67 72 59" />}
    {card.suit==='cups' && rank===1 && <><path d="M34 61 Q26 81 20 84 M42 64 Q37 83 32 89 M50 65 V92 M58 64 Q63 83 68 89 M66 61 Q74 81 80 84 M41 12 L50 18 L59 12 L50 26Z" /></>}
    {card.suit==='cups' && rank===2 && <path d="M50 43 V82 M42 48 Q65 57 42 66 Q64 72 50 80 M58 48 Q35 57 58 66 Q36 72 50 80" />}
    {card.suit==='cups' && rank===3 && <path d="M12 78 Q50 91 88 78" />}
    {card.suit==='cups' && rank===4 && <path d="M67 42 Q72 24 83 34 Q93 16 97 36" />}
    {card.suit==='cups' && rank===6 && positions.map(({x,y},i)=><Star key={i} x={x} y={y-14} r={3} n={5} />)}
    {card.suit==='cups' && rank===7 && <><path d="M8 74 Q21 61 33 73 Q48 56 61 73 Q75 60 92 73" />{positions.map(({x,y},i)=><Star key={i} x={x} y={y-12} r={2} n={3+i%5} />)}</>}
    {card.suit==='cups' && rank===9 && <path d="M10 66 Q50 49 90 66" />}
    {card.suit==='cups' && rank===10 && <><path d="M10 20 Q50 -9 90 20 M13 24 Q50 -1 87 24" /></>}
    {card.suit==='cups' && rank===8 && <><Moon /><path d="M58 75 Q85 83 78 96" /></>}
    {card.suit==='swords' && rank===3 && <path d="M50 79 L25 53 Q15 29 36 34 L50 45 L64 34 Q85 29 75 53Z" />}
    {card.suit==='swords' && rank===6 && <path d="M12 73 H88 L76 87 H24Z M10 94 Q30 86 50 94 Q70 86 90 94" />}
    {card.suit==='swords' && rank===4 && <Arch />}
    {card.suit==='swords' && [2,9].includes(rank) && <Moon />}
    {card.suit==='swords' && rank===3 && <path d="M18 10 L14 22 M30 8 L26 20 M70 8 L66 20 M82 10 L78 22" />}
    {card.suit==='swords' && rank===5 && <path d="M12 17 L25 23 L36 15 L50 21 L65 13 L85 22" />}
    {card.suit==='swords' && rank===8 && <circle cx="50" cy="58" r="5" />}
    {card.suit==='swords' && rank===10 && <><Horizon /><Sun y={83} r={6} /></>}
    {card.suit==='pentacles' && [3,5].includes(rank) && <Arch />}
    {card.suit==='pentacles' && rank===1 && <path d="M25 94 Q50 73 75 94" />}
    {card.suit==='pentacles' && rank===2 && <path d="M50 50 C5 5 0 93 50 50 C100 5 95 93 50 50Z" />}
    {card.suit==='pentacles' && rank===5 && [12,30,70,88].map((x,i)=><circle key={i} cx={x} cy={14+i*22} r="1" />)}
    {card.suit==='pentacles' && rank===9 && <path d="M77 17 Q85 27 91 15 M85 22 L88 32" />}
    {card.suit==='pentacles' && rank===10 && <path d="M50 8 L25 23 L75 23 L50 38 L25 51 L75 51 L50 64 L25 77 L75 77 L50 92 M50 8 V92" opacity=".4" />}
    {card.suit==='pentacles' && [7,9].includes(rank) && <path d="M12 91 Q32 66 12 46 Q2 25 22 13" />}
    {card.suit==='pentacles' && rank===6 && <path d="M50 64 V88 M38 71 H62 M38 71 L30 83 H46Z M62 71 L54 83 H70Z" />}
  </>;
}

export function TarotArt({ card, ...props }: ArtProps & { card: OracleCardData }) {
  return <Art {...props}>{card.arcana === "major" ? <Major index={card.sort_order ?? 0} /> : <Minor card={card} />}</Art>;
}